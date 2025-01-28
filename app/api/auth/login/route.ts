// File: src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );

  const response = NextResponse.json({ success: true });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
