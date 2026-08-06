import jwt from "jsonwebtoken";

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
