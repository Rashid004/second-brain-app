import { NextRequest, NextResponse } from "next/server";

export const applyMiddleware = async (
  req: NextRequest,
  res: NextResponse,
  middleware: (req: NextRequest, res: NextResponse) => Promise<NextResponse>,
) => {
  const response = await middleware(req, res);
  if (response.status !== 201) {
    return response;
  }
  return NextResponse.next();
};
