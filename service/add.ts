import { ContentFormData } from "@/types/content";
import { getAuthToken } from "@/service/auth";
import axios from "axios";

export const addContent = async (content: ContentFormData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post("/api/content", content, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
