import connectDB from "@/lib/db";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userName, email, password } = body;

    // Input validation
    if (!userName || !email || !password) {
      return NextResponse.json(
        { error: "All fields (userName, email, password) are required" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 },
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with hashed password
    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error("User creation error:", error);

    if (error instanceof Error) {
      // Handle MongoDB duplicate key error
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 },
        );
      }

      // Handle database connection errors
      if (
        error.message.includes("connection") ||
        error.message.includes("connect")
      ) {
        return NextResponse.json(
          { error: "Database connection failed" },
          { status: 503 },
        );
      }

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
