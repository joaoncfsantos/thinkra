import express from "express";
import {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
} from "../repositories/authenticationRepository";
import supabase from "../utils/supabase";

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

router.post("/reset-password", async (req, res) => {
  try {
    const { password } = req.body;
    const authHeader = req.headers.authorization;

    if (!password) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authorization token required",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    // Set the session for this request
    await supabase.auth.setSession({
      access_token: token,
      refresh_token: "", // We don't need refresh token for this operation
    });

    const result = await resetPassword(password);
    res.json(result);
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "Failed to reset password",
    });
  }
});

export default router;
