import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helper/token";
import User from "@/models/userSchema";
import connectDB from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authMiddleware = async (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return {
      error: NextResponse.json(
        { error: "Access token required" },
        { status: 401 }
      ),
      user: null
    };
  }

  try {
    await connectDB();
    const decoded = verifyToken(token, JWT_SECRET) as any;

    const currentUser = await User.findById(decoded.userId);

    if (!currentUser) {
      return {
        error: NextResponse.json(
          { error: "User not found" },
          { status: 401 }
        ),
        user: null
      };
    }

    // Return success with user info
    return {
      error: null,
      user: currentUser
    };
    
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return {
          error: NextResponse.json(
            { error: "Token expired" },
            { status: 401 }
          ),
          user: null
        };
      } else if (error.name === "JsonWebTokenError") {
        return {
          error: NextResponse.json(
            { error: "Invalid token" },
            { status: 401 }
          ),
          user: null
        };
      }
    }

    return {
      error: NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      ),
      user: null
    };
  }
};
