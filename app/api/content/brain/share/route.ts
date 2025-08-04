import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { protectedRoute } from "@/middleware/authMiddleware";
import { generateShareHash } from "@/utils/hashUtils";
import Link from "@/models/linkSchema";

export async function POST(req: NextRequest) {
  try {
    const user = await protectedRoute(req);
    await connectDB();

    const body = await req.json();
    const { action } = body;

    if (action === "create") {
      // Check if user already has a share link
      const existingLink = await Link.findOne({ userId: user._id });

      if (existingLink && existingLink.isActive) {
        return NextResponse.json(
          {
            message: "Brain already shared",
            shareLink: `${process.env.NEXT_PUBLIC_APP_URL}/shared/${existingLink.hash}`,
            hash: existingLink.hash,
          },
          { status: 200 },
        );
      }

      const hash = generateShareHash();

      // Create or update link
      const shareLink = existingLink
        ? await Link.findByIdAndUpdate(
            existingLink._id,
            { hash, isActive: true, updatedAt: new Date() },
            { new: true },
          )
        : await Link.create({
            userId: user._id,
            hash,
            isActive: true,
          });

      return NextResponse.json(
        {
          message: "Brain shared successfully",
          shareLink: `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareLink.hash}`,
          hash: shareLink.hash,
        },
        { status: 201 },
      );
    } else if (action === "delete") {
      // Deactivate share link
      const result = await Link.findOneAndUpdate(
        { userId: user._id },
        { isActive: false, updatedAt: new Date() },
        { new: true },
      );

      if (!result) {
        return NextResponse.json(
          { error: "No active share link found" },
          { status: 404 },
        );
      }

      return NextResponse.json(
        { message: "Brain share removed successfully" },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { error: "Action must be 'create' or 'delete'" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Share brain error:", error);

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
      { error: "Failed to share brain" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await protectedRoute(req);
    await connectDB();

    // Get user's share status
    const shareLink = await Link.findOne({ userId: user._id, isActive: true });

    return NextResponse.json(
      {
        message: "Share status retrieved successfully",
        isShared: !!shareLink,
        shareLink: shareLink?.hash
          ? `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareLink.hash}`
          : null,
        hash: shareLink?.hash || null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get share status error:", error);

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
      { error: "Failed to get share status" },
      { status: 500 },
    );
  }
}
