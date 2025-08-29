import LoginForm from "@/components/forms/LoginForms";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen grid place-items-center bg-cover bg-center bg-[url('/bg/background.jpeg')]"
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-xl bg-white/80 backdrop-blur-md p-6 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Masuk ke <span className="text-blue-600">BookSpace</span>
        </h1>
        <p className="mb-6 text-sm text-gray-700">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
