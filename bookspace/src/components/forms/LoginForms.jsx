"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginForm() {
  const { login } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const valid = () => {
    if (!values.email) return "Email wajib diisi";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return "Format email tidak valid";
    if (!values.password) return "Password wajib diisi";
    if (values.password.length < 6) return "Minimal 6 karakter";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = valid();
    if (v) return setErrors(v);
    setErrors(""); setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Login gagal");
      login(data.user, data.token);
    } catch (e2) {
      setErrors((prev) => ({ ...prev, general: e2.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="block text-sm text-black font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full rounded border px-3 py-2 outline-none focus:ring text-gray-700"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          placeholder="Email"
        />
        {errors.email ? <p className="text-sm text-red-600 mt-1">{errors.email}</p> : null}
      </div>

      <div>
        <label className="block text-sm text-black font-medium mb-1">Password</label>
        <input
          type="password"
          className="w-full rounded border px-3 py-2 outline-none focus:ring text-gray-700"
          value={values.password}
          onChange={(e) => setValues({ ...values, password: e.target.value })}
          placeholder="Password"
        />
        {errors.password ? <p className="text-sm text-red-600 mt-1">{errors.password}</p> : null}
      </div>

      {errors.general ? (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.general}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}
