import connectDB from "@/lib/db";
import Content from "@/models/contentSchema";
import { NextRequest, NextResponse } from "next/server";
import { protectedRoute } from "@/middleware/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    const user = await protectedRoute(req);
    await connectDB();
    const body = await req.json();
    const { link, title, contentType, description, tags, embedInfo } = body;

    if (!link || !title || !contentType || !description) {
      return NextResponse.json(
        {
          error:
            "All fields (link, title, contentType, description) are required",
        },
        { status: 400 },
      );
    }

    if (!link.includes("<iframe") && !link.includes("<blockquote")) {
      try {
        new URL(link);
      } catch {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 },
        );
      }
    }

    const newContent = await Content.create({
      link,
      title,
      contentType,
      description,
      tags: tags || [],
      embedInfo: embedInfo || undefined,
      user: user._id,
    });

    return NextResponse.json(
      {
        message: "Content created successfully",
        content: newContent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Content creation error:", error);

    if (
      error instanceof Error &&
      (error.message === "Access token required" ||
        error.message === "Token expired" ||
        error.message === "Invalid token" ||
        error.message === "User not found")
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof Error) {
      if (error.message.includes("validation")) {
        return NextResponse.json(
          { error: "Validation failed: " + error.message },
          { status: 400 },
        );
      }
      if (error.message.includes("duplicate key")) {
        return NextResponse.json(
          { error: "Content with this link already exists" },
          { status: 409 },
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await protectedRoute(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const contentType = searchParams.get("contentType");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const filter: any = {
      user: user._id,
    };
    if (contentType) filter.contentType = contentType;

    const skip = (page - 1) * limit;

    const content = await Content.find(filter)
      .populate("user", "userName email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Content.countDocuments(filter);

    return NextResponse.json(
      {
        message: "Content retrieved successfully",
        content,
        length: content.length,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Content retrieval error:", error);

    if (
      error instanceof Error &&
      (error.message === "Access token required" ||
        error.message === "Token expired" ||
        error.message === "Invalid token" ||
        error.message === "User not found")
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to retrieve content" },
      { status: 500 },
    );
  }
}
