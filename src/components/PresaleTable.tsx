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
import * as XLSX from 'xlsx';
import MultiSelectFilter from './MultiSelectFilter';

interface PresaleTableProps {
  products: Product[];
  onToggleProduct: (id: string) => void;
  onToggleAllProducts: (checked: boolean, ids?: string[]) => void;
  onDeleteSelected: () => void;
  onUpdatePlusQtyDirectly: (id: string, newQty: number) => void;
  onSavePresale: () => void;
  onImportBaseProducts: (imported: Partial<Product>[]) => void;
  onResetAllData: () => void;
  users?: any[];
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
  users = [],
  readOnly = false
}: PresaleTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Product | null>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [notification, setNotification] = useState<string | null>(null);

  // Multi-select column filters states
  const [selectedCodes, setSelectedCodes] = useState<(string | number)[]>([]);
  const [selectedNames, setSelectedNames] = useState<(string | number)[]>([]);
  const [selectedMultis, setSelectedMultis] = useState<(string | number)[]>([]);
  const [selectedPluses, setSelectedPluses] = useState<(string | number)[]>([]);
  const [selectedOverrides, setSelectedOverrides] = useState<(string | number)[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<(string | number)[]>([]);
  const [selectedDelDates, setSelectedDelDates] = useState<(string | number)[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<(string | number)[]>([]);

  // State for active dropdown popover ID
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Clear all filters handler
  const handleClearAllFilters = () => {
    setSelectedCodes([]);
    setSelectedNames([]);
    setSelectedMultis([]);
    setSelectedPluses([]);
    setSelectedOverrides([]);
    setSelectedPrices([]);
    setSelectedDelDates([]);
    setSelectedUsers([]);
    setSelectedTimes([]);
  };

  const anyFilterActive = 
    selectedCodes.length > 0 ||
    selectedNames.length > 0 ||
    selectedMultis.length > 0 ||
    selectedPluses.length > 0 ||
    selectedOverrides.length > 0 ||
    selectedPrices.length > 0 ||
    selectedDelDates.length > 0 ||
    selectedUsers.length > 0 ||
    selectedTimes.length > 0;

  // Dynamic filter options based on full list (products)
  const codeOptions = Array.from(new Set(products.map(p => p.code || ''))).filter(Boolean).sort();
  const nameOptions = Array.from(new Set(products.map(p => p.name || ''))).filter(Boolean).sort();
  const multiOptions = Array.from(new Set(products.map(p => p.multiQty))).sort((a, b) => a - b);
  const plusOptions = Array.from(new Set(products.map(p => p.plusQty))).sort((a, b) => a - b);
  const overrideOptions = Array.from(new Set(products.map(p => p.overrideQty))).sort((a, b) => a - b);
  const priceOptions = Array.from(new Set(products.map(p => p.price))).sort((a, b) => a - b);
  const delDateOptions = Array.from(new Set(products.map(p => p.delDate || ''))).filter(Boolean).sort();
  const userOptions = Array.from(new Set(products.map(p => p.addedBy || 'ระบบ'))).sort();
  const timeOptions = Array.from(new Set(products.map(p => p.addedAt || `${p.delDate} 08:30`))).sort();

  // Dynamic counts for each option based on full list (products)
  const codeCounts = products.reduce((acc, p) => {
    const val = p.code || '';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const nameCounts = products.reduce((acc, p) => {
    const val = p.name || '';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const multiCounts = products.reduce((acc, p) => {
    const val = p.multiQty;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const plusCounts = products.reduce((acc, p) => {
    const val = p.plusQty;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const overrideCounts = products.reduce((acc, p) => {
    const val = p.overrideQty;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const priceCounts = products.reduce((acc, p) => {
    const val = p.price;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const delDateCounts = products.reduce((acc, p) => {
    const val = p.delDate || '';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const userCounts = products.reduce((acc, p) => {
    const val = p.addedBy || 'ระบบ';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const timeCounts = products.reduce((acc, p) => {
    const val = p.addedAt || `${p.delDate} 08:30`;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const getUserDeptInfo = (username: string) => {
    const cleanUsername = username.split(' (')[0].trim();
    const userObj = users?.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
    const deptName = userObj?.department || '';

    if (deptName) {
      const uDept = deptName.toUpperCase();
      if (uDept === 'IT') return { name: 'IT', textColor: 'text-blue-600' };
      if (uDept === 'SALE') return { name: 'SALE', textColor: 'text-amber-600' };
      if (uDept === 'MARKETING') return { name: 'MARKETING', textColor: 'text-purple-600' };
      if (uDept === 'อื่นๆ' || uDept === 'OTHER' || uDept === 'OTHERS') return { name: 'อื่นๆ', textColor: 'text-emerald-600' };
    }

    const lower = cleanUsername.toLowerCase();
    if (lower === 'admin' || lower.includes('admin')) {
      return { name: 'IT', textColor: 'text-blue-600' };
    }
    if (lower.startsWith('s') || lower.includes('สมเกียรติ') || lower.includes('staff 1') || lower.includes('staff 2') || lower.includes('รสริน')) {
      return { name: 'SALE', textColor: 'text-amber-600' };
    }
    if (lower.startsWith('m') || lower.includes('วิจิตร') || lower.includes('manager')) {
      return { name: 'MARKETING', textColor: 'text-purple-600' };
    }
    return { name: 'อื่นๆ', textColor: 'text-emerald-600' };
  };

  // Sorting handler
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter products based on search term and multi-select filters
  const sortedAndFiltered = [...products]
    .filter(p => {
      // 1. Text Search Query
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const code = (p.code || '').toLowerCase();
        const name = (p.name || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const multiQty = p.multiQty !== undefined ? String(p.multiQty) : '';
        const plusQty = p.plusQty !== undefined ? String(p.plusQty) : '';
        const overrideQty = p.overrideQty !== undefined ? String(p.overrideQty) : '';
        const price = p.price !== undefined ? String(p.price) : '';
        const delDate = (p.delDate || '').toLowerCase();
        const addedBy = (p.addedBy || '').toLowerCase();
        const addedAt = (p.addedAt || '').toLowerCase();
        
        const matchesQuery = (
          code.includes(q) ||
          name.includes(q) ||
          category.includes(q) ||
          multiQty.includes(q) ||
          plusQty.includes(q) ||
          overrideQty.includes(q) ||
          price.includes(q) ||
          delDate.includes(q) ||
          addedBy.includes(q) ||
          addedAt.includes(q)
        );
        if (!matchesQuery) return false;
      }

      // 2. Multi-select column filters
      if (selectedCodes.length > 0 && !selectedCodes.includes(p.code || '')) return false;
      if (selectedNames.length > 0 && !selectedNames.includes(p.name || '')) return false;
      if (selectedMultis.length > 0 && !selectedMultis.includes(p.multiQty)) return false;
      if (selectedPluses.length > 0 && !selectedPluses.includes(p.plusQty)) return false;
      if (selectedOverrides.length > 0 && !selectedOverrides.includes(p.overrideQty)) return false;
      if (selectedPrices.length > 0 && !selectedPrices.includes(p.price)) return false;
      if (selectedDelDates.length > 0 && !selectedDelDates.includes(p.delDate || '')) return false;
      
      const pUser = p.addedBy || 'ระบบ';
      if (selectedUsers.length > 0 && !selectedUsers.includes(pUser)) return false;

      const pTime = p.addedAt || `${p.delDate} 08:30`;
      if (selectedTimes.length > 0 && !selectedTimes.includes(pTime)) return false;

      return true;
    })
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

  // Export to Excel / CSV with proper UTF-8 BOM encoding for complete Excel compatibility
  const handleExportExcel = () => {
    if (sortedAndFiltered.length === 0) {
      showNotification("ไม่มีข้อมูลในการส่งออก!");
      return;
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `presale_summary_${dateStr}`;

    try {
      // 1. Map products into flat sheet representation
      const rawSheetData = sortedAndFiltered.map((p, idx) => ({
        'ลำดับ (No.)': idx + 1,
        'รหัสสินค้า (ITEM CODE)': p.code,
        'ชื่อสินค้า (ITEM NAME)': p.name,
        'ยอดตัวคูณ (MULTI_QTY)': p.multiQty,
        'ยอดบวกเพิ่ม (PLUS_QTY)': p.plusQty,
        'ยอดปรับปรุงสุทธิ (OVERRIDE_QTY)': p.overrideQty,
        'มูลค่า (PRICE THB)': p.price,
        'ผู้บันทึก (USER)': p.addedBy || 'ระบบ',
        'เวลาบันทึก (TIME)': p.addedAt ? new Date(p.addedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-',
        'วันส่งมอบ (DEL_DATE)': p.delDate
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
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Presale Summary');
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      showNotification("ส่งออกไฟล์ Excel (.xlsx) สำเร็จ!");
    } catch (err) {
      console.error('Failed to export Excel, falling back to CSV format:', err);
      // Fallback CSV Export with BOM character for Excel Thai language compatibility (UTF-8)
      const headers = [
        'No.',
        'ITEM CODE',
        'ITEM NAME',
        'MULTI_QTY',
        'PLUS_QTY',
        'OVERRIDE_QTY',
        'PRICE',
        'ADDED_BY',
        'ADDED_TIME',
        'DEL_DATE'
      ];
      
      const rows = sortedAndFiltered.map((p, idx) => [
        idx + 1,
        `="${p.code}"`, // Force Excel string import prefix to prevent numeric sci-notation/stripping
        `"${p.name.replace(/"/g, '""')}"`,
        p.multiQty,
        p.plusQty,
        p.overrideQty,
        p.price,
        `="${p.addedBy || 'ระบบ'}"`,
        `="${p.addedAt ? new Date(p.addedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : '-'}"`,
        `="${p.delDate}"`
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
      showNotification("ส่งออกไฟล์ สำเร็จ! (รูปแบบสำรอง .csv)");
    }
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
              placeholder="ค้นหาข้อมูลในตาราง (ค้นหาได้ทุกช่อง)..."
              className="w-full pl-9 pr-3 py-1.8 bg-white border border-slate-200 rounded focus:border-red-500 focus:outline-[#ba191a]/10 text-xs focus:ring-1 focus:ring-red-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

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
            title="ส่งออกรายงาน Excel (.xlsx)"
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
            <tr className="border-b border-slate-200 bg-slate-50 select-none text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-20">
              <th className="p-3.5 w-10 text-center sticky top-0 bg-slate-50 z-20">
                <input
                  type="checkbox"
                  disabled={readOnly}
                  className={`rounded border-slate-300 text-red-600 h-3.5 w-3.5 ${
                    readOnly ? 'cursor-not-allowed opacity-50' : 'focus:ring-red-500 cursor-pointer'
                  }`}
                  checked={isAllChecked}
                  onChange={e => onToggleAllProducts(e.target.checked, sortedAndFiltered.map(p => p.id))}
                />
              </th>
              <th 
                onClick={() => handleSort('code')}
                className="p-3.5 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center gap-1">
                  <span>ITEM CODE</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'code' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('name')}
                className="p-3.5 whitespace-nowrap w-2/5 cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center gap-1">
                  <span>ITEM NAME</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'name' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('multiQty')}
                className="p-3.5 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>MULTI_QTY</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'multiQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('plusQty')}
                className="p-3.5 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PLUS_QTY</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'plusQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('overrideQty')}
                className="p-3.5 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>OVERRIDE_QTY</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'overrideQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('price')}
                className="p-3.5 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PRICE_AMT (THB)</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'price' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('addedBy')}
                className="p-3.5 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>USER</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'addedBy' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('delDate')}
                className="p-3.5 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>DEL_DATE</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'delDate' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('addedAt')}
                className="p-3.5 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>TIME</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'addedAt' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
            </tr>
            {/* Column Filters Row */}
            <tr className="bg-slate-50 border-b border-slate-200 sticky top-[44px] z-20 shadow-sm">
              <th className="px-2 py-1.5 align-middle text-center sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                {anyFilterActive && (
                  <button
                    type="button"
                    onClick={handleClearAllFilters}
                    className="p-1 px-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[10px] rounded border border-red-200 transition-colors cursor-pointer select-none active:scale-95 flex items-center justify-center mx-auto"
                    title="ล้างการกรองทั้งหมด"
                  >
                    ล้าง
                  </button>
                )}
              </th>
              {/* 1. Item Code */}
              <th className="px-2 py-1.5 align-middle sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="รหัส"
                  options={codeOptions}
                  selected={selectedCodes}
                  onChange={setSelectedCodes}
                  isOpen={openDropdownId === 'presale_code'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'presale_code' ? null : 'presale_code')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={codeCounts}
                  placeholder="รหัส"
                  dropdownWidth="w-56"
                />
              </th>
              {/* 2. Item Name */}
              <th className="px-2 py-1.5 align-middle sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="สินค้า"
                  options={nameOptions}
                  selected={selectedNames}
                  onChange={setSelectedNames}
                  isOpen={openDropdownId === 'presale_name'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'presale_name' ? null : 'presale_name')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={nameCounts}
                  placeholder="ชื่อสินค้า"
                  dropdownWidth="w-64"
                />
              </th>
              {/* 3. Multi Qty */}
              <th className="px-2 py-1.5 align-middle sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="ลบ"
                  options={multiOptions}
                  selected={selectedMultis}
                  onChange={setSelectedMultis}
                  isOpen={openDropdownId === 'presale_multi'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'presale_multi' ? null : 'presale_multi')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={multiCounts}
                  renderLabel={(val) => val !== 0 ? `-${val.toLocaleString()}` : '0'}
                  placeholder="ลบ"
                  dropdownWidth="w-44"
                />
              </th>
              {/* 4. Plus Qty */}
              <th className="px-2 py-1.5 align-middle sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="บวก"
                  options={plusOptions}
                  selected={selectedPluses}
                  onChange={setSelectedPluses}
                  isOpen={openDropdownId === 'presale_plus'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'presale_plus' ? null : 'presale_plus')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={plusCounts}
                  renderLabel={(val) => val !== 0 ? `+${val.toLocaleString()}` : '0'}
                  placeholder="บวก"
                  dropdownWidth="w-44"
                />
              </th>
              {/* 5. Override Qty */}
              <th className="px-2 py-1.5 align-middle sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="สุทธิ"
                  options={overrideOptions}
                  selected={selectedOverrides}
                  onChange={setSelectedOverrides}
                  isOpen={openDropdownId === 'presale_override'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'presale_override' ? null : 'presale_override')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={overrideCounts}
                  renderLabel={(val) => val > 0 ? `+${val.toLocaleString()}` : val.toLocaleString()}
                  placeholder="สุทธิ"
                  dropdownWidth="w-44"
                />
              </th>
              {/* 6. Price */}
              <th className="px-2 py-1.5 align-middle sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="มูลค่า"
                  options={priceOptions}
                  selected={selectedPrices}
                  onChange={setSelectedPrices}
                  isOpen={openDropdownId === 'presale_price'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'presale_price' ? null : 'presale_price')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={priceCounts}
                  renderLabel={(val) => `${val.toLocaleString()} ฿`}
                  placeholder="มูลค่า"
                  dropdownWidth="w-44"
                />
              </th>
              {/* 7. User */}
              <th className="px-2 py-1.5 align-middle sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="ผู้ใช้"
                  options={userOptions}
                  selected={selectedUsers}
                  onChange={setSelectedUsers}
                  isOpen={openDropdownId === 'presale_user'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'presale_user' ? null : 'presale_user')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={userCounts}
                  placeholder="ผู้ใช้"
                  dropdownWidth="w-56"
                />
              </th>
              {/* 8. Del Date */}
              <th className="px-2 py-1.5 align-middle sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="วันที่"
                  options={delDateOptions}
                  selected={selectedDelDates}
                  onChange={setSelectedDelDates}
                  isOpen={openDropdownId === 'presale_del_date'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'presale_del_date' ? null : 'presale_del_date')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={delDateCounts}
                  placeholder="วันที่"
                  dropdownWidth="w-56"
                />
              </th>
              {/* 9. Time */}
              <th className="px-2 py-1.5 align-middle sticky top-[44px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="เวลา"
                  options={timeOptions}
                  selected={selectedTimes}
                  onChange={setSelectedTimes}
                  isOpen={openDropdownId === 'presale_time'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'presale_time' ? null : 'presale_time')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={timeCounts}
                  placeholder="เวลา"
                  dropdownWidth="w-56"
                />
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
                      <td className="p-3 text-center whitespace-nowrap">
                        {p.addedBy ? (
                          <div className="flex flex-col items-center gap-0.5 select-none">
                            {p.addedBy.split(', ').map((user, uIdx) => {
                              const dept = getUserDeptInfo(user);
                              return (
                                <span key={uIdx} className={`text-xs font-black ${dept.textColor}`}>
                                  {user}
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-bold">-</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono text-[11px] text-slate-400 whitespace-nowrap">{p.delDate}</td>
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
