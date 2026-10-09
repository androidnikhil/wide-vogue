"use client";
import { useEffect } from 'react';

export default function ScrollHandler() {
  useEffect(() => {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('bg-white/95', 'shadow-md', 'backdrop-blur-lg');
        header.classList.remove('bg-transparent', 'border-transparent', 'shadow-none', 'py-4');
        header.classList.add('py-2');
      } else {
        header.classList.remove('bg-white/95', 'shadow-md', 'backdrop-blur-lg', 'py-2');
        header.classList.add('bg-transparent', 'border-transparent', 'shadow-none', 'py-4');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return null;
}