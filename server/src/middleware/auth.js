import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated." });

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ error: "User no longer exists." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You don't have permission to do that." });
    }
    next();
  };
}

export const requireAdmin = requireRole("Mandal Admin", "Administrator");
export const requireAdministrator = requireRole("Administrator");

// Populates req.user if a valid token is present, but doesn't reject the request otherwise.
export async function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();
  try {
    const payload = verifyToken(token);
    req.user = await prisma.user.findUnique({ where: { id: payload.sub } });
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}
