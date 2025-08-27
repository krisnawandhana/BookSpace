import RegisterForm from "@/components/forms/RegisterForms";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold text-black">Daftar akun <span className="text-blue-600">BookSpace</span></h1>
        <p className="mb-6 text-sm text-black">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}
