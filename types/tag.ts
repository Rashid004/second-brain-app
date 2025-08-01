import { Document } from "mongoose";

export interface ITag extends Document {
  title: string;
}
