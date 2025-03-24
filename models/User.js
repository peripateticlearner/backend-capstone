import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// if the field is marked as "unique: true" 
// we don't need to create and index:
//  https://mongoosejs.com/docs/guide.html#indexes
// userSchema.index({username: 1});
// userSchema.index({email: 1});



export default mongoose.model("User", userSchema);
