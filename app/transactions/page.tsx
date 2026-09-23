"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TransactionPage() {
  const router = useRouter();

  const [type, setType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const savedLimit = localStorage.getItem("transactionLimit");
  const transactionLimit = Number(savedLimit);
  const transactionAmount = Number(amount);

  // Cek limit hanya untuk pengeluaran
  if (
    type === "EXPENSE" &&
    savedLimit &&
    transactionAmount > transactionLimit
  ) {
    setMessage(
      `Transaksi ditolak! Pengeluaran melebihi limit Rp ${transactionLimit.toLocaleString("id-ID")}`
    );
    return;
  }

    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        amount: Number(amount),
        description,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Transaksi berhasil ditambahkan");
      setAmount("");
      setDescription("");
    } else {
      setMessage(data.message || "Transaksi gagal");
    }
  }

  return (
    <main>
      <h1>Tambah Transaksi</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Jenis Transaksi</label>
          <br />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="INCOME">Pemasukan</option>
            <option value="EXPENSE">Pengeluaran</option>
          </select>
        </div>

        <br />

        <div>
          <label>Nominal</label>
          <br />

          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Contoh: 500000"
            required
          />
        </div>

        <br />

        <div>
          <label>Keterangan</label>
          <br />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Makan malam"
            required
          />
        </div>

        <br />

        <button type="submit">Simpan Transaksi</button>
      </form>

      {message && <p>{message}</p>}

      <br />

      <button onClick={() => router.push("/dashboard")}>
        Kembali ke Dashboard
      </button>
    </main>
  );
}