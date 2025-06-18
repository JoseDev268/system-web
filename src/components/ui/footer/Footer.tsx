import { titleFont } from '@/config/fonts';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="flex justify-center items-center text-xs text-gray-500 mt-10 pb-5 border-t border-gray-200">
      <Link href="/" className="hover:text-gray-700">
        <span className={`${titleFont.className} font-bold`}>HotelApp</span>
        <span> © {new Date().getFullYear()}</span>
      </Link>

      <Link href="/privacy" className="mx-4 hover:text-gray-700">
        Privacidad & Legal
      </Link>

      <Link href="/locations" className="hover:text-gray-700">
        Ubicaciones
      </Link>
    </footer>
  );
};