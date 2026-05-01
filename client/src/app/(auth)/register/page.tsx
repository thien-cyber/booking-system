"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/libs/axios";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post("/auth/register", formData);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login"); // Chuyển sang trang đăng nhập
    } catch (error: any) {
      toast.error(
        Array.isArray(error.response?.data?.message) 
          ? error.response.data.message[0] // NestJS class-validator trả về mảng lỗi
          : error.response?.data?.message || "Đăng ký thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-2xl shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center">Đăng ký</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Họ và Tên</label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-white focus:outline-none focus:border-primary"
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Mật khẩu (Tối thiểu 6 ký tự)</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 text-white font-semibold bg-primary rounded-lg hover:bg-primaryHover disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Tạo tài khoản"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}