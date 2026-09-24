import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { db } from "../../../src/prisma/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // SESSION_SECRET wajib tersedia
    const sessionSecret = process.env.SESSION_SECRET;

    if (!sessionSecret) {
      console.error("SESSION_SECRET belum dikonfigurasi");
      return NextResponse.json(
        { message: "Konfigurasi session belum tersedia" },
        { status: 500 }
      );
    }

    // Cari user berdasarkan email di PostgreSQL
    const user = await db.orm.public.User
      .where((u) => u.email.eq(email))
      .first();

    if (!user) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Bandingkan password dengan hash di database
    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Buat JWT berdasarkan user yang BENAR-BENAR ada di database
    const secret = new TextEncoder().encode(sessionSecret);

    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    // Simpan JWT ke HTTP-only cookie
    const cookieStore = await cookies();

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat login" },
      { status: 500 }
    );
  }
}