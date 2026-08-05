import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { signToken } from "../utils/jwt.js";
import { toSafeUser } from "../utils/safeUser.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { sendSms } from "../services/sms.js";

const router = Router();

const OTP_TTL_MS = 5 * 60 * 1000; // code validity
const OTP_RESEND_COOLDOWN_MS = 45 * 1000;
const OTP_MAX_ATTEMPTS = 5;

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

router.post(
  "/otp/send",
  asyncHandler(async (req, res) => {
    const { phone, purpose, language } = req.body;
    const cleanPhone = (phone || "").trim();
    if (!cleanPhone || !["register", "login"].includes(purpose)) {
      return res.status(400).json({ error: "Phone number and a valid purpose are required." });
    }

    const existingUser = await prisma.user.findUnique({ where: { phone: cleanPhone } });
    if (purpose === "register" && existingUser) {
      return res.status(409).json({ error: "An account with this phone number already exists. Try logging in instead." });
    }
    if (purpose === "login" && !existingUser) {
      return res.status(404).json({ error: "No account found with this phone number." });
    }

    const recent = await prisma.otpCode.findFirst({
      where: { phone: cleanPhone, purpose },
      orderBy: { createdAt: "desc" },
    });
    if (recent && Date.now() - recent.createdAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
      return res.status(429).json({ error: "Please wait before requesting another code." });
    }

    const code = generateOtp();
    const codeHash = await bcrypt.hash(code, 10);
    await prisma.otpCode.create({
      data: {
        phone: cleanPhone,
        purpose,
        codeHash,
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
      },
    });

    const lang = existingUser?.preferredLanguage || (language === "te" ? "te" : "en");
    const result = await sendSms({ to: cleanPhone, templateKey: "otp", params: { code }, language: lang });
    if (!result.ok) {
      return res.status(502).json({ error: "Couldn't send the verification code. Please try again." });
    }

    res.json({
      message: `A verification code was sent to the number ending ${cleanPhone.slice(-4)}.`,
    });
  })
);

router.post(
  "/otp/verify",
  asyncHandler(async (req, res) => {
    const { phone, code, purpose } = req.body;
    const cleanPhone = (phone || "").trim();
    if (!cleanPhone || !code || !["register", "login"].includes(purpose)) {
      return res.status(400).json({ error: "Phone number, code, and purpose are required." });
    }

    const otp = await prisma.otpCode.findFirst({
      where: { phone: cleanPhone, purpose, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
    if (!otp) {
      return res.status(400).json({ error: "No pending verification for this number. Request a new code." });
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({ error: "Too many incorrect attempts. Request a new code." });
    }

    const ok = await bcrypt.compare(String(code), otp.codeHash);
    if (!ok) {
      await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: otp.attempts + 1 } });
      return res.status(401).json({ error: "Incorrect code." });
    }

    if (purpose === "login") {
      const user = await prisma.user.findUnique({ where: { phone: cleanPhone } });
      if (!user) return res.status(404).json({ error: "No account found with this phone number." });
      await prisma.otpCode.deleteMany({ where: { phone: cleanPhone, purpose: "login" } });
      return res.json({ token: signToken(user), user: toSafeUser(user) });
    }

    await prisma.otpCode.update({ where: { id: otp.id }, data: { verifiedAt: new Date() } });
    res.json({ verified: true });
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, phone, password, mandalId } = req.body;
    if (!name?.trim() || !phone?.trim() || !password) {
      return res.status(400).json({ error: "Name, phone, and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password should be at least 6 characters." });
    }

    const existing = await prisma.user.findUnique({ where: { phone: phone.trim() } });
    if (existing) {
      return res.status(409).json({ error: "An account with this phone number already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        passwordHash,
        role: "Resident",
        mandalId: mandalId || null,
      },
    });
    await prisma.otpCode.deleteMany({ where: { phone: phone.trim(), purpose: "register" } });

    res.status(201).json({ token: signToken(user), user: toSafeUser(user) });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { phone, password } = req.body;
    const user = await prisma.user.findUnique({ where: { phone: (phone || "").trim() } });
    if (!user) return res.status(401).json({ error: "No account found with this phone number." });

    const ok = await bcrypt.compare(password || "", user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Incorrect password." });

    res.json({ token: signToken(user), user: toSafeUser(user) });
  })
);

router.post(
  "/admin-login",
  asyncHandler(async (req, res) => {
    const { phone, password } = req.body;
    const user = await prisma.user.findUnique({ where: { phone: (phone || "").trim() } });
    if (!user) return res.status(401).json({ error: "No account found with this phone number." });

    const ok = await bcrypt.compare(password || "", user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Incorrect password." });

    if (!["Mandal Admin", "Administrator"].includes(user.role)) {
      return res.status(403).json({ error: "This account does not have admin access." });
    }

    res.json({ token: signToken(user), user: toSafeUser(user) });
  })
);

router.post(
  "/forgot-password",
  asyncHandler(async (req, res) => {
    const { phone } = req.body;
    const user = await prisma.user.findUnique({ where: { phone: (phone || "").trim() } });
    if (!user) return res.status(404).json({ error: "No account found with this phone number." });

    // Mock flow — a real deployment would send an SMS/email reset link here.
    res.json({
      message: `Password reset instructions sent to the number ending ${user.phone.slice(-4)}.`,
    });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: toSafeUser(req.user) });
  })
);

export default router;
