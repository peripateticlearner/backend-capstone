import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  pickupLocation: {
    type: String,
    required: true
  },
  dropoffLocation: {
    type: String,
    required: true
  },
  scheduledTime: {
    type: Date,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
    default: "Scheduled"
  },
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Temporary until I add authentication
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Ride", rideSchema);
