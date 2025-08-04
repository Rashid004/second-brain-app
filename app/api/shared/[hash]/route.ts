import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Link from "@/models/linkSchema";
import Content from "@/models/contentSchema";

export async function GET(
  req: NextRequest,
  { params }: { params: { hash: string } }
) {
  try {
    await connectDB();
    
    const { hash } = params;

    // Find the link by hash
    const shareLink = await Link.findOne({ hash, isActive: true });
    
    if (!shareLink) {
      return NextResponse.json(
        { error: "Share link not found or expired" },
        { status: 404 }
      );
    }

    // Get all content for this user
    const content = await Content.find({ user: shareLink.userId })
      .populate("user", "userName email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: "Shared brain content retrieved successfully",
        content,
        owner: content[0]?.user || null,
        totalContent: content.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Shared content retrieval error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to retrieve shared content" },
      { status: 500 }
    );
  }
}