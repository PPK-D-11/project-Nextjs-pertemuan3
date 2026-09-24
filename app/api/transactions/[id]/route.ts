import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { db } from "../../../../src/prisma/db";

async function getCurrentUserId() {
  const sessionSecret = process.env.SESSION_SECRET;

  if (!sessionSecret) {
    throw new Error("SESSION_SECRET belum dikonfigurasi");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(sessionSecret);
    const { payload } = await jwtVerify(token, secret);

    const userId = Number(payload.userId);

    if (!userId || Number.isNaN(userId)) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

// ===============================
// UPDATE TRANSACTION
// ===============================

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const transactionId = Number(id);

    if (!transactionId || Number.isNaN(transactionId)) {
      return NextResponse.json(
        { message: "ID transaksi tidak valid" },
        { status: 400 }
      );
    }

    // Cari transaksi berdasarkan ID
    // DAN pastikan transaksi milik user yang sedang login
    const transaction = await db.orm.public.Transaction
      .where((t) => t.id.eq(transactionId))
      .where((t) => t.userId.eq(userId))
      .first();

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const type = body.type;
    const amount = Number(body.amount);
    const description = body.description || "";

    if (type !== "INCOME" && type !== "EXPENSE") {
      return NextResponse.json(
        { message: "Jenis transaksi tidak valid" },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: "Nominal harus lebih dari 0" },
        { status: 400 }
      );
    }

    // Update hanya jika ID dan userId sesuai
    const updatedTransaction = await db.orm.public.Transaction
      .where((t) => t.id.eq(transactionId))
      .where((t) => t.userId.eq(userId))
      .update({
        type,
        amount,
        description,
      });

    return NextResponse.json(
      {
        message: "Transaksi berhasil diubah",
        transaction: updatedTransaction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE TRANSACTION ERROR:", error);

    return NextResponse.json(
      { message: "Gagal mengubah transaksi" },
      { status: 500 }
    );
  }
}

// ===============================
// DELETE TRANSACTION
// ===============================

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const transactionId = Number(id);

    if (!transactionId || Number.isNaN(transactionId)) {
      return NextResponse.json(
        { message: "ID transaksi tidak valid" },
        { status: 400 }
      );
    }

    // Cari transaksi berdasarkan ID
    // DAN pastikan transaksi milik user login
    const transaction = await db.orm.public.Transaction
      .where((t) => t.id.eq(transactionId))
      .where((t) => t.userId.eq(userId))
      .first();

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus hanya transaksi milik user tersebut
    await db.orm.public.Transaction
      .where((t) => t.id.eq(transactionId))
      .where((t) => t.userId.eq(userId))
      .delete();

    return NextResponse.json(
      {
        message: "Transaksi berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE TRANSACTION ERROR:", error);

    return NextResponse.json(
      { message: "Gagal menghapus transaksi" },
      { status: 500 }
    );
  }
}