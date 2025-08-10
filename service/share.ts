import { getAuthToken } from "@/service/auth";
import axios from "axios";

export interface ShareResponse {
  message: string;
  shareLink?: string;
  hash?: string;
  isShared?: boolean;
}

export const createShareLink = async (): Promise<ShareResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post<ShareResponse>(
      "/api/content/brain/share",
      { action: "create" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteShareLink = async (): Promise<ShareResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.post<ShareResponse>(
      "/api/content/brain/share",
      { action: "delete" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getShareStatus = async (): Promise<ShareResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ShareResponse>(
      "/api/content/brain/share",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};