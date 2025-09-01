import express from "express";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authRouter = express.Router();
/**
 * POST /api/auth/admin-login - Admin login
 */
authRouter.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password format
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if admin exists
    const dbAdmin = await Admin.findOne({ email });
    if(!dbAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, dbAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT for admin
    const token = jwt.sign(
      { adminId: dbAdmin._id},
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    
    res.status(200).json({
      _id: dbAdmin._id,
      token,
      message: "Admin Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again."});
  }
});

/**
 * POST /api/auth/user-login - User login
 */
authRouter.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password format
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const dbUser = await User.findOne({ email });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT for user
    const token = jwt.sign(
      { userId: dbUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      _id: dbUser._id,
      token,
      message: "User Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

/**
 * POST /api/auth/user-register - Register a new User
 */
authRouter.post("/user-register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check for existing user with the same username or email
    const existingUser = await User.findOne ({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "Username or email already exists." });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // Send a response back to the client
    res.status(201).json ({ message: "User registered successfully", newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});


export default authRouter;