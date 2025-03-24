import express from "express";
import User from "../models/User.js";

const userRouter = express.Router();


/**
 * POST create a new user
 */
userRouter.post("/", async (req, res) => {
  try {
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
        
    }
})

export default userRouter;