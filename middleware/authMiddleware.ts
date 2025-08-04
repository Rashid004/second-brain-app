import { NextRequest } from "next/server";
import { verifyToken } from "@/helper/token";
import User from "@/models/userSchema";
import connectDB from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const protectedRoute = async (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    throw new Error("Access token required");
  }

  try {
    await connectDB();
    const decoded = verifyToken(token, JWT_SECRET) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token expired");
      } else if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      }
      throw error;
    }
    throw new Error("Authentication failed");
  }
};
