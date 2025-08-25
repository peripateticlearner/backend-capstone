import express from "express";
import User from "../models/User.js";

const authRouter = express.Router();

authRouter.post("/", async (req, res) => {
  try {
    const dbUser = await User.findOne({ email: req.body.email });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (dbUser.password !== req.body.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      _id: dbUser._id,
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});