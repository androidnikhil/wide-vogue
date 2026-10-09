'use client';

import Link from 'next/link';

const sizes = [
    { label: '0 No.', inch: '1.5 - 2 inches', items: 'Explore', isPopular: false },
    { label: '1 No.', inch: '2 - 2.5 inches', items: 'Explore', isPopular: false },
    { label: '2 No.', inch: '2.5 - 3 inches', items: 'Popular', isPopular: true },
    { label: '3 No.', inch: '3 - 3.5 inches', items: 'Explore', isPopular: false },
    { label: '4 No.', inch: '3.5 - 4 inches', items: 'Explore', isPopular: false },
    { label: '5 No.', inch: '4 - 5 inches', items: 'Explore', isPopular: false },
    { label: '6 No.', inch: '5 - 6 inches', items: 'Explore', isPopular: false },
    { label: '7+ No.', inch: '6+ inches', items: 'Explore', isPopular: false },
];

export default function SizeSelector() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 mt-8">
            {sizes.map((size) => {
                const isActive = size.isPopular;
                
                // Base styles
                let containerClass = "relative px-1 py-3 rounded-2xl transition-all duration-300 flex flex-col items-center justify-between text-center cursor-pointer group border-2 h-full ";
                let titleClass = "font-serif text-lg lg:text-xl font-bold block mb-1 transition-colors whitespace-nowrap ";
                let subtitleClass = "text-[10px] leading-tight font-medium block opacity-80 mb-2 ";
                let badgeClass = "inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap mt-auto ";

                if (isActive) {
                    // Active Styles
                    containerClass += "bg-[#0F6F74] border-[#0F6F74] shadow-xl transform -translate-y-2";
                    titleClass += "text-white";
                    subtitleClass += "text-white/80";
                    badgeClass += "bg-[#E6C16A] text-[#003020]";
                } else {
                    // Inactive Styles
                    containerClass += "bg-white border-[#E6C16A]/30 hover:border-[#E6C16A] hover:bg-[#FBF7EE] shadow-sm hover:shadow-md hover:-translate-y-1";
                    titleClass += "text-[#003020] group-hover:text-[#0F6F74]";
                    subtitleClass += "text-[#003020]";
                    badgeClass += "bg-[#0F6F74]/10 text-[#0F6F74]";
                }

                return (
                    <Link 
                        href={`/search?size=${size.label.split(' ')[0]}`}
                        key={size.label} 
                        className={containerClass}
                    >
                        <span className={titleClass}>{size.label}</span>
                        <span className={subtitleClass}>{size.inch}</span>
                        <span className={badgeClass}>{size.items}</span>
                    </Link>
                );
            })}
        </div>
    );
}
