import { ContentType, IContent } from "@/types/content";
import mongoose, { model, models, Schema } from "mongoose";

const contentSchema = new Schema<IContent>({
  link: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
    enum: Object.values(ContentType),
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

const Content = models.Content || model<IContent>("Content", contentSchema);

export default Content;
