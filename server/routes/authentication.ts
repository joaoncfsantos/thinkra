import express from "express";
import { signUp, signIn } from "../repositories/authenticationRepository";

const router = express.Router();

router.post("/sign-up", async (req, res) => {
  const { name, email, password } = req.body;
  const user = await signUp(name, email, password);
  res.json(user);
});

router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  const user = await signIn(email, password);
  res.json(user);
});

export default router;
