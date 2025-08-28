"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginForm() {
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm  = () => {
    const nextErrors = { email: "", password: "", general: "" };

    if (!formData.email) nextErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      nextErrors.email = "Format email tidak valid";

    if (!formData.password) nextErrors.password = "Password wajib diisi";
    else if (formData.password.length < 6)
      nextErrors.password = "Minimal 6 karakter";

    setErrors(nextErrors);

    return !nextErrors.email && !nextErrors.password;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    if (!validateForm()) return;

    setIsSubmitting(true);

    console.log("[LOGIN] sending request", formData);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Login gagal");

      login(data.user, data.token);
    } catch (errors) {
      setErrors((prev) => ({ ...prev, general: errors.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="block text-sm text-black font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full rounded border px-3 py-2 outline-none focus:ring text-gray-700"
          value={formData.email}
          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
          placeholder="Email"
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-red-600 mt-1">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm text-black font-medium mb-1">Password</label>
        <input
          type="password"
          className="w-full rounded border px-3 py-2 outline-none focus:ring text-gray-700"
          value={formData.password}
          onChange={(event) => setFormData({ ...formData, password: event.target.value })}
          placeholder="Password"
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-red-600 mt-1">
            {errors.password}
          </p>
        )}
      </div>

      {errors.general && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.general}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {isSubmitting ? "Masuk..." : "Masuk"}
      </button>
    </form>
  );
}
