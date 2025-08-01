import { Document, Types } from "mongoose";

export interface IContent extends Document {
  link: string;
  title: string;
  contentType: string | ContentType;
  description: string;
  user: Types.ObjectId;
  tags?: string[];
}

export enum ContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
}
