// /app/api/content/brain/share/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { protectedRoute } from "@/middleware/authMiddleware";
import { generateShareHash } from "@/utils/hashUtils";
import Link from "@/models/linkSchema";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await protectedRoute(req);
    const { action } = await req.json();

    if (!user || !user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "create") {
      let existingLink = await Link.findOne({ userId: user._id });

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

      if (existingLink) {
        existingLink.hash = hash;
        existingLink.isActive = true;
        existingLink.updatedAt = new Date();
        await existingLink.save();
      } else {
        existingLink = await Link.create({
          userId: user._id,
          hash,
          isActive: true,
        });
      }

      return NextResponse.json(
        {
          message: "Brain shared successfully",
          shareLink: `${process.env.NEXT_PUBLIC_APP_URL}/shared/${existingLink.hash}`,
          hash: existingLink.hash,
        },
        { status: 201 },
      );
    }

    if (action === "delete") {
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
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'create' or 'delete'." },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error in share route:", error);

    const message =
      error instanceof Error ? error.message : "Internal Server Error";

    const status =
      message === "Access token required" ||
      message === "Token expired" ||
      message === "Invalid token" ||
      message === "User not found"
        ? 401
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await protectedRoute(req);

    if (!user || !user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const link = await Link.findOne({
      userId: user._id,
      isActive: true,
    });

    return NextResponse.json(
      {
        message: "Share status retrieved",
        isShared: !!link,
        hash: link?.hash || null,
        shareLink: link
          ? `${process.env.NEXT_PUBLIC_APP_URL}/shared/${link.hash}`
          : null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error getting share status:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to retrieve share status";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
