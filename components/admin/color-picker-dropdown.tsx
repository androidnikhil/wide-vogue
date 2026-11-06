'use client';

import { useState } from 'react';
import { Plus, Pipette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { COLOR_OPTIONS } from '@/lib/utils/color-utils';

interface ColorPickerDropdownProps {
  size: string;
  selectedColors: string[];
  onToggleColor: (color: string) => void;
  onAddCustomColor: (color: string) => void;
}

export default function ColorPickerDropdown({
  size,
  selectedColors,
  onToggleColor,
  onAddCustomColor,
}: ColorPickerDropdownProps) {
  const [customHex, setCustomHex] = useState('#111111');
  const [customName, setCustomName] = useState('');

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const trimmedName = customName.trim();
    const finalValue = trimmedName ? `${trimmedName} (${customHex.toUpperCase()})` : customHex.toUpperCase();
    onAddCustomColor(finalValue);
    setCustomName('');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border border-dashed border-[#0F6F74] text-[#0F6F74] hover:bg-[#0F6F74]/10 transition-colors cursor-pointer bg-white shrink-0"
        >
          <Plus className="w-3 h-3" />
          <span>Add Color</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 p-2 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 text-xs"
      >
        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1 pb-1.5 border-b border-neutral-100 flex items-center justify-between">
          <span>Choose Colors (Size {size})</span>
        </div>

        {/* Preset Palette */}
        <div className="max-h-48 overflow-y-auto py-1 space-y-0.5 custom-scroll">
          {COLOR_OPTIONS.map((c) => {
            const isSelected = selectedColors.some(
              (sc) => sc.toLowerCase() === c.name.toLowerCase() || sc.toLowerCase().startsWith(c.name.toLowerCase() + ' ')
            );
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onToggleColor(c.name)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors text-left cursor-pointer ${
                  isSelected ? 'bg-amber-50 font-bold text-amber-900' : 'hover:bg-neutral-100 text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                    style={{ background: c.hex }}
                  />
                  <span>{c.name}</span>
                </div>
                {isSelected && <span className="text-amber-700 text-xs font-bold">✓</span>}
              </button>
            );
          })}
        </div>

        {/* Custom Color Picker Section */}
        <div
          className="mt-2 pt-2 border-t border-neutral-200/80 bg-neutral-50/80 -mx-2 -mb-2 p-2.5 rounded-b-xl space-y-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#003020]">
            <Pipette className="w-3.5 h-3.5 text-[#0F6F74]" />
            <span>Custom Color Picker</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Color Swatch Picker */}
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-neutral-300 shadow-2xs shrink-0 cursor-pointer">
              <input
                type="color"
                value={customHex}
                onChange={(e) => setCustomHex(e.target.value)}
                className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0 p-0"
                title="Click to pick custom color shade"
              />
            </div>

            {/* Color Name Input */}
            <input
              type="text"
              placeholder="e.g. Jet Black / Royal Blue"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustom(e);
                }
              }}
              className="h-8 flex-1 text-xs px-2.5 rounded-lg border border-neutral-200 bg-white text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#0F6F74]"
            />

            <button
              type="button"
              onClick={() => handleAddCustom()}
              className="h-8 px-2.5 rounded-lg bg-[#0F6F74] hover:bg-[#0a4d50] text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              Add
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-neutral-500 px-0.5">
            <span>Hex: <code className="font-mono font-bold text-neutral-700">{customHex.toUpperCase()}</code></span>
            <span className="text-[10px] text-neutral-400">Click circle to open palette</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

