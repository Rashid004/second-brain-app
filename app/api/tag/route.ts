import connectDB from "@/lib/db";
import Tag from "@/models/tagSchema";
import { NextResponse } from "next/server";

export async function POST(req: any) {
  try {
    await connectDB();
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: "All fields (title) are required" },
        { status: 400 },
      );
    }

    const newTag = await Tag.create({
      title,
    });

    return NextResponse.json(
      {
        message: "Tag created successfully",
        tag: newTag,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Tag creation error:", error);
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
