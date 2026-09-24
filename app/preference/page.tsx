"use client";

import { useEffect, useState } from "react";

export default function PreferencePage() {
  const [currency, setCurrency] = useState("IDR");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
  const cookies = document.cookie.split("; ");

  const currencyCookie = cookies.find((row) =>
    row.startsWith("currency=")
  );

  const themeCookie = cookies.find((row) =>
    row.startsWith("theme=")
  );

  if (currencyCookie) {
    setCurrency(currencyCookie.split("=")[1]);
  }

  if (themeCookie) {
  const savedTheme = themeCookie.split("=")[1];

  setTheme(savedTheme);
  document.documentElement.setAttribute("data-theme", savedTheme);
}
}, []);

  function savePreference(value: string) {
    setCurrency(value);

    document.cookie =
      `currency=${value}; path=/; max-age=2592000; SameSite=Lax`;
  }

  function saveTheme(value: string) {
  setTheme(value);

  document.cookie =
    `theme=${value}; path=/; max-age=2592000; SameSite=Lax`;

  document.documentElement.setAttribute("data-theme", value);
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

      <br />
<br />

<label>Pilih tema: </label>

<select
  value={theme}
  onChange={(e) => saveTheme(e.target.value)}
>
  <option value="light">☀️ Light Mode</option>
  <option value="dark">🌙 Dark Mode</option>
</select>

      <p>Preferensi akan disimpan dalam cookie selama 30 hari.</p>
    </main>
  );
}

