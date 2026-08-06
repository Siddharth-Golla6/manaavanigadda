import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { ROLE_OPTIONS } from "../constants.js";
import { toSafeUser } from "../utils/safeUser.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get(
  "/",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ users: users.map(toSafeUser) });
  })
);

// Only an Administrator can grant the Administrator role, or change the role of
// an existing Administrator — a Mandal Admin (also allowed past requireAdmin
// above) must not be able to promote anyone to, or demote anyone from, the
// top permission level.
router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!role || !ROLE_OPTIONS.includes(role)) {
      return res.status(400).json({ error: "Invalid role." });
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: "User not found." });

    const isSelfAdministrator = req.user.role === "Administrator";
    if ((role === "Administrator" || target.role === "Administrator") && !isSelfAdministrator) {
      return res.status(403).json({ error: "You don't have permission to do that." });
    }

    const updated = await prisma.user.update({ where: { id: target.id }, data: { role } });
    res.json({ user: toSafeUser(updated) });
  })
);

// Interim stand-in for self-service "forgot password" — that flow needs live
// SMS delivery, which isn't configured yet. Until then, a Mandal Admin or
// Administrator can set a new password for a resident directly (e.g. after
// verifying their identity by phone). Same Administrator-target restriction
// as the role/delete routes above.
router.patch(
  "/:id/password",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password should be at least 6 characters." });
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: "User not found." });
    if (target.role === "Administrator" && req.user.role !== "Administrator") {
      return res.status(403).json({ error: "You don't have permission to do that." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: target.id }, data: { passwordHash } });
    res.status(204).end();
  })
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: "You can't remove your own account." });
    }

    const target = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!target) return res.status(404).json({ error: "User not found." });
    if (target.role === "Administrator" && req.user.role !== "Administrator") {
      return res.status(403).json({ error: "You don't have permission to do that." });
    }

    await prisma.user.delete({ where: { id: target.id } });
    res.status(204).end();
  })
);

export default router;
