import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary tracking-wider">
          CINE<span className="text-white">TICKET</span>
        </Link>

        {/* Nút Đăng nhập */}
        <nav>
          <Link 
            href="/login" 
            className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primaryHover transition-colors"
          >
            Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  );
}