"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6">
      
        <h1 className="text-4xl font-bold text-[#f13c20]">ProductMind</h1>
        <div className="flex gap-4 text-[#d62828] font-bold">
          <a href="#" className="hover:underline mr-2 mt-3">Menu</a>
          <Image src="/menu.png" alt="Menu" width={50} height={50} />
          
        </div>
        

    </nav>
  );
}
