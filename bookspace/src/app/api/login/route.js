// app/api/login/route.js
import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const result = authenticateUser(email, password);

    if (result.error) {
      const code = result.error.includes("wajib") ? 400 : 401;
      return NextResponse.json({ message: result.error }, { status: code });
    }

    return NextResponse.json({
      message: "Login sukses",
      token: result.token,
      user: result.user,
    });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
