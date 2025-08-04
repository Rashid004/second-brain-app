import connectDB from "@/lib/db";
import Content from "@/models/contentSchema";
import { NextRequest, NextResponse } from "next/server";
import { protectedRoute } from "@/middleware/authMiddleware";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await protectedRoute(req);
    await connectDB();

    const contentId = params.id;

    if (!contentId) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 },
      );
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    if (content.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized: You can only delete your own content" },
        { status: 403 },
      );
    }

    await Content.findByIdAndDelete(contentId);

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

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await protectedRoute(req);
    await connectDB();

    const contentId = params.id;
    const body = await req.json();

    if (!contentId) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 },
      );
    }

    const existingContent = await Content.findById(contentId);

    if (!existingContent) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    if (existingContent.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Unauthorized: You can only update your own content" },
        { status: 403 },
      );
    }

    if (body.link) {
      try {
        new URL(body.link);
      } catch {
        return NextResponse.json(
          { error: "Invalid URL format" },
          { status: 400 },
        );
      }
    }

    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      { ...body, updatedAt: new Date() },
      {
        new: true,
        runValidators: true,
      },
    );

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

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await protectedRoute(req);
    await connectDB();

    const contentId = params.id;

    if (!contentId) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 },
      );
    }

    const content = await Content.findById(contentId)
      .populate("user", "userName email")
      .lean();

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
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

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to retrieve content" },
      { status: 500 },
    );
  }
}
