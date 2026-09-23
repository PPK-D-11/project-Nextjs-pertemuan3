"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LimitPage() {
  const router = useRouter();

  const [limit, setLimit] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedLimit = localStorage.getItem("transactionLimit");

    if (savedLimit) {
      setLimit(savedLimit);
    }
  }, []);

  function saveLimit(e: React.FormEvent) {
    e.preventDefault();

    if (!limit || Number(limit) <= 0) {
      setMessage("Limit harus lebih dari 0");
      return;
    }

    localStorage.setItem("transactionLimit", limit);

    setMessage("Limit transaksi berhasil disimpan");
  }

  return (
    <main>
      <h1>Limit Pengeluaran</h1>

      <p>
        Tentukan batas pengeluaran agar pengeluaran dapat lebih
        terkontrol.
      </p>

      <form onSubmit={saveLimit}>
        <label>Limit Pengeluaran</label>

        <br />

        <input
          type="number"
          min="1"
          placeholder="Contoh: 50000000"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
        />

        <br />
        <br />

        <button type="submit">
          Simpan Limit
        </button>
      </form>

      {message && <p>{message}</p>}

      {limit && (
        <p>
          Limit saat ini: Rp{" "}
          {Number(limit).toLocaleString("id-ID")}
        </p>
      )}

      <button onClick={() => router.push("/dashboard")}>
        Kembali ke Dashboard
      </button>
    </main>
  );
}