import User from "@/models/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const user = await User.findOne({ email: request.cookies.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    throw new Error("Internal server error");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
