import express from "express";
import Admin from "../models/Admin.js";

const router = express.Router();


/**
 * POST /api/admin/register - Create admin
 */
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newAdmin = new Admin({ username, email, password }); // Store password as is (temporary)
        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully", newAdmin });
    } catch (err) {
        res.status(500).json({ message: "Error registering admin", error: err.message });
    }
});



/**
 * POST /api/admin/login - Admin login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        // Direct password check (for testing only)
        if (password !== admin.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", admin });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});


export default router;