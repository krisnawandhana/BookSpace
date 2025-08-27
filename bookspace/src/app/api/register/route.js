import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const result = registerUser(email, password);

    if (result.error) {
      const status =
        result.error.includes("wajib") || result.error.includes("Format") || result.error.includes("minimal")
          ? 400
          : 409;
      return NextResponse.json({ message: result.error }, { status });
    }

    return NextResponse.json(
      { message: "Registrasi sukses", user: result.user },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}