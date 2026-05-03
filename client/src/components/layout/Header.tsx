"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-primary tracking-wider"
        >
          CINE<span className="text-white">TICKET</span>
        </Link>

        {/* Nút Đăng nhập / User Profile */}
        <nav className="flex items-center gap-4">
          {!loading ? (
            user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300 font-medium">
                  Chào, {user.full_name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white border border-gray-700 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primaryHover transition-colors"
              >
                Đăng nhập
              </Link>
            )
          ) : null}
        </nav>
      </div>
    </header>
  );
}
