import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineTicket - Đặt vé xem phim",
  description: "Hệ thống đặt vé xem phim trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Header />
        {/* Main Content chứa nội dung các trang */}
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />

        {/* Cấu hình Toast thông báo góc phải trên */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#333", color: "#fff" },
          }}
        />
      </body>
    </html>
  );
}
