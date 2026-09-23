"use client";

import { useEffect, useState } from "react";

export default function PreferencePage() {
  const [currency, setCurrency] = useState("IDR");

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("currency="));

    if (cookie) {
      setCurrency(cookie.split("=")[1]);
    }
  }, []);

  function savePreference(value: string) {
    setCurrency(value);

    document.cookie =
      `currency=${value}; path=/; max-age=2592000; SameSite=Lax`;
  }

  return (
    <main>
      <h1>Preferensi Pengguna</h1>

      <p>Mata uang yang digunakan: {currency}</p>

      <label>Pilih mata uang: </label>

      <select
        value={currency}
        onChange={(e) => savePreference(e.target.value)}
      >
        <option value="IDR">Rupiah (IDR)</option>
        <option value="USD">US Dollar (USD)</option>
      </select>

      <p>Preferensi akan disimpan dalam cookie selama 30 hari.</p>
    </main>
  );
}

