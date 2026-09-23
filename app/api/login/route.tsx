import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "expense-tracker-secret"
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    const token = await new SignJWT({
      email: email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json(
      { message: "Login berhasil" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}