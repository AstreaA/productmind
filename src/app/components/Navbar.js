"use client";
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6">
      
      
        <h1 className="text-3xl font-bold text-[#F13C20]">ProductMind</h1>
        <div className="flex items-center">
        <Link href="/auth/login" className="text-[#F13C20] font-medium mr-4 hover:text-[#d62828]">
          SignIn/Login
        </Link>
        <div className="w-10 h-10 rounded-lg bg-[#C5CBE3] flex items-center justify-center border-2 border-[#C5CBE3] relative">
          <div className="relative w-30 h-30">
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
      
        

    </nav>
  );
}
