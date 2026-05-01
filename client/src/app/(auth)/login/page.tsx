"use client"; // Bắt buộc vì có xử lý sự kiện form và state

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axiosInstance from "@/libs/axios";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API sang NestJS
      const res: any = await axiosInstance.post("/auth/login", formData);
      
      // Lưu token vào Cookie
      Cookies.set("access_token", res.access_token, { expires: 1 }); // Lưu 1 ngày
      
      toast.success("Đăng nhập thành công!");
      router.push("/"); // Chuyển hướng về trang chủ
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-2xl shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center">Đăng nhập</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="nhapemail@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 text-white font-semibold bg-primary rounded-lg hover:bg-primaryHover disabled:opacity-50 transition-colors"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}