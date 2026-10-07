'use client';

import Link from 'next/link';

const sizes = [
    { label: '0 No.', inch: '1.5 - 2 inches', items: '45+ Items', isPopular: false },
    { label: '1 No.', inch: '2 - 2.5 inches', items: '60+ Items', isPopular: false },
    { label: '2 No.', inch: '2.5 - 3 inches', items: 'Popular', isPopular: true },
    { label: '3 No.', inch: '3 - 3.5 inches', items: '90+ Items', isPopular: false },
    { label: '4 No.', inch: '3.5 - 4 inches', items: '110+ Items', isPopular: false },
    { label: '5 No.', inch: '4 - 5 inches', items: '75+ Items', isPopular: false },
    { label: '6 No.', inch: '5 - 6 inches', items: '50+ Items', isPopular: false },
    { label: '7+ No.', inch: '6+ inches', items: 'Custom', isPopular: false },
];

export default function SizeSelector() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 mt-8">
            {sizes.map((size) => {
                const isActive = size.isPopular;
                
                // Base styles
                let containerClass = "p-3 rounded-xl transition-all text-center cursor-pointer group shadow-sm block ";
                let titleClass = "font-headline-sm text-headline-sm font-bold block transition-colors ";
                let subtitleClass = "font-body-sm text-body-sm block text-xs mt-0.5 ";
                let badgeClass = "mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ";

                if (isActive) {
                    // Active Styles
                    containerClass += "bg-primary-container border-2 border-secondary shadow-md hover:scale-105";
                    titleClass += "text-surface";
                    subtitleClass += "text-primary-fixed";
                    badgeClass += "bg-secondary text-on-secondary";
                } else {
                    // Inactive Styles
                    containerClass += "bg-surface border border-outline-variant/50 hover:border-secondary hover:bg-secondary-fixed/10 hover:scale-105";
                    titleClass += "text-primary group-hover:text-secondary";
                    subtitleClass += "text-on-surface-variant";
                    badgeClass += "bg-surface-container text-secondary";
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
