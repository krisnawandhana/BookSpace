"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import Image from "next/image";

const Navbar = () => {
  const { isAuthenticated, logout, ready } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  if (!ready) return null;     // hindari flicker saat initial load
  if (!isAuthenticated) return null; // sembunyikan Navbar sebelum login

  return (
    <nav className="bg-[#FFFFFF] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Image src="/icon/book_icon.webp" alt="" className="w-12 h-12" width={120} height={28} priority />
            <div className="text-2xl font-bold text-blue-500">BookSpace</div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 font-bold mx-4">
            <Link href="/" className="text-black hover:bg-blue-500 hover:text-stone-100 rounded-lg px-4 py-2 transition-all duration-300">Dashboard</Link>
            <Link href="/favorites" className="text-black hover:bg-blue-500 hover:text-stone-100 rounded-lg px-4 py-2 transition-all duration-300">Favorites</Link>
            <Link href="/categories" className="text-black hover:bg-blue-500 hover:text-stone-100 rounded-lg px-4 py-2 transition-all duration-300">Categories</Link>
            <button className="px-4 py-2 hover:bg-blue-500 rounded-lg" onClick={() => setDark(!dark)}>{dark ? "🌞" : "🌙"}</button>
            {isAuthenticated && (
              <button
                onClick={logout}
                className="text-black hover:bg-red-500 hover:text-white transition-all duration-200 px-4 py-2 rounded"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
            <Link href="/" className="text-white hover:text-blue-700">Dashboard</Link>
            <Link href="/favorites" className="text-white hover:text-blue-700">Favorites</Link>
            <Link href="/categories" className="text-white hover:text-blue-700">Categories</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;