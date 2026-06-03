/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calendar, CheckSquare, Search, TrendingDown, HelpCircle } from 'lucide-react';
import { DailyCardData } from '../types';
import { CUSTOMER_GROUPS } from '../data';

interface DailyCardsProps {
  dailyData: DailyCardData[];
  onToggleCustomerGroupForDay: (dayIndex: number, groupCode: string) => void;
  onSetAllCustomerGroupsForDay: (dayIndex: number) => void;
  // Dynamic override parameters passed from main view to reflect real-time pricing changes
  totalPriceAmt: number; 
  totalOverrideQty: number;
}

export default function DailyCards({
  dailyData,
  onToggleCustomerGroupForDay,
  onSetAllCustomerGroupsForDay,
  totalPriceAmt,
  totalOverrideQty
}: DailyCardsProps) {
  // Local toggles for search popovers
  const [activeSearchDay, setActiveSearchDay] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {dailyData.map((data, idx) => {
        // Compute dynamic parameters so the cards feel alive and respond to formulas!
        // Let's seed initial metrics and add calculations proportionate to totalPriceAmt
        const baseEstGenSelect = 1892570;
        const baseOvrAmt = -214888;
        const baseEstGenG10_G60 = 21243435;

        // Apply realistic dynamic shifts based on the actual table pricing adjustments!
        const dynamicEstGenSelect = Math.max(0, baseEstGenSelect + totalPriceAmt);
        const dynamicOvrAmt = baseOvrAmt + totalPriceAmt;
        const dynamicEstGenG10_G60 = Math.max(0, baseEstGenG10_G60 + totalPriceAmt * 3);
        const dynamicDiffPercent = dynamicEstGenSelect > 0 
          ? parseFloat(((dynamicOvrAmt / dynamicEstGenSelect) * 100).toFixed(2)) 
          : -0.86;

        return (
          <div 
            key={data.day} 
            className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col text-xs transition-all hover:shadow-md"
          >
            {/* Header Red/Magenta color block with Date and Offset */}
            <div className="bg-[#ba191a] text-white px-3 py-2 flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5 uppercase font-sans font-semibold">
                <Calendar className="w-3.5 h-3.5 text-red-200" />
                {data.day}
              </span>
              <span className="px-1.5 py-0.5 bg-[#941014] text-white rounded text-[10px] font-mono font-bold">
                {data.offset}
              </span>
            </div>

            {/* Card Body */}
            <div className="p-3.5 space-y-3.5 grow flex flex-col justify-between">
              {/* Autocomplete selector */}
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  กลุ่มลูกค้า
                </label>
                <div 
                  onClick={() => setActiveSearchDay(activeSearchDay === idx ? null : idx)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded px-2.5 py-1.5 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <span className="text-slate-600 truncate font-semibold">
                    {data.selectedCustomerGroups.length === CUSTOMER_GROUPS.length 
                      ? 'กลุ่มลูกค้าทั้งหมด' 
                      : `เลือกไว้ (${data.selectedCustomerGroups.length}/${CUSTOMER_GROUPS.length})`}
                  </span>
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                </div>

                {/* Autocomplete selection tag display */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-semibold rounded border border-red-100 flex items-center gap-1">
                    กลุ่มลูกค้าทั้งหมด
                    <span className="bg-red-200 text-red-800 text-[9px] px-1 rounded-full font-mono font-bold">
                      {data.selectedCustomerGroups.length}
                    </span>
                  </span>
                </div>

                {/* Popover overlay for day options */}
                {activeSearchDay === idx && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 p-2.5 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                      <span className="font-bold text-slate-700 text-[10px]">เลือกช่องจัดส่ง</span>
                      <button 
                        onClick={() => onSetAllCustomerGroupsForDay(idx)}
                        className="text-[10px] text-red-600 hover:underline font-semibold"
                      >
                        เลือกทั้งหมด
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                      {CUSTOMER_GROUPS.map(grp => {
                        const isChecked = data.selectedCustomerGroups.includes(grp.code);
                        return (
                          <label key={grp.code} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-50 rounded transition-colors text-[11px]">
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-red-600 h-3.5 w-3.5"
                              checked={isChecked}
                              onChange={() => onToggleCustomerGroupForDay(idx, grp.code)}
                            />
                            <span className="font-bold text-slate-700 font-mono">{grp.code}</span>
                            <span className="text-slate-500 font-medium font-sans truncate">{grp.name}</span>
                          </label>
                        );
                      })}
                    </div>
                    <button 
                      onClick={() => setActiveSearchDay(null)}
                      className="w-full py-1 text-center bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[10px] text-slate-600 transition-colors mt-1"
                    >
                      เสร็จสิ้น
                    </button>
                  </div>
                )}
              </div>

              {/* Checkbox matrix layout mirroring screenshot */}
              <div className="bg-slate-50/50 border border-slate-200 rounded-lg p-2.5 space-y-2">
                {CUSTOMER_GROUPS.map(grp => {
                  const isChecked = data.selectedCustomerGroups.includes(grp.code);
                  return (
                    <label key={grp.code} className="flex items-center justify-between cursor-pointer py-0.5.5">
                      <span className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5 cursor-pointer"
                          checked={isChecked}
                          onChange={() => onToggleCustomerGroupForDay(idx, grp.code)}
                        />
                        <span className="font-bold text-slate-700 font-mono">{grp.code}</span>
                        <span className="text-slate-400 text-[10px]">({grp.name})</span>
                      </span>
                      {isChecked && (
                        <span className="h-1.5 w-1.5 bg-red-600 rounded-full animate-pulse"></span>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Financial metric display list */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                {/* Est.GEN (Select) */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold block">Est.GEN (Select)</span>
                  <span className="font-mono text-xs font-black text-slate-800">
                    {Math.round(dynamicEstGenSelect).toLocaleString()}
                  </span>
                </div>

                {/* Diff % */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold block">Diff %</span>
                  <span className={`font-mono text-xs font-black flex items-center gap-0.5 ${dynamicDiffPercent < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {dynamicDiffPercent > 0 ? `+${dynamicDiffPercent}%` : `${dynamicDiffPercent}%`}
                    {dynamicDiffPercent < 0 && <TrendingDown className="w-3 h-3 text-rose-500" />}
                  </span>
                </div>

                {/* Ovr.Amt */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold block">Ovr.Amt</span>
                  <span className={`font-mono text-xs font-black ${dynamicOvrAmt < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {Math.round(dynamicOvrAmt).toLocaleString()}
                  </span>
                </div>

                {/* Est.GEN (G10-G60) */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold block">Est.GEN (G10-G60)</span>
                  <span className="font-mono text-xs font-black text-slate-800">
                    {Math.round(dynamicEstGenG10_G60).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
