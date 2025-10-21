import express from "express";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Ride from "../models/Ride.js";
import authenticateJWT from "../middleware/authenticateJWT.js";

const router = express.Router();

/**
 * GET /api/admin/data - Fetch admin data (secured)
 */
router.get("/data", authenticateJWT, async (req, res) => {
    try {
        const admins = await Admin.find().select("-password");
        res.status(200).json({ message: "Admin data fetched successfully", admins });
    } catch (err) {
        res.status(500).json({ message: "Error fetching admin data", error: err.message });
    }
});

/**
 * GET /api/admin/dashboard - Admin dashboard (secured)
 */
router.get("/dashboard", authenticateJWT, async (req, res) => {
    try {
        const dashboardData = {
            totalUsers: await User.countDocuments(),
            totalRides: await Ride.countDocuments(),
            totalAdmins: await Admin.countDocuments(),
        };
        res.status(200).json({
            message: "Welcome to admin dashboard!",
            dashboardData,
        });
    } catch (err) {
        res.status(500).json({ message: "Error accessing admin dashboard", error: err.message });
    }
});

/** DELETE /api/admin/:id - Delete admin by ID (secured) */
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