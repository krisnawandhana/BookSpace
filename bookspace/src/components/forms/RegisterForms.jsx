"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!values.email) return "Email wajib diisi";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return "Format email tidak valid";
    if (!values.password) return "Password wajib diisi";
    if (values.password.length < 6) return "Password minimal 6 karakter";
    if (values.password !== values.confirm) return "Konfirmasi password tidak cocok";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setOk("");
    const v = validate();
    if (v) return setErr(v);

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Registrasi gagal");

      setOk("Registrasi sukses! Silakan login.");
      setTimeout(() => router.push("/login"), 800);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
        <input
          type="email"
          className="w-full rounded border px-3 py-2 text-gray-700"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          placeholder="Email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
        <input
          type="password"
          className="w-full rounded border px-3 py-2 text-gray-700"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          placeholder="Password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Konfirmasi Password</label>
        <input
          type="password"
          className="w-full rounded border px-3 py-2 text-gray-700"
          value={values.confirm}
          onChange={(e) => setValues({ ...values, confirm: e.target.value })}
          placeholder="Password"
        />
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}
      {ok && <p className="text-sm text-green-600">{ok}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
      >
        {loading ? "Mendaftar..." : "Daftar"}
      </button>
    </form>
  );
}
