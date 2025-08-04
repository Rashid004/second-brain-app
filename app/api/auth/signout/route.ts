import { NextRequest, NextResponse } from "next/server";
import { protectedRoute } from "@/middleware/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    // Validate the token before signout
    await protectedRoute(req);
    
    // For stateless JWT, signout is handled client-side by removing the token
    // Server confirms the signout and token validation
    return NextResponse.json(
      { message: "Signout successful" },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Access token required" ||
        error.message === "Token expired" ||
        error.message === "Invalid token" ||
        error.message === "User not found")
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    console.error("Signout error:", error);
    return NextResponse.json(
      { error: "Signout failed" },
      { status: 500 }
    );
  }
}
