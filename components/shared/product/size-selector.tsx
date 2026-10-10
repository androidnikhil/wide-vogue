'use client';

import { useRouter } from 'next/navigation';

const sizes = [
    { value: '0', label: '0', inch: '1.5 – 2 inches' },
    { value: '1', label: '1', inch: '2 – 2.5 inches' },
    { value: '2', label: '2', inch: '2.5 – 3 inches', isPopular: true },
    { value: '3', label: '3', inch: '3 – 3.5 inches' },
    { value: '4', label: '4', inch: '3.5 – 4 inches' },
    { value: '5', label: '5', inch: '4 – 5 inches' },
    { value: '6', label: '6', inch: '5 – 6 inches' },
    { value: '7', label: '7+', inch: '6+ inches' },
];

export default function SizeSelector({ selectedSize }: { selectedSize?: string }) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
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
                        className={`group relative flex min-h-[96px] w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border p-2 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6F74] focus-visible:ring-offset-2 sm:min-h-[104px] sm:rounded-2xl sm:p-2.5 ${
                            isActive
                                ? 'border-[#0F6F74] bg-[#0F6F74] text-white shadow-[#003020]/15'
                                : 'border-[#E6C16A]/40 bg-white text-[#003020] hover:border-[#C88A20]/70'
                        }`}
                    >
                        <span className="flex items-center gap-2">
                            <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full border font-serif text-lg font-bold tabular-nums transition-colors ${
                                    isActive
                                        ? 'border-white/40 bg-white/10 text-white'
                                        : 'border-[#E6C16A]/50 bg-[#FBF7EE] text-[#003020] group-hover:border-[#C88A20]'
                                }`}
                            >
                                {size.label}
                            </span>
                            <span
                                className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                    isActive ? 'text-white/75' : 'text-[#64716C]'
                                }`}
                            >
                                No.
                            </span>
                        </span>
                        <span
                            className={`text-[11px] font-medium leading-4 ${
                                isActive ? 'text-white/90' : 'text-[#64716C]'
                            }`}
                        >
                            {size.inch}
                        </span>
                        <span
                            className={`h-3 text-[8px] font-bold uppercase tracking-[0.14em] ${
                                isActive ? 'text-[#F3D98F]' : 'text-[#0F6F74]/75'
                            }`}
                        >
                            {isActive ? 'Selected' : size.isPopular ? 'Popular' : '\u00a0'}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
