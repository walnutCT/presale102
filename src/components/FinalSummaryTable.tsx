/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Check, CheckSquare, Layers, AlertCircle, Download, FileSpreadsheet, X, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import * as XLSX from 'xlsx';

interface FinalSummaryTableProps {
  finalizedProducts: Product[] | null;
  isFormulaApproved: boolean;
  onApproveFormula: (approved: boolean) => void;
  currentUser: any;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function FinalSummaryTable({ 
  finalizedProducts,
  isFormulaApproved,
  onApproveFormula,
  currentUser,
  triggerConfirm
}: FinalSummaryTableProps) {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [pendingType, setPendingType] = useState<'csv' | 'xlsx' | null>(null);

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
             กรุณากดปุ่ม <span className="font-bold text-[#ba191a] underline">"บันทึกและยืนยัน"</span> ในตารางคำนวณด้านบนเพื่อนำเข้าตารางสรุปนี้
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

  // Export utility for branch processing
  const handleExportData = (type: 'csv' | 'xlsx') => {
    if (!finalizedProducts || finalizedProducts.length === 0) return;

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `Presale_Final_Report_Branch_${dateStr}`;

    if (type === 'xlsx') {
      try {
        // Map products into flat sheet representation
        const rawSheetData = finalizedProducts.map((p, idx) => ({
          'ลำดับ (No.)': idx + 1,
          'รหัสสินค้า (ITEM CODE)': p.code,
          'ชื่อสินค้า (ITEM NAME)': p.name,
          'ประเภทสินค้า (CATEGORY)': p.category,
          'ยอดตัวคูณ (MULTI_QTY)': p.multiQty,
          'ยอดบวกเพิ่ม (PLUS_QTY)': p.plusQty,
          'ยอดปรับปรุงสุทธิ (OVERRIDE_QTY)': p.overrideQty,
          'มูลค่ารวมสุทธิ (PRICEAMT THB)': p.price,
          'วันส่งมอบ (DELIVERY DATE)': p.delDate,
          'สถานะการตรวจสอบ': 'ตรวจสอบแล้ว (CONFIRMED)'
        }));

        const worksheet = XLSX.utils.json_to_sheet(rawSheetData);
        
        // Force column string type for Item Code to avoid Excel truncating leading zeros
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
        for (let r = range.s.r + 1; r <= range.e.r; ++r) {
          const cellAddress = XLSX.utils.encode_cell({ r, c: 1 }); // Column index 1 is ITEM CODE
          const cell = worksheet[cellAddress];
          if (cell) {
            cell.t = 's'; // Force string type
            cell.v = String(cell.v);
          }
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Branch Summary');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      } catch (err) {
        console.error('Failed to export Excel, falling back to CSV format:', err);
        handleExportData('csv');
      }
    } else {
      // CSV Export with BOM character for Excel Thai language compatibility (UTF-8)
      const headers = [
        'No.',
        'ITEM CODE',
        'ITEM NAME',
        'CATEGORY',
        'MULTI_QTY',
        'PLUS_QTY',
        'OVERRIDE_QTY',
        'PRICEAMT (THB)',
        'DELIVERY DATE',
        'STATUS'
      ];
      
      const rows = finalizedProducts.map((p, idx) => [
        idx + 1,
        `="${p.code}"`, // Force Excel string import prefix to prevent numeric sci-notations
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category.replace(/"/g, '""')}"`,
        p.multiQty,
        p.plusQty,
        p.overrideQty,
        p.price,
        `="${p.delDate}"`,
        'CONFIRMED'
      ]);

      const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-md text-sm overflow-hidden flex flex-col transition-all duration-300 transform border-l-[6px] border-l-emerald-500">
      
      {/* Table Banner Header in Green celebrating finalization */}
      <div className="p-4 bg-gradient-to-r from-emerald-50 to-white border-b border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1 px-2.5 bg-emerald-600 text-white rounded font-bold text-[11px] uppercase tracking-wide flex items-center gap-1 shadow-inner">
            <Check className="w-3.5 h-3.5" />
            <span>FINALIZED</span>
          </div>
          <h2 className="font-extrabold text-[#ba191a] text-base uppercase tracking-tight">
            ตารางสรุปการทำงาน Presale (Final)
          </h2>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${isFormulaApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-150 text-amber-800'}`}>
            {isFormulaApproved ? 'อนุมัติสูตรแล้ว (Approved)' : 'รออนุมัติ (Pending Approval)'}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-[11px] text-slate-400 font-medium font-mono mr-1 hidden lg:block">
            บันทึกรายงานสรุปเมื่อ: {new Date().toLocaleTimeString()}
          </div>
          {currentUser && currentUser.level <= 3 && (
            <button
              id="btn-final-summary-confirm-csv"
              onClick={() => {
                triggerConfirm(
                  "ดาวน์โหลดรายงานสรุป (CSV)",
                  "คุณต้องการจัดทำและดาวน์โหลดไฟล์รายงานสรุปขั้นสุดท้ายในรูปแบบ CSV ใช่หรือไม่?",
                  () => {
                    handleExportData('csv');
                  }
                );
              }}
              className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-250 active:scale-[0.98] text-slate-700 text-[12px] font-black rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>ส่งออก CSV</span>
            </button>
          )}
        </div>
      </div>

      {/* INTEGRATED ACTION BAR: COMBINED FORMULA APPROVAL & SUMMARY REPORT CONFIRM */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${isFormulaApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-amber-50 text-amber-800 border border-amber-150'}`}>
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 text-xs md:text-sm">สถานะการอนุมัติสูตรสำหรับวันนี้</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${isFormulaApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-850'}`}>
                {isFormulaApproved ? 'อนุมัติแล้ว (Approved)' : 'รอการอนุมัติ (Pending)'}
              </span>
            </div>
            <p className="text-slate-500 font-bold text-[11px] mt-0.5">
              {isFormulaApproved 
                ? '✓ ผ่านการรับรองความถูกต้องเรียบร้อยแล้ว แผนงานพร้อมจัดส่งเพื่อไปรันงานต่อที่สาขา' 
                : '⌛ รอหัวหน้างานระดับ Manager (Level 2) ตรวจสอบความถูกต้องและกดอนุมัติสูตรเพื่อส่งไปรันต่อที่สาขา'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action to toggle approval if Level <= 2 */}
          {currentUser && currentUser.level <= 2 ? (
            <button
              type="button"
              onClick={() => {
                if (isFormulaApproved) {
                  triggerConfirm(
                    "ยกเลิกการอนุมัติสูตร",
                    "คุณต้องการยกเลิกสถานะการอนุมัติสูตรวันนี้ใช่หรือไม่?",
                    () => onApproveFormula(false)
                  );
                } else {
                  setShowApproveConfirm(true);
                }
              }}
              className={`px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border ${
                isFormulaApproved 
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
              }`}
            >
              <span>{isFormulaApproved ? '✘ ยกเลิกอนุมัติสูตร' : '✓ คลิกอนุมัติเพื่อรันที่สาขาต่อ'}</span>
            </button>
          ) : null}


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
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto no-scrollbar">
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

      {showApproveConfirm && (
        <div 
          id="confirm-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
        >
          <div 
            id="confirm-modal-box"
            className="bg-white rounded-2xl shadow-2xl border border-emerald-100 max-w-md w-full overflow-hidden animate-scale-up"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-white px-5 py-4 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
                <span className="font-extrabold text-sm md:text-base">ยืนยันอนุมัติสูตรคำนวณและปรับยอด</span>
              </div>
              <button 
                id="btn-confirm-modal-close"
                onClick={() => setShowApproveConfirm(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs md:text-sm text-slate-700 space-y-2.5">
                <div className="font-extrabold text-emerald-800 flex items-center gap-1.5 text-sm">
                  ⚠️ ยืนยันการส่งข้อมูลไปยังสาขา
                </div>
                <p className="leading-relaxed font-bold text-slate-950 text-xs md:text-sm">
                  คุณยืนยันความถูกต้องของสูตรคำนวณและยอดปรับปรุงวันนี้เพื่ออนุมัติสำหรับนำส่งไปรันงานต่อที่แต่ละสาขาใช่หรือไม่? เมื่อทำการอนุมัติแล้ว แต่ละสาขาจะสามารถนำสูตรคำนวณของวันนี้ไปใช้งานได้อย่างเป็นทางการทันที
                </p>
              </div>

              <div className="text-[11.5px] font-bold text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                <span>จำนวนรายการสินค้าทั้งหมด:</span>
                <span className="text-emerald-700 font-black font-mono text-xs">{finalizedProducts?.length || 0} รายการ</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-5 py-4 border-t border-slate-150 flex items-center justify-end gap-2.5">
              <button
                id="btn-confirm-modal-cancel"
                onClick={() => setShowApproveConfirm(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-250 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer"
              >
                ยกเลิก / กลับไปตรวจสอบ
              </button>
              <button
                id="btn-confirm-modal-approve"
                onClick={() => {
                  onApproveFormula(true);
                  setShowApproveConfirm(false);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs md:text-sm font-black transition-all shadow-md cursor-pointer flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>ตกลง, อนุมัติสูตรคำนวณ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
