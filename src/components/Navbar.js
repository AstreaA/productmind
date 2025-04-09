import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="flex justify-between items-center mb-8">
      <Link href="/" className="text-2xl font-bold text-[#F13C20]">
        ProductMind
      </Link>
      <div className="flex items-center">
        <Link href="/signin" className="text-[#F13C20] font-medium mr-4 hover:text-[#d62828]">
          SignIn/Login
        </Link>
        <div className="w-10 h-10 rounded-lg bg-[#C5CBE3] flex items-center justify-center border-2 border-[#4056A1] relative">
          <div className="relative w-6 h-6">
            <Image 
              src="/images/question.png"
              alt="Help"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
} 