import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    city: String,
    phone: String,
    photo: {
      type: String,
      default: "", // URL to the photo
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "admin",
    },
    notifications: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
