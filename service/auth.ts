import { SignUpFormData, SignInFormData, AuthResponse } from "@/types/user";
import axios from "axios";

// Token
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

// User Data
export const setUserData = (user: AuthResponse["user"]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(user));
  }
};

export const getUserData = (): AuthResponse["user"] | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const removeUserData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData");
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getUserData();
  return !!token && !!user;
};

export const signUp = async (data: SignUpFormData) => {
  try {
    const response = await axios.post("/api/auth/signup", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (data: SignInFormData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>("/api/auth/login", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Store token and user data
    if (response.data.token && response.data.user) {
      setAuthToken(response.data.token);
      setUserData(response.data.user);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signOut = () => {
  removeAuthToken();
  removeUserData();
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
};
