import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

linkSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const LinkModel = mongoose.models.Link || mongoose.model("Link", linkSchema);
export default LinkModel;
