import express from "express";
import {
  signUp,
  signIn,
  forgotPassword,
} from "../repositories/authenticationRepository";

const router = express.Router();

router.post("/sign-up", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const user = await signUp(name, email, password);
    res.json(user);
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to sign up",
    });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await signIn(email, password);
    res.json(user);
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(401).json({
      error: error instanceof Error ? error.message : "Failed to sign in",
    });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const user = await forgotPassword(email);
    res.json(user);
  } catch (error) {
    console.error("Forgot password error:", error);
  }
});

export default router;
