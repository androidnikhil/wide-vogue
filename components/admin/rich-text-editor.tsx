'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading3, 
  RemoveFormatting,
  Code
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write product description...',
  className = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const isInternalChangeRef = useRef(false);

  // Sync external value changes into editor
  useEffect(() => {
    if (editorRef.current && !isInternalChangeRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChangeRef.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChangeRef.current = true;
      const html = editorRef.current.innerHTML;
      // If content is just empty tags, send empty string
      if (html === '<p><br></p>' || html === '<br>' || html.trim() === '') {
        onChange('');
      } else {
        onChange(html);
      }
    }
  }, [onChange]);

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      handleInput();
    }
  };

  // Safe cleaner for pasted rich text (from Word, Google Docs, WhatsApp, etc.)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const plainText = e.clipboardData.getData('text/plain');

    if (html) {
      // Parse and clean HTML to retain only safe formatting tags
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Sanitize nodes recursively
      const cleanNode = (node: Node): Node | null => {
        if (node.nodeType === Node.TEXT_NODE) {
          return document.createTextNode(node.textContent || '');
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          const tagName = el.tagName.toLowerCase();
          const allowedTags = ['b', 'strong', 'i', 'em', 'u', 'ul', 'ol', 'li', 'p', 'br', 'h3', 'h4', 'span'];

          if (allowedTags.includes(tagName)) {
            const cleanEl = document.createElement(tagName === 'strong' ? 'b' : tagName === 'em' ? 'i' : tagName);
            el.childNodes.forEach((child) => {
              const cleaned = cleanNode(child);
              if (cleaned) cleanEl.appendChild(cleaned);
            });
            return cleanEl;
          } else {
            // Unwrap disallowed tag but keep children
            const fragment = document.createDocumentFragment();
            el.childNodes.forEach((child) => {
              const cleaned = cleanNode(child);
              if (cleaned) fragment.appendChild(cleaned);
            });
            return fragment;
          }
        }
        return null;
      };

      const fragment = document.createDocumentFragment();
      doc.body.childNodes.forEach((child) => {
        const cleaned = cleanNode(child);
        if (cleaned) fragment.appendChild(cleaned);
      });

      const wrapper = document.createElement('div');
      wrapper.appendChild(fragment);
      const cleanHtml = wrapper.innerHTML || plainText;

      document.execCommand('insertHTML', false, cleanHtml);
    } else {
      // Convert plain text line breaks to paragraphs or <br>
      const formatted = plainText
        .split('\n')
        .map((line) => line.trim())
        .join('<br>');
      document.execCommand('insertHTML', false, formatted);
    }

    handleInput();
  };

  return (
    <div className={`border border-neutral-300 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:border-[#C88A20] focus-within:ring-1 focus-within:ring-[#C88A20] transition-all ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-neutral-50/90 border-b border-neutral-200 text-neutral-700">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1.5 rounded-lg hover:bg-neutral-200/70 hover:text-neutral-900 transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1.5 rounded-lg hover:bg-neutral-200/70 hover:text-neutral-900 transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1.5 rounded-lg hover:bg-neutral-200/70 hover:text-neutral-900 transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-neutral-300 mx-1" />

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="px-2 py-1 text-xs font-bold rounded-lg hover:bg-neutral-200/70 hover:text-neutral-900 transition-colors flex items-center gap-1"
          title="Heading"
        >
          <Heading3 className="w-4 h-4" />
          <span>Heading</span>
        </button>

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 rounded-lg hover:bg-neutral-200/70 hover:text-neutral-900 transition-colors"
          title="Bulleted List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-1.5 rounded-lg hover:bg-neutral-200/70 hover:text-neutral-900 transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-neutral-300 mx-1" />

        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="p-1.5 rounded-lg hover:bg-neutral-200/70 hover:text-red-700 transition-colors"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={`ml-auto px-2 py-1 text-xs font-mono rounded-lg transition-colors flex items-center gap-1 border ${
            isHtmlMode 
              ? 'bg-[#003020] text-amber-200 border-[#003020]' 
              : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-100'
          }`}
          title="Toggle HTML Source"
        >
          <Code className="w-3.5 h-3.5" />
          <span>{isHtmlMode ? 'Visual' : 'HTML'}</span>
        </button>
      </div>

      {/* Editor Body */}
      {isHtmlMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Edit raw HTML..."
          className="w-full p-4 min-h-[160px] font-mono text-xs text-neutral-800 bg-neutral-50/50 outline-none resize-y"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          className="p-4 min-h-[160px] max-h-[420px] overflow-y-auto outline-none text-sm text-[#003020] leading-relaxed prose prose-sm max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-400 empty:before:pointer-events-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-base [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:mb-2"
        />
      )}
    </div>
  );
}
