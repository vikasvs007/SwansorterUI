import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['new_user', 'new_order', 'message', 'alert'],
      required: true
    },
    icon: {
      type: String,
      default: 'notification' // default icon
    },
    is_read: {
      type: Boolean,
      default: false
    },
    is_deleted: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: { 
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    } 
  }
);

const Notification = mongoose.model("notifications", NotificationSchema);
export default Notification;
