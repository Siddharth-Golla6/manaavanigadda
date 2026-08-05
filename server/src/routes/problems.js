import { Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../constants.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { sendSms } from "../services/sms.js";
import { isValidPhotoDataUri } from "../utils/validatePhoto.js";
import { uploadPhotos } from "../services/storage.js";

const MAX_PHOTOS = 10;

const router = Router();

const PROBLEM_INCLUDE = {
  photos: { orderBy: { position: "asc" } },
  progressPhotos: { orderBy: { createdAt: "asc" } },
  comments: { orderBy: { createdAt: "asc" } },
  statusHistory: { orderBy: { date: "asc" } },
};

// Reshapes a Prisma Problem (with its related rows included) back into the
// same flat JSON shape the frontend has always consumed — photos/comments/
// timeline as plain arrays, not Prisma's relation objects.
function toProblemJSON(problem) {
  return {
    id: problem.id,
    title: problem.title,
    description: problem.description,
    category: problem.category,
    photo: problem.photo,
    photos: problem.photos.map((p) => p.url),
    constituency: problem.constituency,
    mandalId: problem.mandalId,
    mandalName: problem.mandalName,
    village: problem.village,
    status: problem.status,
    priority: problem.priority,
    lat: problem.lat,
    lng: problem.lng,
    reportedBy: problem.reportedById,
    reportedByName: problem.reportedByName,
    supportCount: problem.supportCount,
    assignedVolunteer: problem.assignedVolunteer,
    comments: problem.comments.map((c) => ({ author: c.author, text: c.text, date: c.createdAt })),
    timeline: problem.statusHistory.map((s) => ({ status: s.status, date: s.date })),
    progressPhotos: problem.progressPhotos.map((p) => p.url),
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt,
  };
}

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { mandalId, village, category, priority, status, q } = req.query;
    const where = {};
    if (mandalId) where.mandalId = mandalId;
    if (village) where.village = village;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (status) where.status = status;
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { reportedByName: { contains: q, mode: "insensitive" } },
        { village: { contains: q, mode: "insensitive" } },
      ];
    }
    const problems = await prisma.problem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: PROBLEM_INCLUDE,
    });
    res.json({ problems: problems.map(toProblemJSON) });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const problem = await prisma.problem.findUnique({
      where: { id: req.params.id },
      include: PROBLEM_INCLUDE,
    });
    if (!problem) return res.status(404).json({ error: "Problem not found." });
    res.json({ problem: toProblemJSON(problem) });
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, description, category, mandalId, mandalName, village, photo, photos, lat, lng } = req.body;

    if (!title?.trim() || !description?.trim() || !category || !mandalId || !mandalName) {
      return res.status(400).json({ error: "Title, description, category, and Mandal are required." });
    }
    if (!CATEGORY_OPTIONS.includes(category)) {
      return res.status(400).json({ error: "Invalid category." });
    }

    const photoList = Array.isArray(photos) ? photos.filter(Boolean).slice(0, MAX_PHOTOS) : [];
    if (photoList.length === 0 && photo) photoList.push(photo);

    if (photoList.some((p) => !isValidPhotoDataUri(p))) {
      return res.status(400).json({ error: "Photos must be valid image files." });
    }

    let uploadedPhotos;
    try {
      uploadedPhotos = await uploadPhotos(photoList, { keyPrefix: "problems" });
    } catch (err) {
      console.error("[storage] photo upload failed:", err.message);
      return res.status(502).json({ error: "Couldn't upload photos right now. Please try again." });
    }

    const problem = await prisma.problem.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        mandalId,
        mandalName,
        village: village || "Not specified",
        photo: uploadedPhotos[0] || null,
        lat: lat ?? null,
        lng: lng ?? null,
        reportedById: req.user.id,
        reportedByName: req.user.name,
        // status/priority intentionally NOT taken from the client — new reports always
        // start as "New" / "Medium"; priority is admin-only from here on.
        photos: { create: uploadedPhotos.map((url, position) => ({ url, position })) },
        statusHistory: { create: [{ status: "New" }] },
      },
      include: PROBLEM_INCLUDE,
    });

    res.status(201).json({ problem: toProblemJSON(problem) });
  })
);

// Admin-only fields: status, priority, assignedVolunteer. A resident can never set
// their own priority — that rule is enforced here, not just hidden in the UI.
router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const existing = await prisma.problem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Problem not found." });

    const { status, priority, assignedVolunteer } = req.body;
    const data = {};

    if (status !== undefined) {
      if (!STATUS_OPTIONS.includes(status)) return res.status(400).json({ error: "Invalid status." });
      data.status = status;
      data.statusHistory = { create: [{ status }] };
    }
    if (priority !== undefined) {
      if (!PRIORITY_OPTIONS.includes(priority)) return res.status(400).json({ error: "Invalid priority." });
      data.priority = priority;
    }
    if (assignedVolunteer !== undefined) {
      data.assignedVolunteer = assignedVolunteer;
    }

    const problem = await prisma.problem.update({
      where: { id: existing.id },
      data,
      include: PROBLEM_INCLUDE,
    });

    // Notifications are best-effort — sendSms() never throws, so a delivery
    // failure here can't fail the admin's status/assignment update.
    if (status !== undefined) {
      const reporter = await prisma.user.findUnique({ where: { id: problem.reportedById } });
      if (reporter) {
        sendSms({
          to: reporter.phone,
          templateKey: "statusChange",
          params: { title: problem.title, status: problem.status },
          language: reporter.preferredLanguage,
        });
      }
    }
    if (assignedVolunteer) {
      const volunteer = await prisma.volunteer.findFirst({
        where: { name: assignedVolunteer },
        include: { user: true },
      });
      if (volunteer?.user?.phone) {
        sendSms({
          to: volunteer.user.phone,
          templateKey: "assignment",
          params: { title: problem.title, mandalName: problem.mandalName },
          language: volunteer.user.preferredLanguage,
        });
      }
    }
    res.json({ problem: toProblemJSON(problem) });
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    try {
      // Child rows (photos, comments, status history, progress photos,
      // supporters) cascade-delete via the FK constraints in the schema.
      await prisma.problem.delete({ where: { id: req.params.id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        return res.status(404).json({ error: "Problem not found." });
      }
      throw err;
    }
    res.status(204).end();
  })
);

router.post(
  "/:id/comments",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: "Comment text is required." });

    const existing = await prisma.problem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Problem not found." });

    const problem = await prisma.problem.update({
      where: { id: existing.id },
      data: { comments: { create: [{ author: req.user.name, text: text.trim() }] } },
      include: PROBLEM_INCLUDE,
    });
    res.status(201).json({ problem: toProblemJSON(problem) });
  })
);

router.post(
  "/:id/upvote",
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await prisma.problem.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: "Problem not found." });

    try {
      await prisma.$transaction([
        prisma.problemSupport.create({ data: { problemId: existing.id, userId: req.user.id } }),
        prisma.problem.update({ where: { id: existing.id }, data: { supportCount: { increment: 1 } } }),
      ]);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        return res.status(409).json({ error: "You've already supported this issue." });
      }
      throw err;
    }

    const problem = await prisma.problem.findUnique({ where: { id: existing.id }, include: PROBLEM_INCLUDE });
    res.json({ problem: toProblemJSON(problem) });
  })
);

export default router;
