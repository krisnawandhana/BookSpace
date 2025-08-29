"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "", general: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
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
    <form onSubmit={onSubmit} noValidate className="w-full max-w-sm space-y-5">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
          Email
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7l8 5 8-5" stroke="black" strokeWidth="1.6" />
              <rect x="4" y="5" width="16" height="14" rx="2" stroke="black" strokeWidth="1.6" />
            </svg>
          </span>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            className={`w-full rounded-lg border px-3 py-2 pl-10 outline-none text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 ${
              errors.email ? "border-red-300" : "border-gray-300"
            }`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
        </div>
        {errors.email ? (
          <p id="email-error" className="text-sm text-red-600 mt-1">{errors.email}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">Gunakan email aktif.</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
          Password
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="black" strokeWidth="1.6" />
              <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="black" strokeWidth="1.6" />
            </svg>
          </span>
          <button
            type="button"
            onClick={() => setShowPw?.((v) => !v)}
            className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 hover:bg-gray-50"
            aria-label="Toggle password visibility"
            title="Show/Hide password"
          >
            {showPw ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="black" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="3" stroke="black" strokeWidth="1.6" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 3l18 18" stroke="black" strokeWidth="1.6" />
                <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.9-2.3" stroke="black" strokeWidth="1.6" />
                <path d="M9.9 4.3A11.2 11.2 0 0 1 12 4.1c6 0 10 7 10 7a17.4 17.4 0 0 1-3.2 3.7M6 6A17.5 17.5 0 0 0 2 11.1s4 7 10 7c1.7 0 3.2-.4 4.5-1.1" stroke="black" strokeWidth="1.6" />
              </svg>
            )}
          </button>
          <input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            required
            className={`w-full rounded-lg border px-3 py-2 pl-10 pr-10 outline-none text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 ${
              errors.password ? "border-red-300" : "border-gray-300"
            }`}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
        </div>
        {errors.password ? (
          <p id="password-error" className="text-sm text-red-600 mt-1">{errors.password}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter disarankan.</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-1">
          Konfirmasi Password
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="black" strokeWidth="1.6" />
              <path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="black" strokeWidth="1.6" />
            </svg>
          </span>
          <button
            type="button"
            onClick={() => setShowConfirmPw?.((v) => !v)}
            className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 hover:bg-gray-50"
            aria-label="Toggle confirm password visibility"
            title="Show/Hide password"
          >
            {showConfirmPw ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" stroke="black" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="3" stroke="black" strokeWidth="1.6" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 3l18 18" stroke="black" strokeWidth="1.6" />
                <path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.9-2.3" stroke="black" strokeWidth="1.6" />
                <path d="M9.9 4.3A11.2 11.2 0 0 1 12 4.1c6 0 10 7 10 7a17.4 17.4 0 0 1-3.2 3.7M6 6A17.5 17.5 0 0 0 2 11.1s4 7 10 7c1.7 0 3.2-.4 4.5-1.1" stroke="black" strokeWidth="1.6" />
              </svg>
            )}
          </button>
          <input
            id="confirmPassword"
            type={showConfirmPw ? "text" : "password"}
            autoComplete="new-password"
            required
            className={`w-full rounded-lg border px-3 py-2 pl-10 pr-10 outline-none text-gray-900 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 ${
              errors.confirmPassword ? "border-red-300" : formData.confirmPassword && formData.confirmPassword === formData.password ? "border-green-300" : "border-gray-300"
            }`}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Ulangi password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
          />
        </div>
        {errors.confirmPassword ? (
          <p id="confirm-password-error" className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
        ) : formData.confirmPassword ? (
          <p className={`text-xs mt-1 ${formData.confirmPassword === formData.password ? "text-green-600" : "text-amber-600"}`}>
            {formData.confirmPassword === formData.password ? "Password cocok." : "Password belum cocok."}
          </p>
        ) : (
          <p className="text-xs text-gray-500 mt-1">Masukkan ulang password untuk verifikasi.</p>
        )}
      </div>

      {/* General error & success */}
      {errors.general && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors.general}
        </div>
      )}
      {successMessage && (
        <p className="text-sm text-green-600">{successMessage}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60 shadow-sm"
      >
        {isSubmitting && (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 3a9 9 0 1 1-9 9" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {isSubmitting ? "Mendaftar..." : "Daftar"}
      </button>
    </form>
  );
}
