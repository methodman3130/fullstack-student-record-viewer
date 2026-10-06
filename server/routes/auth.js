import { Router } from "express";
import User from "../models/User.js";
import {
  TOKEN_COOKIE,
  cookieOptions,
  requireAuth,
  signToken,
} from "../middleware/auth.js";

const router = Router();

router.post("/register", async (request, response, next) => {
  try {
    const name = request.body?.name?.trim();
    const email = request.body?.email?.trim().toLowerCase();
    const password = request.body?.password ?? "";

    if (!name || !email || !password) {
      return response
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    if (password.length < 8) {
      return response
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    if (await User.exists({ email })) {
      return response
        .status(409)
        .json({ message: "An account with that email already exists." });
    }

    const user = new User({ name, email });
    await user.setPassword(password);
    await user.save();

    const token = signToken(user);
    response.cookie(TOKEN_COOKIE, token, cookieOptions());
    return response.status(201).json({ user: user.toSafeObject(), token });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const email = request.body?.email?.trim().toLowerCase();
    const password = request.body?.password ?? "";

    if (!email || !password) {
      return response
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    const isValid = user ? await user.verifyPassword(password) : false;

    if (!isValid) {
      return response.status(401).json({ message: "Incorrect email or password." });
    }

    const token = signToken(user);
    response.cookie(TOKEN_COOKIE, token, cookieOptions());
    return response.json({ user: user.toSafeObject(), token });
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", (_request, response) => {
  response.clearCookie(TOKEN_COOKIE, { ...cookieOptions(), maxAge: undefined });
  response.json({ message: "Signed out." });
});

router.get("/me", requireAuth, (request, response) => {
  response.json({ user: request.user.toSafeObject() });
});

export default router;
