import { NextResponse } from "next/server";
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

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await db.orm.public.User
      .where((u) => u.email.eq(email))
      .first();

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke PostgreSQL Neon
    const user = await db.orm.public.User.create({
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Register berhasil",
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan saat register" },
      { status: 500 }
    );
  }
}