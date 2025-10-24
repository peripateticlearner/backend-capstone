import express from "express";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authRouter = express.Router();

/**
 * POST /api/auth/user-register - Register a new User
 */
authRouter.post("/user-register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (!email.includes("@"))
      return res.status(400).json({ message: "Invalid email format." });
    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();

    // Remove password from response
    const { password: pw, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
});

/**
 * POST /api/auth/user-login - User login
 */
authRouter.post("/user-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const dbUser = await User.findOne({ email });
    const isPasswordValid = dbUser && await bcrypt.compare(password, dbUser.password);

    if (!dbUser || !isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: dbUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ 
      _id: dbUser._id, 
      token, 
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      email: dbUser.email,
      message: "User Login successful" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

/**
 * POST /api/auth/admin-register - Register a new Admin
 */
authRouter.post("/admin-register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (!email.includes("@"))
      return res.status(400).json({ message: "Invalid email format." });
    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters." });

    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin)
      return res.status(409).json({ message: "Username or email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();

    // Remove password from response
    const { password: pw, ...adminWithoutPassword } = newAdmin.toObject();
    res.status(201).json({ message: "Admin registered successfully", admin: adminWithoutPassword });
  } catch (err) {
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
});

/**
 * POST /api/auth/admin-login - Admin login
 */
authRouter.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const dbAdmin = await Admin.findOne({ email });
    const isPasswordValid = dbAdmin && await bcrypt.compare(password, dbAdmin.password);

    if (!dbAdmin || !isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ adminId: dbAdmin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ _id: dbAdmin._id, token, message: "Admin Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

export default authRouter;