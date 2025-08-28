"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import Image from "next/image";

const Navbar = () => {
  const { isAuthenticated, logout, ready } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);

  if (!ready) return null; 
  if (!isAuthenticated) return null; 

  const closeMenu = () => setIsOpen(false);

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
            <Link href="/" className="text-black hover:text-blue-500  rounded-lg px-4 py-2 transition-all duration-300">Dashboard</Link>
            <Link href="/favorites" className="text-black hover:text-blue-500 rounded-lg px-4 py-2 transition-all duration-300">Favorites</Link>
            <Link href="/category" className="text-black hover:text-blue-500 rounded-lg px-4 py-2 transition-all duration-300">Categories</Link>
            <button className="px-4 py-2 hover:bg-blue-500 rounded-lg" onClick={() => setDark(!dark)}>{dark ? "🌞" : "🌙"}</button>
            {isAuthenticated && (
              <button
                onClick={logout}
                className="text-black hover:text-red-500 transition-all duration-200 px-4 py-2 rounded"
              >
                Logout
              </button>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded hover:bg-gray-100"
            aria-label="Toggle menu"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          >
            <Image src="/navbar-icon/burger-bar.png" alt="Menu" width={24} height={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t shadow-sm transition-all duration-300">
          <div className="px-4 py-3 flex flex-col">
            <Link href="/" onClick={closeMenu} className="text-black hover:text-blue-700">Dashboard</Link>
            <Link href="/favorites" onClick={closeMenu} className="text-black hover:text-blue-700">Favorites</Link>
            <Link href="/category" onClick={closeMenu} className="text-black hover:text-blue-700">Categories</Link>
            <button
                onClick={() => { logout(); closeMenu(); }}
                className="px-3 py-2 rounded hover:bg-red-50 text-red-600"
              >
                Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;