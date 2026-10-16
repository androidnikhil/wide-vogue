'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CopyButtonProps {
  text: string;
  label?: string;
  title?: string;
  variant?: 'default' | 'ghost' | 'light' | 'badge';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  successMessage?: string;
}

export default function CopyButton({
  text,
  label,
  title = 'Copy',
  variant = 'ghost',
  size = 'sm',
  className = '',
  successMessage,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(successMessage || `${title} copied!`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / iframe restrictions
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast.success(successMessage || `${title} copied!`);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy to clipboard');
      }
      document.body.removeChild(textArea);
    }
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  const variantStyles = {
    ghost:
      'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50 rounded-md transition-colors',
    default:
      'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200/80 rounded-lg shadow-2xs transition-all active:scale-95',
    light:
      'bg-white/15 hover:bg-white/25 text-white border border-white/25 rounded-md shadow-inner transition-all active:scale-95',
    badge:
      'bg-surface-container-high hover:bg-surface-container-highest text-primary border border-outline-variant/30 rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all active:scale-95',
  };

  const paddingSizes = {
    xs: 'p-1 text-[11px]',
    sm: 'p-1.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={title}
      aria-label={title}
      className={`inline-flex items-center gap-1 font-medium transition-all cursor-pointer ${
        variantStyles[variant]
      } ${paddingSizes[size]} ${className}`}
    >
      {copied ? (
        <Check className={`${iconSizes[size]} text-emerald-600 animate-in zoom-in-75`} />
      ) : (
        <Copy className={`${iconSizes[size]} opacity-70 group-hover:opacity-100`} />
      )}
      {label && (
        <span className={copied ? 'text-emerald-600' : ''}>
          {copied ? 'Copied' : label}
        </span>
      )}
    </button>
  );
}
