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
}

export default function PresaleTable({
  products,
  onToggleProduct,
  onToggleAllProducts,
  onDeleteSelected,
  onUpdatePlusQtyDirectly,
  onSavePresale,
  onImportBaseProducts,
  onResetAllData
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
      + ["ITEM_CODE,ITEM_NAME,MULTI_QTY,PLUS_QTY,OVERRIDE_QTY,PRICE,DEL_DATE", 
         ...sortedAndFiltered.map(p => `${p.code},${p.name},${p.multiQty},${p.plusQty},${p.overrideQty},${p.price},${p.delDate}`)
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
            onClick={onResetAllData}
            className="px-3 py-1.8 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded text-xs font-bold flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            title="รีเซ็ตข้อมูลสินค้าเพื่อดึงตารางกลับคืนมา"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            <span>Reset</span>
          </button>

          {/* Delete Selection button */}
          <button
            onClick={onDeleteSelected}
            disabled={!products.some(p => p.selected)}
            className={`px-3 py-1.8 border border-slate-200 rounded text-xs font-bold flex items-center gap-1.5 transition-all ${
              products.some(p => p.selected)
                ? 'bg-red-50 text-red-700 hover:bg-red-100/80 cursor-pointer active:scale-[0.98]'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          {/* Sort trigger utility */}
          <button
            onClick={() => handleSort('code')}
            className="p-1.8 bg-white border border-slate-200 hover:border-slate-300 rounded text-slate-600 hover:text-slate-900 transition-colors"
            title="เรียงตามรหัสสินค้า"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>

          {/* Filter button */}
          <button
            onClick={() => setSearchQuery('')}
            className="p-1.8 bg-white border border-slate-200 hover:border-slate-300 rounded text-slate-600 hover:text-slate-900 transition-colors"
            title="ล้างคำค้นหา"
          >
            <ListFilter className="w-4 h-4" />
          </button>

          {/* Excel export */}
          <button
            onClick={handleExportExcel}
            className="p-1.8 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded text-emerald-700 font-bold transition-all hover:scale-105"
            title="ส่งออก Excel (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>

          {/* Import Base products csv/excel */}
          <div className="relative">
            <button
              onClick={() => document.getElementById('catalog-file-input')?.click()}
              className="p-1.8 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-blue-700 font-black transition-all hover:scale-105 flex items-center justify-center cursor-pointer gap-1"
              title="นำเข้าฐานรหัส/ราคาสินค้าหลักจากไฟล์ Excel/CSV (.csv)"
            >
              <Upload className="w-4 h-4" />
              <span className="text-[10px] hidden md:inline">นำเข้าฐานราคาหลัก</span>
            </button>
            <input
              type="file"
              id="catalog-file-input"
              className="hidden"
              accept=".csv,.xlsx,.xls,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    const lines = text.split("\n");
                    const importedList: Partial<Product>[] = [];
                    lines.forEach((line) => {
                      const parts = line.split(/[;,]/);
                      if (parts.length >= 2) {
                        const code = parts[0].trim().replace(/["']/g, '');
                        const name = parts[1] ? parts[1].trim().replace(/["']/g, '') : '';
                        const bathStr = parts[2] ? parts[2].trim().replace(/["']/g, '') : '';
                        const bath = parseFloat(bathStr);
                        if (code && code.toLowerCase() !== 'item code' && code !== 'ITEM_CODE' && code !== 'ITEM CODE') {
                          importedList.push({
                            code,
                            name: name || undefined,
                            unitPrice: isNaN(bath) ? undefined : bath
                          });
                        }
                      }
                    });
                    if (importedList.length > 0) {
                      onImportBaseProducts(importedList);
                      showNotification(`✓ นำเข้าเสร็จสิ้น! บันทึก/อัปเดตข้อมูลสินค้า ${importedList.length} รายการเรียบร้อย`);
                    } else {
                      showNotification("❌ โครงสร้างไฟล์ไม่ตรง แถวตัวอย่าง: 8850123110108,ชื่อสินค้า,ราคา");
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
          </div>

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
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5 cursor-pointer"
                  checked={isAllChecked}
                  onChange={e => onToggleAllProducts(e.target.checked)}
                />
              </th>
              <th className="p-3.5 whitespace-nowrap">ITEM CODE</th>
              <th className="p-3.5 whitespace-nowrap w-2/5">ITEM NAME</th>
              <th className="p-3.5 text-right whitespace-nowrap">MULTI_QTY</th>
              <th className="p-3.5 text-right whitespace-nowrap">PLUS_QTY</th>
              <th className="p-3.5 text-right whitespace-nowrap">OVERRIDE_QTY</th>
              <th className="p-3.5 text-right whitespace-nowrap">PRICE_AMT (THB)</th>
              <th className="p-3.5 text-center whitespace-nowrap">DEL_DATE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-xs font-medium">
            {sortedAndFiltered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-400">
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
              sortedAndFiltered.map(p => {
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
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-3.5 w-3.5 cursor-pointer"
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
                    <td className="p-3 text-right font-mono text-slate-700 text-xs font-semibold">
                      {p.multiQty.toLocaleString()}
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
                  </tr>
                );
              })
            )}
          </tbody>
          
          {/* Table Footer Totals Row */}
          {sortedAndFiltered.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs uppercase">
                <td className="p-3.5"></td>
                <td className="p-3.5 text-center">TOTAL</td>
                <td className="p-3.5 text-slate-400 text-[10px] font-normal">คำนวณจากรายการที่กรองผ่าน</td>
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

      {/* Save action button */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
        <button
          onClick={triggerSave}
          disabled={sortedAndFiltered.length === 0}
          className={`px-24 py-3 rounded-full font-bold text-base shadow-md transition-all uppercase tracking-wide ${
            sortedAndFiltered.length === 0
              ? 'bg-slate-300 text-slate-200 cursor-not-allowed shadow-none'
              : 'bg-red-600 hover:bg-red-700 text-white hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
          }`}
        >
          บันทึกการทำงาน Presale
        </button>
      </div>
    </div>
  );
}
