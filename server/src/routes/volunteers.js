import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { mandalId } = req.query;
    const volunteers = await prisma.volunteer.findMany({
      where: mandalId ? { mandalId } : {},
      orderBy: { points: "desc" },
    });
    res.json({ volunteers });
  })
);

export default router;
