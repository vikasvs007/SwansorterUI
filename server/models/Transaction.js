import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cost: String,
    products: {
      type: [mongoose.Types.ObjectId],
      of: Number,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
