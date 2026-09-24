import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "../../../src/prisma/db";

export async function GET() {
  try {
    const sessionSecret = process.env.SESSION_SECRET;

    if (!sessionSecret) {
      return NextResponse.json(
        { message: "Konfigurasi session belum tersedia" },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(sessionSecret);
    const { payload } = await jwtVerify(token, secret);

    const userId = Number(payload.userId);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await db.orm.public.User
      .where((u) => u.id.eq(userId))
      .first();

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("GET USER ERROR:", error);

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
}