"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Transaction = {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt?: string;
};

export default function HistoryPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTransactions() {
      try {
        const response = await fetch("/api/transactions");

        const data = await response.json();

        setTransactions(data.transactions || []);
      } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
      } finally {
        setLoading(false);
      }
    }

    getTransactions();
  }, []);

  return (
    <main>
      <h1>History Transaksi</h1>

      {loading && <p>Memuat transaksi...</p>}

      {!loading && transactions.length === 0 && (
        <p>Belum ada transaksi.</p>
      )}

      {transactions.map((transaction) => (
        <div key={transaction.id}>
          <h3>
            {transaction.type === "INCOME"
              ? "Pemasukan"
              : "Pengeluaran"}
          </h3>

          <p>
            Rp {Number(transaction.amount).toLocaleString("id-ID")}
          </p>

          <p>{transaction.description}</p>

          <hr />
        </div>
      ))}

      <button onClick={() => router.push("/transactions")}>
        Tambah Transaksi
      </button>

      <button onClick={() => router.push("/dashboard")}>
        Kembali ke Dashboard
      </button>
    </main>
  );
}