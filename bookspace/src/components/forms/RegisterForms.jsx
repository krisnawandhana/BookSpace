"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "", general: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = { email: "", password: "", confirmPassword: "", general: "" };

    if (!formData.email) nextErrors.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      nextErrors.email = "Format email tidak valid";

    if (!formData.password) nextErrors.password = "Password wajib diisi";
    else if (formData.password.length < 6) nextErrors.password = "Password minimal 6 karakter";

    if (formData.password !== formData.confirmPassword)
      nextErrors.confirmPassword = "Konfirmasi password tidak cocok";

    setErrors(nextErrors);
    return !nextErrors.email && !nextErrors.password && !nextErrors.confirmPassword;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setErrors({ email: "", password: "", confirmPassword: "", general: "" });
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Registrasi gagal");

      setSuccessMessage("Registrasi sukses! Silakan login.");
      setTimeout(() => router.push("/login"), 800);

    } catch (err) {
      setErrors((prev) => ({ ...prev, general: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
        <input
          type="email"
          className="w-full rounded border px-3 py-2 text-gray-700"
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
        <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
        <input
          type="password"
          className="w-full rounded border px-3 py-2 text-gray-700"
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

      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Konfirmasi Password</label>
        <input
          type="password"
          className="w-full rounded border px-3 py-2 text-gray-700"
          value={formData.confirmPassword}
          onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value })}
          placeholder="Password"
        />
        {errors.confirmPassword && (
          <p id="confirm-password-error" className="text-sm text-red-600 mt-1">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      
      {errors.general && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.general}
        </p>
      )}
      {successMessage && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
      >
        {isSubmitting ? "Mendaftar..." : "Daftar"}
      </button>
    </form>
  );
}
