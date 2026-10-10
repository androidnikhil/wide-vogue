'use client';

import { useRouter } from 'next/navigation';

const sizes = [
    { value: '0', label: '0 No.', inch: '1.5 - 2 inches', items: 'Explore' },
    { value: '1', label: '1 No.', inch: '2 - 2.5 inches', items: 'Explore' },
    { value: '2', label: '2 No.', inch: '2.5 - 3 inches', items: 'Popular' },
    { value: '3', label: '3 No.', inch: '3 - 3.5 inches', items: 'Explore' },
    { value: '4', label: '4 No.', inch: '3.5 - 4 inches', items: 'Explore' },
    { value: '5', label: '5 No.', inch: '4 - 5 inches', items: 'Explore' },
    { value: '6', label: '6 No.', inch: '5 - 6 inches', items: 'Explore' },
    { value: '7', label: '7+ No.', inch: '6+ inches', items: 'Explore' },
];

export default function SizeSelector({ selectedSize }: { selectedSize?: string }) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 items-stretch gap-2 sm:gap-3 mt-8">
            {sizes.map((size) => {
                const isActive = selectedSize === size.value;

                return (
                    <button
                        type="button"
                        key={size.label}
                        aria-pressed={isActive}
                        onClick={() => {
                            const nextSize = isActive ? undefined : size.value;
                            router.push(nextSize ? `/?size=${nextSize}` : '/', {
                                scroll: false,
                            });
                        }}
                        className={`flex min-h-[136px] w-full min-w-0 flex-col items-center justify-between rounded-2xl border-2 px-1.5 py-3 text-center transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6F74] focus-visible:ring-offset-2 ${
                            isActive
                                ? 'border-[#0F6F74] bg-[#0F6F74] shadow-md'
                                : 'border-[#E6C16A]/30 bg-white shadow-sm hover:border-[#E6C16A]'
                        }`}
                    >
                        <span
                            className={`block whitespace-nowrap font-serif text-base font-bold leading-6 tabular-nums sm:text-lg ${
                                isActive ? 'text-white' : 'text-[#003020]'
                            }`}
                        >
                            {size.label}
                        </span>
                        <span
                            className={`flex min-h-8 items-center text-[10px] font-medium leading-4 ${
                                isActive ? 'text-white/80' : 'text-[#003020]'
                            }`}
                        >
                            {size.inch}
                        </span>
                        <span
                            className={`inline-flex min-h-5 items-center justify-center whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                                isActive
                                    ? 'bg-[#E6C16A] text-[#003020]'
                                    : 'bg-[#0F6F74]/10 text-[#0F6F74]'
                            }`}
                        >
                            {size.items}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
