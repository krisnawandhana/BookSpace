import LoginForm from "@/components/forms/LoginForms";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold text-black">Masuk ke <span className="text-blue-600">BookSpace</span></h1>
        <p className="mb-6 text-sm text-black">
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
