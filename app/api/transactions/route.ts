import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "expense-tracker-secret"
);

// Penyimpanan sementara
const transactions: any[] = [];

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, secret);

    const body = await request.json();

    const type = body.type || body.jenis;
    const amount = Number(body.amount || body.nominal);
    const description =
      body.description || body.keterangan || "";

    if (!type || !amount) {
      return NextResponse.json(
        { message: "Jenis dan nominal wajib diisi" },
        { status: 400 }
      );
    }

    const transaction = {
      id: Date.now(),
      user: payload.email,
      type,
      amount,
      description,
      createdAt: new Date().toISOString(),
    };

    transactions.push(transaction);

    return NextResponse.json(
      {
        message: "Transaksi berhasil disimpan",
        transaction,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Gagal menyimpan transaksi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    transactions,
  });
}