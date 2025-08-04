import Content from "@/models/contentSchema";
import LinkModel from "@/models/linkSchema";
import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const hash = params.id;

    const link = await LinkModel.findOne({ hash, isActive: true });

    if (!link) {
      return NextResponse.json(
        { error: "Share link not found or inactive" },
        { status: 404 },
      );
    }

    const content = await Content.find({
      user: link.userId,
    })
      .populate("user", "userName email")
      .sort({ createdAt: -1 })
      .lean();

    const userInfo = content.length > 0 ? content[0].user : null;

    return NextResponse.json(
      {
        message: "Shared brain retrieved successfully",
        content,
        owner: userInfo,
        sharedAt: link.createdAt,
        totalItems: content.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Shared brain retrieval error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to retrieve shared brain" },
      { status: 500 },
    );
  }
}
