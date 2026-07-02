/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Search, 
  Trash2, 
  ArrowUpDown, 
  ListFilter, 
  Download, 
  Printer, 
  Check, 
  FileSpreadsheet,
  AlertCircle,
  Upload,
  RotateCcw
} from 'lucide-react';
import { Product } from '../types';

interface PresaleTableProps {
  products: Product[];
  onToggleProduct: (id: string) => void;
  onToggleAllProducts: (checked: boolean) => void;
  onDeleteSelected: () => void;
  onUpdatePlusQtyDirectly: (id: string, newQty: number) => void;
  onSavePresale: () => void;
  onImportBaseProducts: (imported: Partial<Product>[]) => void;
  onResetAllData: () => void;
  readOnly?: boolean;
}

export default function PresaleTable({
  products,
  onToggleProduct,
  onToggleAllProducts,
  onDeleteSelected,
  onUpdatePlusQtyDirectly,
  onSavePresale,
  onImportBaseProducts,
  onResetAllData,
  readOnly = false
}: PresaleTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Product | null>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [notification, setNotification] = useState<string | null>(null);

  // Sorting handler
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter products based on search term
  const sortedAndFiltered = [...products]
    .filter(p => 
      p.code.includes(searchQuery) || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'addedBy') {
        valA = valA || '';
        valB = valB || '';
      } else if (sortField === 'addedAt') {
        valA = valA || `${a.delDate} 08:30`;
        valB = valB || `${b.delDate} 08:30`;
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

  // Check if all filtered products are selected
  const isAllChecked = sortedAndFiltered.length > 0 && sortedAndFiltered.every(p => p.selected);

  // Totals calculations
  const totalMulti = sortedAndFiltered.reduce((sum, p) => sum + p.multiQty, 0);
  const totalPlus = sortedAndFiltered.reduce((sum, p) => sum + p.plusQty, 0);
  const totalOverride = sortedAndFiltered.reduce((sum, p) => sum + p.overrideQty, 0);
  const totalPrice = sortedAndFiltered.reduce((sum, p) => sum + p.price, 0);

  // Simulated export to Excel
  const handleExportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ITEM_CODE,ITEM_NAME,MULTI_QTY,PLUS_QTY,OVERRIDE_QTY,PRICE,ADDED_BY,ADDED_TIME,DEL_DATE", 
         ...sortedAndFiltered.map(p => `${p.code},${p.name},${p.multiQty},${p.plusQty},${p.overrideQty},${p.price},${p.addedBy || 'ระบบ'},${p.addedAt || `${p.delDate} 08:30`},${p.delDate}`)
        ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `presale_summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification("ส่งออกไฟล์ Excel สำเร็จ!");
  };

  // Simulated Print handler
  const handlePrint = () => {
    window.print();
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const triggerSave = () => {
    onSavePresale();
    showNotification("บันทึกข้อมูลปรับยอด Presale สำเร็จ!");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm text-sm overflow-hidden flex flex-col">
      
      {/* Table Action Header Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
        <h2 className="font-extrabold text-[#ba191a] text-base uppercase self-center tracking-tight flex items-center gap-2">
          ตารางสรุปการทำงานPresale
          <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full font-bold">
            {sortedAndFiltered.length} รายการ
          </span>
        </h2>

        {/* Toolbar triggers */}
        <div className="flex flex-wrap items-center gap-2 self-end sm:self-auto">
          {/* Real-time search */}
          <div className="relative w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาตามรหัส/ชื่อสินค้า..."
              className="w-full pl-9 pr-3 py-1.8 bg-white border border-slate-200 rounded focus:border-red-500 focus:outline-[#ba191a]/10 text-xs focus:ring-1 focus:ring-red-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Reset All Data button */}
          <button
            disabled={readOnly}
            onClick={onResetAllData}
            className={`px-3 py-1.8 border text-xs font-bold flex items-center gap-1.5 transition-all ${
              readOnly 
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed shadow-none'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800 rounded active:scale-[0.98] cursor-pointer'
            }`}
            title="รีเซ็ตข้อมูลสินค้าเพื่อดึงตารางกลับคืนมา"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Reset</span>
          </button>

          {/* Delete Selection button */}
          <button
            onClick={onDeleteSelected}
            disabled={!products.some(p => p.selected) || readOnly}
            className={`px-3 py-1.8 border border-slate-200 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
              products.some(p => p.selected) && !readOnly
                ? 'bg-red-50 text-red-700 hover:bg-red-100/80 cursor-pointer active:scale-[0.98]'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>





          {/* Excel export */}
          <button
            onClick={handleExportExcel}
            className="p-1.8 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded text-emerald-700 font-bold transition-all hover:scale-105"
            title="ส่งออก Excel (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>



          {/* Print button */}
          <button
            onClick={handlePrint}
            className="p-1.8 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-slate-600 hover:text-slate-900 transition-colors"
            title="สั่งพิมพ์แผนงาน"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embedded confirmation notification banner inside workspace */}
      {notification && (
        <div className="bg-emerald-55 text-white py-2.5 px-4 font-bold text-xs flex items-center justify-between shadow-inner animate-fade-in bg-emerald-600">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </span>
          <button onClick={() => setNotification(null)} className="text-emerald-200 hover:text-white font-black text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Main Table Layout */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 select-none text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  disabled={readOnly}
                  className={`rounded border-slate-300 text-red-600 h-3.5 w-3.5 ${
                    readOnly ? 'cursor-not-allowed opacity-50' : 'focus:ring-red-500 cursor-pointer'
                  }`}
                  checked={isAllChecked}
                  onChange={e => onToggleAllProducts(e.target.checked)}
                />
              </th>
              <th 
                onClick={() => handleSort('code')}
                className="p-3.5 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              >
                <div className="flex items-center gap-1">
                  <span>ITEM CODE</span>
                  <ArrowUpDown className={`w-3 h-3 transition-opacity ${
                    sortField === 'code' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('name')}
                className="p-3.5 whitespace-nowrap w-2/5 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              >
                <div className="flex items-center gap-1">
                  <span>ITEM NAME</span>
                  <ArrowUpDown className={`w-3 h-3 transition-opacity ${
                    sortField === 'name' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('multiQty')}
                className="p-3.5 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>MULTI_QTY</span>
                  <ArrowUpDown className={`w-3 h-3 transition-opacity ${
                    sortField === 'multiQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('plusQty')}
                className="p-3.5 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PLUS_QTY</span>
                  <ArrowUpDown className={`w-3 h-3 transition-opacity ${
                    sortField === 'plusQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('overrideQty')}
                className="p-3.5 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>OVERRIDE_QTY</span>
                  <ArrowUpDown className={`w-3 h-3 transition-opacity ${
                    sortField === 'overrideQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('price')}
                className="p-3.5 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PRICE_AMT (THB)</span>
                  <ArrowUpDown className={`w-3 h-3 transition-opacity ${
                    sortField === 'price' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('delDate')}
                className="p-3.5 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>DEL_DATE</span>
                  <ArrowUpDown className={`w-3 h-3 transition-opacity ${
                    sortField === 'delDate' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('addedBy')}
                className="p-3.5 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>USER</span>
                  <ArrowUpDown className={`w-3 h-3 transition-opacity ${
                    sortField === 'addedBy' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('addedAt')}
                className="p-3.5 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>TIME</span>
                  <ArrowUpDown className={`w-3 h-3 transition-opacity ${
                    sortField === 'addedAt' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
            {sortedAndFiltered.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-10 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-300" />
                    <span>ไม่พบสินค้าที่ตรงตามเงื่อนไขการกรองของคุณ</span>
                    <button
                       onClick={onResetAllData}
                      className="mt-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded shadow hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>รีเซ็ตข้อมูลสินค้าเพื่อดึงตารางกลับคืนมา</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              (() => {
                // Helper to extract only the time "HH:mm" from datetime "DD/MM/YYYY HH:mm" or default to "08:30"
                const getTimeOnly = (dateTimeStr?: string) => {
                  if (!dateTimeStr) return '08:30';
                  const parts = dateTimeStr.trim().split(' ');
                  if (parts.length > 1) {
                    return parts[1];
                  }
                  if (dateTimeStr.includes(':')) {
                    return dateTimeStr;
                  }
                  return '08:30';
                };

                return sortedAndFiltered.map(p => {
                  const isPriceNegative = p.price < 0;
                  return (
                    <tr 
                      key={p.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${
                        p.selected ? 'bg-red-50/15' : ''
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          disabled={readOnly}
                          className={`rounded border-slate-300 text-red-600 h-3.5 w-3.5 ${
                            readOnly ? 'cursor-not-allowed opacity-50' : 'focus:ring-red-500 cursor-pointer'
                          }`}
                          checked={p.selected}
                          onChange={() => onToggleProduct(p.id)}
                        />
                      </td>
                      <td className="p-3 font-mono text-slate-500 tracking-tight whitespace-nowrap">{p.code}</td>
                      <td className="p-3 truncate max-w-xs block font-bold text-slate-800" title={p.name}>
                        {p.name}
                        <span className="text-[9px] text-slate-400 font-normal ml-2 bg-slate-100 px-1.5 py-0.5 rounded-full">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-rose-600 text-xs font-semibold">
                        {p.multiQty > 0 ? `-${p.multiQty.toLocaleString()}` : '0'}
                      </td>
                      <td className="p-3 text-right font-mono text-slate-700 text-xs font-semibold">
                        {p.plusQty.toLocaleString()}
                      </td>
                      <td className={`p-3 text-right font-mono text-xs font-bold ${
                        p.overrideQty < 0 ? 'text-rose-600' : p.overrideQty > 0 ? 'text-emerald-600' : 'text-slate-500'
                      }`}>
                        {p.overrideQty > 0 ? `+${p.overrideQty}` : p.overrideQty.toLocaleString()}
                      </td>
                      <td className={`p-3 text-right font-mono text-xs font-bold ${
                        isPriceNegative ? 'text-rose-600' : p.price > 0 ? 'text-emerald-600' : 'text-slate-500'
                      }`}>
                        {p.price.toLocaleString()}
                      </td>
                      <td className="p-3 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">{p.delDate}</td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {p.addedBy ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {p.addedBy}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-bold">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {getTimeOnly(p.addedAt)}
                      </td>
                    </tr>
                  );
                });
              })()
            )}
          </tbody>
          
          {/* Table Footer Totals Row */}
          {sortedAndFiltered.length > 0 && (
            <tfoot className="sticky bottom-0 z-10 bg-slate-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs uppercase">
                <td className="p-3.5"></td>
                <td className="p-3.5 text-center">TOTAL</td>
                <td className="p-3.5 text-slate-400 text-[10px] font-normal">คำนวณจากรายการที่กรองผ่าน</td>
                <td className="p-3.5 text-right font-mono text-xs font-bold text-rose-600">
                  {totalMulti > 0 ? `-${totalMulti.toLocaleString()}` : '0'}
                </td>
                <td className="p-3.5 text-right font-mono text-xs font-bold text-slate-800">{totalPlus.toLocaleString()}</td>
                <td className={`p-3.5 text-right font-mono text-xs font-extrabold ${totalOverride < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {totalOverride > 0 ? `+${totalOverride}` : totalOverride.toLocaleString()}
                </td>
                <td className={`p-3.5 text-right font-mono text-sm font-black ${totalPrice < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {totalPrice.toLocaleString()}
                </td>
                <td className="p-3.5"></td>
                <td className="p-3.5"></td>
                <td className="p-3.5"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Save action button */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
        <button
          onClick={triggerSave}
          disabled={sortedAndFiltered.length === 0 || readOnly}
          className={`px-24 py-3 rounded-full font-bold text-base shadow-md transition-all uppercase tracking-wide ${
            sortedAndFiltered.length === 0 || readOnly
              ? 'bg-slate-300 text-slate-200 cursor-not-allowed shadow-none'
              : 'bg-[#ba191a] hover:bg-[#a01516] text-white hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
          }`}
        >
          {readOnly ? '🔒 บันทึกและยืนยัน (โหมดรับชมรายงาน)' : 'บันทึกและยืนยัน'}
        </button>
      </div>
    </div>
  );
}
