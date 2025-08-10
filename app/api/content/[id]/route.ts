import connectDB from "@/lib/db";
import Content from "@/models/contentSchema";
import { NextRequest, NextResponse } from "next/server";
import { protectedRoute } from "@/middleware/authMiddleware";

// GET single content by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await protectedRoute(req);
    await connectDB();
    const { id } = await params;

    const content = await Content.findById(id).populate(
      "user",
      "userName email",
    );

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    if (content.user._id.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      {
        message: "Content retrieved successfully",
        content,
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

    return NextResponse.json(
      { error: "Failed to retrieve content" },
      { status: 500 },
    );
  }
}

// UPDATE content by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await protectedRoute(req);
    await connectDB();
    const { id } = await params;

    const body = await req.json();
    const { title, description, contentType, tags, link, embedInfo } = body;

    // Find the content first
    const existingContent = await Content.findById(id);

    if (!existingContent) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Check if user owns this content
    if (existingContent.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (!title || !description || !contentType) {
      return NextResponse.json(
        {
          error: "Title, description, and contentType are required",
        },
        { status: 400 },
      );
    }

    if (link && !link.includes("<iframe") && !link.includes("<blockquote")) {
      try {
        new URL(link);
      } catch {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 },
        );
      }
    }

    const updatedContent = await Content.findByIdAndUpdate(
      id,
      {
        title,
        description,
        contentType,
        tags: tags || [],
        link: link || "",
        embedInfo: embedInfo || undefined,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    ).populate("user", "userName");

    return NextResponse.json(
      {
        message: "Content updated successfully",
        content: updatedContent,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Content update error:", error);

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
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await protectedRoute(req);
    await connectDB();
    const { id } = await params;

    const content = await Content.findById(id);

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    // Check if user owns this content
    if (content.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await Content.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Content deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Content deletion error:", error);

    if (
      error instanceof Error &&
      (error.message === "Access token required" ||
        error.message === "Token expired" ||
        error.message === "Invalid token" ||
        error.message === "User not found")
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 },
    );
  }
}
