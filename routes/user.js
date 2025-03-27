import express from "express";
import User from "../models/User.js";

const userRouter = express.Router();

/**
 * POST create a new user
 */
userRouter.post("/", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation - Ensure required fields are present
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //  Add more robust email validation if needed

        // Check for existing user with the same username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: e.message });
    }
});

/**
 * GET get all users
 */
userRouter.get('/', async(req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
    }
})

/**
 * GET user by the id
 */
userRouter.get('/:id', async(req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error: error.message });
    }
})

export default userRouter;