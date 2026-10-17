'use client';

import React from 'react';

interface BlogContentRendererProps {
  content: string;
  className?: string;
}

/**
 * Parses inline formatting like **bold**, *italic*, and [links](url)
 */
function parseInline(text: string): React.ReactNode[] {
  // Regex to match **bold**, *italic*, [link](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-bold text-neutral-900">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-neutral-800">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, linkText, linkUrl] = linkMatch;
      return (
        <a
          key={index}
          href={linkUrl}
          target={linkUrl.startsWith('http') ? '_blank' : undefined}
          rel={linkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-[#0F6F74] font-medium underline underline-offset-4 hover:text-[#003020] transition-colors"
        >
          {linkText}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

/**
 * Checks if the content is raw HTML (e.g. pasted from rich text editors / Word)
 */
function isHtml(str: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(str);
}

export default function BlogContentRenderer({ content, className = '' }: BlogContentRendererProps) {
  if (!content) return null;

  // If user pasted raw HTML (contains tags like <p>, <div>, <h2>, <ul>), render safely with styling
  if (isHtml(content)) {
    return (
      <div
        className={`prose prose-neutral max-w-none text-neutral-800 text-base md:text-[18px] leading-[1.85] font-sans
          prose-headings:font-serif prose-headings:text-[#003020] prose-headings:font-bold
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:pt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-[#E6C16A]/30
          prose-h3:text-xl md:prose-h3:text-2xl prose-h3:pt-6 prose-h3:text-[#003020]
          prose-p:my-5 prose-p:leading-[1.85]
          prose-strong:font-bold prose-strong:text-neutral-900
          prose-blockquote:border-l-4 prose-blockquote:border-[#C88A20] prose-blockquote:bg-[#FAF4E6]/70 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:font-serif prose-blockquote:italic
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-5 prose-ul:space-y-2
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-5 prose-ol:space-y-2
          prose-li:leading-relaxed
          ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Parse structured text / markdown blocks
  const rawLines = content.split('\n');
  const blocks: React.ReactNode[] = [];

  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      blocks.push(
        <ul
          key={`ul-${blocks.length}`}
          className="my-5 pl-5 space-y-2.5 text-neutral-800 font-sans text-base md:text-[17px] leading-[1.75]"
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-[#C88A20] mt-2.5 shrink-0" />
              <div className="flex-1">{parseInline(item)}</div>
            </li>
          ))}
        </ul>
      );
    } else {
      blocks.push(
        <ol
          key={`ol-${blocks.length}`}
          className="my-5 pl-2 space-y-3 text-neutral-800 font-sans text-base md:text-[17px] leading-[1.75]"
        >
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#FAF4E6] border border-[#E6C16A]/50 text-[#8A5A0A] font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1">{parseInline(item)}</div>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    // Empty line separates paragraphs / lists
    if (!line) {
      flushList();
      continue;
    }

    // Heading 2: ## Heading
    if (line.startsWith('## ')) {
      flushList();
      const headingText = line.replace(/^##\s+/, '');
      blocks.push(
        <h2
          key={`h2-${blocks.length}`}
          className="font-serif text-2xl md:text-3xl font-bold text-[#003020] pt-8 pb-2 mt-4 border-b border-[#E6C16A]/30 tracking-tight flex items-center gap-2"
        >
          <span className="w-1.5 h-6 bg-[#C88A20] rounded-full inline-block" />
          <span>{parseInline(headingText)}</span>
        </h2>
      );
      continue;
    }

    // Heading 3: ### Heading
    if (line.startsWith('### ')) {
      flushList();
      const headingText = line.replace(/^###\s+/, '');
      blocks.push(
        <h3
          key={`h3-${blocks.length}`}
          className="font-serif text-xl md:text-2xl font-bold text-[#003020] pt-6 pb-1 mt-2 tracking-tight"
        >
          {parseInline(headingText)}
        </h3>
      );
      continue;
    }

    // Blockquote: > Quote
    if (line.startsWith('> ')) {
      flushList();
      const quoteText = line.replace(/^>\s+/, '');
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="my-6 pl-5 pr-4 py-4 rounded-r-2xl bg-gradient-to-r from-[#FAF4E6] to-[#FAF8F5] border-l-4 border-[#C88A20] font-serif italic text-base md:text-lg text-[#003020] shadow-2xs leading-relaxed"
        >
          {parseInline(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Divider: ---
    if (line === '---' || line === '***') {
      flushList();
      blocks.push(
        <div key={`hr-${blocks.length}`} className="my-8 flex items-center justify-center gap-3">
          <div className="h-px bg-neutral-200 flex-1" />
          <span className="text-[#C88A20] text-xs">✦ ✦ ✦</span>
          <div className="h-px bg-neutral-200 flex-1" />
        </div>
      );
      continue;
    }

    // Bullet point: • or - or * (when not italic)
    if (/^[•\-*]\s+/.test(line)) {
      const itemText = line.replace(/^[•\-*]\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Numbered list: 1. or 1)
    if (/^\d+[\.\)]\s+/.test(line)) {
      const itemText = line.replace(/^\d+[\.\)]\s+/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Regular paragraph text
    flushList();
    blocks.push(
      <p
        key={`p-${blocks.length}`}
        className="my-4 text-neutral-800 font-sans text-base md:text-[17.5px] leading-[1.85] tracking-normal"
      >
        {parseInline(line)}
      </p>
    );
  }

  flushList();

  return <div className={`blog-article-body space-y-1 ${className}`}>{blocks}</div>;
}
