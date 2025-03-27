import express from "express";
import Ride from "../models/Ride.js";

const router = express.Router();

/**
 * POST /api/rides - Book a new ride
 */
router.post("/", async (req, res) => {
    try {
        const { pickupLocation, dropoffLocation, scheduledTime, contactInfo } = req.body;

        // Validation - Important even without auth for now
        if (!pickupLocation || !dropoffLocation || !scheduledTime || !contactInfo) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const ride = new Ride({
            pickupLocation,
            dropoffLocation,
            scheduledTime,
            contactInfo,
            rider: "000000000000000000000000" // placeholder user ID
        });

        await ride.save();
        res.status(201).json(ride);
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Error booking ride", error: err.message });
    }
});

/**
 * GET /api/rides - Get all rides (no auth for now)
 */
router.get("/", async (req, res) => {
    try {
        const { status, search } = req.query;

        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.contactInfo = { $regex: search, $options: "i" };
        }

        const rides = await Ride.find(filter).sort({ scheduledTime: 1 });

        res.json(rides);
    } catch (err) {
        res.status(500).json({ message: "Failed to get rides", error: err.message });
    }
});

/**
 * PATCH /api/rides/:id - Update ride status (no admin auth yet)
 */
router.patch("/:id", async (req, res) => {
    try {
        const ride = await Ride.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!ride) return res.status(404).json({ message: "Ride not found" });

        res.json(ride);
    } catch (err) {
        res.status(500).json({ message: "Failed to update ride", error: err.message });
    }
});

/**
 * DELETE /api/rides/:id - Delete a ride by ID
 */
router.delete("/:id", async (req, res) => {
    try {
      await Ride.findByIdAndDelete(req.params.id);
      res.status(204).send(); // No content
    } catch (err) {
      res.status(500).json({ message: "Failed to delete ride", error: err.message });
    }
  });
  

export default router;