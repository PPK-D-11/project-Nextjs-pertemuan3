"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Register berhasil!");
      router.push("/login");
    } else {
      setMessage(data.message || "Register gagal");
    }
  }

  return (
    <main>
      <h1>Register Expense Tracker</h1>

      <form onSubmit={handleRegister}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            minLength={6}
            required
          />
        </div>

        <br />

        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}

      <p>
        Sudah punya akun?{" "}
        <a href="/login">Login</a>
      </p>
    </main>
  );
}