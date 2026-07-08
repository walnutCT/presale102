/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Check, X, ChevronDown } from 'lucide-react';

export interface MultiSelectFilterProps {
  title: string;
  options: (string | number)[];
  selected: (string | number)[];
  onChange: (newSelected: any[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  optionCounts?: Record<string | number, number>;
  renderLabel?: (val: any) => React.ReactNode;
  placeholder: string;
  dropdownWidth?: string;
}

export default function MultiSelectFilter({
  title,
  options,
  selected,
  onChange,
  isOpen,
  onToggle,
  onClose,
  optionCounts,
  renderLabel,
  placeholder,
  dropdownWidth = "w-52"
}: MultiSelectFilterProps) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => {
    const searchText = renderLabel ? String(opt) : String(opt);
    return searchText.toLowerCase().includes(search.toLowerCase());
  });

  const handleToggleOption = (opt: string | number) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(x => x !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const handleSelectAll = () => {
    onChange(options);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative inline-block text-left w-full select-none font-sans">
      {/* Dropdown trigger button */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`flex items-center justify-between bg-white hover:bg-slate-50 border ${
          selected.length > 0 ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200'
        } rounded-lg px-2.5 py-1.5 shadow-sm cursor-pointer transition-all gap-1 text-[11px] font-bold text-slate-700 min-h-[32px]`}
      >
        <span className="truncate max-w-[120px] font-bold text-slate-700">
          {selected.length === 0
            ? placeholder
            : selected.length === options.length
            ? `ทั้งหมด (${options.length})`
            : `${selected.length} รายการ`}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="p-0.5 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-600' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Transparent click-outside overlay */}
          <div 
            className="fixed inset-0 z-[100] bg-transparent cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
          />

          <div className={`absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 mt-1.5 ${dropdownWidth} bg-white border border-slate-150 rounded-xl shadow-xl z-[110] py-2.5 flex flex-col gap-2 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-100`}>
            {/* Header / Search */}
            <div className="px-2.5 pb-1.5 border-b border-slate-100">
              <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`ค้นหา${title}...`}
                  className="w-full bg-transparent border-none outline-none text-[11px] font-bold text-slate-700 placeholder:text-slate-400"
                  onClick={(e) => e.stopPropagation()}
                />
                {search && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearch('');
                    }}
                    className="text-slate-400 hover:text-red-600 text-[10.5px] font-black cursor-pointer pl-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between px-3 py-0.5 text-[10px] font-black text-slate-500 select-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectAll();
                }}
                className="hover:text-red-600 transition-colors cursor-pointer"
              >
                ✓ เลือกทั้งหมด
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                className="hover:text-red-600 transition-colors cursor-pointer"
              >
                ✗ ล้างทั้งหมด
              </button>
            </div>

            {/* Options List */}
            <div className="max-h-52 overflow-y-auto px-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {filteredOptions.length === 0 ? (
                <div className="px-2.5 py-4 text-center text-slate-400 text-[11px] italic font-semibold">
                  ไม่พบตัวเลือก
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isChecked = selected.includes(opt);
                  const count = optionCounts ? optionCounts[opt] : undefined;
                  const label = renderLabel ? renderLabel(opt) : String(opt);

                  return (
                    <div
                      key={String(opt)}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleOption(opt);
                      }}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-slate-50 cursor-pointer text-[11px] text-slate-700 font-bold transition-colors select-none"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                        isChecked 
                          ? 'bg-red-600 border-red-600 text-white shadow-sm' 
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3.5]" />}
                      </div>
                      <span className="truncate flex-1 text-left">{label}</span>
                      {count !== undefined && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 rounded-md px-1.5 py-0.5 font-mono shrink-0 font-bold">
                          {count}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
