import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    const result = await sql`
      SELECT NOW() AS waktu, version() AS versi
    `;

    return Response.json({
      status: "berhasil",
      message: "Next.js berhasil terhubung ke PostgreSQL Neon!",
      database: result[0],
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        status: "gagal",
        message: "Tidak dapat terhubung ke PostgreSQL",
      },
      { status: 500 }
    );
  }
}