import { getAuthToken } from "@/service/auth";
import axios from "axios";

export interface ContentResponse {
  message: string;
  content: Array<{
    _id: string;
    link: string;
    title: string;
    contentType: string;
    description: string;
    tags: string[];
    embedInfo?: {
      type: "youtube" | "twitter" | "iframe" | "image" | "link";
      embedUrl?: string;
      thumbnail?: string;
      title?: string;
    };
    user: {
      _id: string;
      userName: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
  }>;
  length: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const getContent = async (params?: {
  contentType?: string;
  limit?: number;
  page?: number;
}): Promise<ContentResponse> => {
  try {
    const token = getAuthToken();
    const searchParams = new URLSearchParams();

    if (params?.contentType)
      searchParams.append("contentType", params.contentType);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.page) searchParams.append("page", params.page.toString());

    const response = await axios.get<ContentResponse>(
      `/api/content?${searchParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllContent = async (): Promise<ContentResponse> => {
  try {
    const token = getAuthToken();
    const response = await axios.get<ContentResponse>("/api/content", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContent = async (contentId: string) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`/api/content/${contentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
