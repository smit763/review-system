import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    text: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [ "pending", "approved", "rejected" ],
      default: "pending"
    },
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    flags: {
      type: [ String ]
    },
    moderatorReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Review", reviewSchema);
