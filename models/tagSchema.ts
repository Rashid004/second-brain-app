import { ITag } from "@/types/tag";
import { model, models, Schema } from "mongoose";

const tagSchema = new Schema<ITag>({
  title: {
    type: String,
    required: true,
  },
});

const Tag = models.Tag || model<ITag>("Tag", tagSchema);

export default Tag;
