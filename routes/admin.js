import express from "express";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authenticateJWT from "../middleware/authenticateJWT.js";

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
        
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({ username, email, password: hashedPassword });
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
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful", 
            token,
         });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});

/**
 * GET /api/admin/data - Fetch admin data (secured)
 * Requires authentication
 */
router.get("/data", authenticateJWT, async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json({ message: "Admin data fetched succesfully", admins });
    } catch (err) {
        res.status(500).json({ message: "Error fetching admin data", error: err.message });
    }
});

/** DELETE /api/admin/:id - Delete admin by ID (secured)
 * Requires authentication
 */
router.delete("/:id", authenticateJWT, async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting admin", error: err.message });
    }
});

export default router;