import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const TOKEN_COOKIE = "token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required. Set it in server/.env.");
  }

  return secret;
}

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, getSecret(), {
    expiresIn: TOKEN_TTL_SECONDS,
  });
}

export function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: TOKEN_TTL_SECONDS * 1000,
  };
}

function readToken(request) {
  const header = request.headers.authorization ?? "";

  if (header.startsWith("Bearer ")) return header.slice(7).trim();

  return request.cookies?.[TOKEN_COOKIE] ?? null;
}

// Rejects the request unless a valid token is present, then attaches req.user.
export async function requireAuth(request, response, next) {
  try {
    const token = readToken(request);

    if (!token) {
      return response.status(401).json({ message: "Authentication required." });
    }

    const payload = jwt.verify(token, getSecret());
    const user = await User.findById(payload.sub);

    if (!user) {
      return response.status(401).json({ message: "Account no longer exists." });
    }

    request.user = user;
    return next();
  } catch {
    return response.status(401).json({ message: "Invalid or expired session." });
  }
}
