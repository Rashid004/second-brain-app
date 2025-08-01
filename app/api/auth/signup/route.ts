import connectDB from "@/lib/db";
import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { hashPassword } from "@/helper/hashPassword";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userName, email, password } = body;

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
    // Check if user already exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

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
    if (error instanceof Error) {
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 },
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
