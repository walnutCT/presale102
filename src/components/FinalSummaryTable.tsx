/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Check, CheckSquare, Layers, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface FinalSummaryTableProps {
  finalizedProducts: Product[] | null;
}

export default function FinalSummaryTable({ finalizedProducts }: FinalSummaryTableProps) {
  if (!finalizedProducts) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-10 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto">
          <div className="p-3 bg-red-50 text-[#ba191a] rounded-full">
            <Layers className="w-8 h-8 opacity-75 animate-bounce" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mt-2">ตารางสรุปการทำงาน Presale (Final)</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            ตารางส่วนนี้คือรายงานผลลัพธ์ที่จะถูก <span className="text-emerald-600 font-bold">Import (นำเข้าความถูกต้อง)</span> มาโดยตรงจากตารางหลักด้านบน หลังจากผ่านการคำนวณด้วยสูตรคณิตศาสตร์ปรับยอดเรียบร้อยแล้ว
          </p>
          <p className="text-slate-400 text-[11px] bg-slate-50 border border-slate-100 p-2 rounded-md mt-1 leading-relaxed">
             กรุณากดปุ่ม <span className="font-bold text-[#ba191a] underline">"บันทึกการทำงาน Presale"</span> ในตารางคำนวณด้านบนเพื่อยืนยันเพื่อนำเข้าตารางสรุปนี้
          </p>
        </div>
      </div>
    );
  }

  // Totals calculations
  const totalMulti = finalizedProducts.reduce((sum, p) => sum + p.multiQty, 0);
  const totalPlus = finalizedProducts.reduce((sum, p) => sum + p.plusQty, 0);
  const totalOverride = finalizedProducts.reduce((sum, p) => sum + p.overrideQty, 0);
  const totalPrice = finalizedProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md text-sm overflow-hidden flex flex-col transition-all duration-300 transform border-l-[6px] border-l-emerald-500">
      
      {/* Table Banner Header in Green celebrating finalization */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-white border-b border-rose-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1 px-2.5 bg-emerald-600 text-white rounded font-bold text-[11px] uppercase tracking-wide flex items-center gap-1 shadow-inner">
            <Check className="w-3.5 h-3.5" />
            <span>FINALIZED</span>
          </div>
          <h2 className="font-extrabold text-[#ba191a] text-base uppercase tracking-tight">
            ตารางสรุปการทำงาน Presale (Final)
          </h2>
        </div>
        <div className="text-[11px] text-slate-400 font-medium font-mono">
          บันทึกรายงานสรุปเมื่อ: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Info banner confirming data lineage and read-only lock */}
      <div className="mx-4 mt-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg flex items-start gap-2.5 text-emerald-900 text-xs shadow-sm">
        <AlertCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-emerald-800">🔒 ล็อคความถูกต้องของสูตร (Read-Only):</span> ข้อมูลในตารางสรุปนี้ถูกนำเข้ามาโดยตรงจากการคำนวณสูตรของตารางด้านบนหลังจากที่คุณกดบันทึก Presale ไม่สามารถแยกแก้ไขด้วยตนเองเพื่อรักษาความแม่นยำของสูตรคำนวณหลัก
        </div>
      </div>

      {/* Main Table Layout */}
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-55 select-none text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">
              <th className="p-3 w-10 text-center">
                <CheckSquare className="w-4.5 h-4.5 text-emerald-500 mx-auto" />
              </th>
              <th className="p-3 whitespace-nowrap">ITEM CODE</th>
              <th className="p-3 whitespace-nowrap w-2/5">ITEM NAME</th>
              <th className="p-3 text-right whitespace-nowrap">MULTI_QTY</th>
              <th className="p-3 text-right whitespace-nowrap">PLUS_QTY</th>
              <th className="p-3 text-right whitespace-nowrap">OVERRIDE_QTY</th>
              <th className="p-3 text-right whitespace-nowrap">PRICEAMT (THB)</th>
              <th className="p-3 text-center whitespace-nowrap">DEL_DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 text-xs font-semibold">
            {finalizedProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400 font-bold bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <AlertCircle className="w-5 h-5 text-slate-350" />
                    <span>ไม่พบสินค้าที่ตรงตามประเภทสินค้าหรือตัวเลือกที่เลือกใน Sidebar</span>
                    <span className="text-[10px] font-normal text-slate-400">กรุณาปรับตัวเลือกหรือคลิกประเภทหลักกล่องขวาเพื่อรับรายงานสรุป</span>
                  </div>
                </td>
              </tr>
            ) : (
              finalizedProducts.map(p => {
                const isPriceNegative = p.price < 0;
                return (
                  <tr key={p.id} className="hover:bg-emerald-50/15 transition-colors">
                    <td className="p-3 text-center">
                      <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                    </td>
                    <td className="p-3 font-mono text-slate-500 tracking-tight whitespace-nowrap">{p.code}</td>
                    <td className="p-3 truncate max-w-xs font-bold text-slate-800" title={p.name}>
                      {p.name}
                      <span className="text-[9px] text-slate-400 font-normal ml-2 bg-slate-100 px-1.5 py-0.5 rounded-full">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-600 text-xs">{p.multiQty.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-slate-600 text-xs">{p.plusQty.toLocaleString()}</td>
                    <td className={`p-3 text-right font-mono text-xs font-bold ${
                      p.overrideQty < 0 ? 'text-rose-600' : p.overrideQty > 0 ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {p.overrideQty > 0 ? `+${p.overrideQty}` : p.overrideQty.toLocaleString()}
                    </td>
                    <td className={`p-3 text-right font-mono text-xs font-bold ${
                      isPriceNegative ? 'text-rose-600' : p.price > 0 ? 'text-emerald-500' : 'text-slate-500'
                    }`}>
                      {p.price.toLocaleString()}
                    </td>
                    <td className="p-3 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">{p.delDate}</td>
                  </tr>
                );
              })
            )}
          </tbody>
          
          {/* Table Footer Totals Row */}
          {finalizedProducts.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-emerald-50/30 font-bold text-slate-800 text-xs uppercase">
                <td className="p-3.5"></td>
                <td className="p-3.5 text-center text-emerald-800 font-extrabold">TOTAL</td>
                <td className="p-3.5 text-slate-400 text-[10px] font-normal">ยืนยันและล็อคผลลัพธ์คำนวณแล้ว</td>
                <td className="p-3.5 text-right font-mono text-xs font-bold text-slate-800">{totalMulti.toLocaleString()}</td>
                <td className="p-3.5 text-right font-mono text-xs font-bold text-slate-800">{totalPlus.toLocaleString()}</td>
                <td className={`p-3.5 text-right font-mono text-xs font-extrabold ${totalOverride < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {totalOverride > 0 ? `+${totalOverride}` : totalOverride.toLocaleString()}
                </td>
                <td className={`p-3.5 text-right font-mono text-sm font-black ${totalPrice < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {totalPrice.toLocaleString()}
                </td>
                <td className="p-3.5"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
