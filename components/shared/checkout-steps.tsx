import React from "react";
import Link from "next/link";
import { Check, User, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  current?: number;
}

const steps = [
  {
    id: 0,
    number: "1",
    title: "User Login",
    shortTitle: "Login",
    href: "/sign-in",
    icon: User,
  },
  {
    id: 1,
    number: "2",
    title: "Delivery Address",
    shortTitle: "Address",
    href: "/shipping-address",
    icon: MapPin,
  },
  {
    id: 2,
    number: "3",
    title: "Payment Method",
    shortTitle: "Payment",
    href: "/payment-method",
    icon: CreditCard,
  },
  {
    id: 3,
    number: "4",
    title: "Place Order",
    shortTitle: "Summary",
    href: "/place-order",
    icon: ShieldCheck,
  },
];

const CheckoutSteps = ({ current = 0 }: CheckoutStepsProps) => {
  return (
    <nav aria-label="Checkout Progress" className="w-full max-w-3xl mx-auto px-4 py-4 mb-8">
      {/* Container Card */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs px-4 sm:px-8 py-5">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-neutral-200 -z-0" />

          {/* Active Progress Fill Line */}
          <div
            className="absolute top-5 left-6 h-0.5 bg-gradient-to-r from-emerald-600 via-teal-700 to-[#083329] transition-all duration-500 ease-in-out -z-0"
            style={{
              width: `${Math.min(100, (current / (steps.length - 1)) * 100)}%`,
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx < current;
            const isActive = idx === current;
            const isUpcoming = idx > current;
            const StepIcon = step.icon;

            const iconNode = (
              <div
                className={cn(
                  "relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-xs",
                  isCompleted &&
                    "bg-emerald-600 text-white ring-4 ring-emerald-50 shadow-emerald-500/20 hover:scale-105",
                  isActive &&
                    "bg-[#083329] text-[#F3D98F] ring-4 ring-[#083329]/15 shadow-md scale-105 border border-[#D4AF37]/40",
                  isUpcoming &&
                    "bg-neutral-100 text-neutral-400 border border-neutral-200"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white stroke-[2.5]" />
                ) : (
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[11px] sm:text-xs font-semibold">{step.number}</span>
                  </div>
                )}
              </div>
            );

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                {isCompleted ? (
                  <Link
                    href={step.href}
                    className="group flex flex-col items-center focus:outline-none"
                    title={`Return to ${step.title}`}
                  >
                    {iconNode}
                    <div className="mt-2 text-center">
                      <span className="block text-xs font-semibold text-emerald-800 group-hover:text-emerald-900 transition-colors">
                        {step.title}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium inline-flex items-center gap-0.5">
                        Completed ✓
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center">
                    {iconNode}
                    <div className="mt-2 text-center">
                      <span
                        className={cn(
                          "block text-xs font-semibold transition-colors",
                          isActive
                            ? "text-[#083329] font-bold"
                            : "text-neutral-400 font-medium"
                        )}
                      >
                        {step.title}
                      </span>
                      {isActive ? (
                        <span className="inline-block text-[10px] text-[#C88A20] font-bold tracking-wide uppercase">
                          Current Step
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-normal">
                          Step {step.number}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CheckoutSteps;