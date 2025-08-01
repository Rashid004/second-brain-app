import connectDB from "@/lib/db";
import Content from "@/models/contentSchema";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";

export const POST = async (req: NextRequest) => {
  try {
    // Apply auth middleware
    const authResult = await authMiddleware(req);
    if (authResult.error) {
      return authResult.error;
    }

    await connectDB();
    const body = await req.json();
    const { link, title, contentType, description, tags } = body;

    if (!link || !title || !contentType || !description) {
      return NextResponse.json(
        {
          error:
            "All fields (link, title, contentType, description) are required",
        },
        { status: 400 },
      );
    }

    // Validate URL format
    try {
      new URL(link);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    console.log('Creating content with data:', {
      link,
      title,
      contentType,
      description,
      tags: tags || [],
      user: authResult.user._id,
    });

    const newContent = await Content.create({
      link,
      title,
      contentType,
      description,
      tags: tags || [],
      user: authResult.user._id,
    });

    console.log('Content created:', newContent);

    return NextResponse.json(
      {
        message: "Content created successfully",
        content: newContent,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Content creation error:", error);

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
};

export const GET = async (req: NextRequest) => {
  try {
    // Apply auth middleware
    const authResult = await authMiddleware(req);
    if (authResult.error) {
      return authResult.error;
    }

    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const contentType = searchParams.get("contentType");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    // Build filter
    const filter: any = {};
    if (userId) filter.user = userId;
    if (contentType) filter.contentType = contentType;

    // Calculate pagination
    const skip = (page - 1) * limit;

    console.log('Fetching content with filter:', filter);

    const content = await Content.find(filter)
      .populate("user", "userName email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(); // Use lean() for better performance

    const total = await Content.countDocuments(filter);

    console.log('Content found:', content.length, 'items');
    console.log('Sample content:', content[0]);

    return NextResponse.json(
      {
        message: "Content retrieved successfully",
        content,
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

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to retrieve content" },
      { status: 500 },
    );
  }
};
