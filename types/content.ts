import { Document, Types } from "mongoose";

export interface EmbedInfo {
  type: 'youtube' | 'twitter' | 'iframe' | 'image' | 'link' | 'document';
  embedUrl?: string;
  thumbnail?: string;
  title?: string;
}

export interface IContent extends Document {
  link: string;
  title: string;
  contentType: string | ContentType;
  description: string;
  user: Types.ObjectId | {
    _id: string;
    userName: string;
    email: string;
  };
  tags?: string[];
  embedInfo?: EmbedInfo;
}

export interface ContentFormData {
  _id?: string;
  title: string;
  description: string;
  contentType: ContentType;
  tags: string[];
  link: string;
  embedInfo?: EmbedInfo;
}

export enum ContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
}
