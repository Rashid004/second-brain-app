import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  userName: string;
  email: string;
  password: string;
}

export interface SignUpFormData {
  userName: string;
  email: string;
  password: string;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    _id: string;
    userName: string;
    email: string;
  };
}

export interface UserState {
  user: {
    _id: string;
    userName: string;
    email: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
}
