"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <main>
      <h1>Expense Tracker</h1>
      <h2>Dashboard</h2>

      <hr />

      <h3>Saldo</h3>
      <p>Rp 0</p>

      <h3>Total Pemasukan</h3>
      <p>Rp 0</p>

      <h3>Total Pengeluaran</h3>
      <p>Rp 0</p>

      <hr />

      <button onClick={() => router.push("/transactions")}>
        Tambah Transaksi
      </button>

      <br />
      <br />

      <button onClick={() => router.push("/history")}>
        History Transaksi
      </button>

      <br />
      <br />

      <button onClick={() => router.push("/limit")}>
        Atur Limit
      </button>

      <br />
      <br />

      <button onClick={() => router.push("/preference")}>
        Preferensi
      </button>

      <br />
      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </main>
  );
}