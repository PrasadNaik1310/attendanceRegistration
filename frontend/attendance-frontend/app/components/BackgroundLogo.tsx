"use client";
import Image from 'next/image';

export default function BackgroundLogo() {
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <div className="opacity-10 transform scale-150">
        <Image 
          src="/mit-wpu-logo.webp" 
          alt="Background Logo" 
          width={500} 
          height={500} 
          className="select-none"
        />
      </div>
    </div>
  );
}
