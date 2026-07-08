/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Check, CheckSquare, Layers, AlertCircle, Download, FileSpreadsheet, X, AlertTriangle, ArrowUpDown, Users, Search } from 'lucide-react';
import { Product } from '../types';
import * as XLSX from 'xlsx';
import MultiSelectFilter from './MultiSelectFilter';

export const DEMO_MULTI_USER_PRODUCTS: Product[] = [
  {
    id: "demo-1",
    code: "0101",
    name: "ขนมปังขาวแถวเล็ก",
    category: "ขนมปังแถว",
    multiQty: 0,
    plusQty: 10,
    overrideQty: 10,
    unitPrice: 30,
    price: 300,
    delDate: "02/07/2026",
    selected: true,
    addedBy: "สมเกียรติ (Staff 1)",
    addedAt: "02/07/2026 09:15"
  },
  {
    id: "demo-2",
    code: "0101",
    name: "ขนมปังขาวแถวเล็ก",
    category: "ขนมปังแถว",
    multiQty: 0,
    plusQty: 15,
    overrideQty: 15,
    unitPrice: 30,
    price: 450,
    delDate: "02/07/2026",
    selected: true,
    addedBy: "วิจิตร (Manager)",
    addedAt: "02/07/2026 10:20"
  },
  {
    id: "demo-3",
    code: "0101",
    name: "ขนมปังขาวแถวเล็ก",
    category: "ขนมปังแถว",
    multiQty: 0,
    plusQty: 20,
    overrideQty: 20,
    unitPrice: 30,
    price: 600,
    delDate: "02/07/2026",
    selected: true,
    addedBy: "รสริน (Staff 2)",
    addedAt: "02/07/2026 10:45"
  },
  {
    id: "demo-4",
    code: "0103",
    name: "ขนมปังขาวแถวใหญ่",
    category: "ขนมปังแถว",
    multiQty: 0,
    plusQty: 8,
    overrideQty: 8,
    unitPrice: 50,
    price: 400,
    delDate: "02/07/2026",
    selected: true,
    addedBy: "วิจิตร (Manager)",
    addedAt: "02/07/2026 10:22"
  },
  {
    id: "demo-5",
    code: "0103",
    name: "ขนมปังขาวแถวใหญ่",
    category: "ขนมปังแถว",
    multiQty: 0,
    plusQty: 12,
    overrideQty: 12,
    unitPrice: 50,
    price: 600,
    delDate: "02/07/2026",
    selected: true,
    addedBy: "รสริน (Staff 2)",
    addedAt: "02/07/2026 10:46"
  },
  {
    id: "demo-6",
    code: "0202",
    name: "เดลี่แซนด์วิชทูน่า",
    category: "แซนด์วิช",
    multiQty: 0,
    plusQty: 30,
    overrideQty: 30,
    unitPrice: 25,
    price: 750,
    delDate: "02/07/2026",
    selected: true,
    addedBy: "สมเกียรติ (Staff 1)",
    addedAt: "02/07/2026 09:18"
  }
];

interface FinalSummaryTableProps {
  finalizedProducts: Product[] | null;
  isFormulaApproved: boolean;
  onApproveFormula: (approved: boolean) => void;
  currentUser: any;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  users?: any[];
  onLoadDemoProducts?: (products: Product[]) => void;
}

export default function FinalSummaryTable({ 
  finalizedProducts,
  isFormulaApproved,
  onApproveFormula,
  currentUser,
  triggerConfirm,
  users = [],
  onLoadDemoProducts
}: FinalSummaryTableProps) {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [pendingType, setPendingType] = useState<'csv' | 'xlsx' | null>(null);
  const [sortField, setSortField] = useState<keyof Product | null>('code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [popoverAnchor, setPopoverAnchor] = useState<{ x: number, y: number, code: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    const handleScroll = () => {
      setPopoverAnchor(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (!finalizedProducts) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-10 text-center shadow-sm">
        <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
          <div className="p-3 bg-red-50 text-[#ba191a] rounded-full">
            <Layers className="w-8 h-8 opacity-75 animate-bounce" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mt-2">ตารางสรุปการทำงาน Presale (Final)</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            ตารางส่วนนี้คือรายงานผลลัพธ์ที่จะถูก <span className="text-emerald-600 font-bold">Import (นำเข้าความถูกต้อง)</span> มาโดยตรงจากตารางหลักด้านบน หลังจากผ่านการคำนวณด้วยสูตรคณิตศาสตร์ปรับยอดเรียบร้อยแล้ว
          </p>
          <p className="text-slate-400 text-[11px] bg-slate-50 border border-slate-100 p-2 rounded-md leading-relaxed">
             กรุณากดปุ่ม <span className="font-bold text-[#ba191a] underline">"บันทึกและยืนยัน"</span> ในตารางคำนวณด้านบนเพื่อนำเข้าตารางสรุปนี้
          </p>

          {onLoadDemoProducts && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-left shadow-sm">
              <div className="flex items-center gap-2 text-indigo-800 font-black text-xs mb-1">
                <Users className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span>🧪 ต้องการทดสอบระบบรวมยอดบันทึกร่วมกัน 2-3 คน?</span>
              </div>
              <p className="text-slate-500 font-bold text-[11px] leading-relaxed mb-3">
                ระบบนี้รองรับเมื่อพนักงานหลายคนบันทึกสินค้าชนิดเดียวกันเข้ามา โดยตารางจะรวมยอดโดยอัตโนมัติ และแสดงรายชื่อผู้นำเข้าครบทุกคนอย่างชาญฉลาด
              </p>
              <button
                type="button"
                onClick={() => {
                  // Filter users who have permission to do presale (levels 1, 2, 3)
                  const eligibleMakers = (users || []).filter(u => u.level !== 4);
                  
                  // Pick up to 3 users from our added users who have permission
                  const m1 = eligibleMakers[0] 
                    ? `${eligibleMakers[0].username} (${eligibleMakers[0].roleName})` 
                    : "สมเกียรติ (Staff 1)";
                  const m2 = eligibleMakers[1] 
                    ? `${eligibleMakers[1].username} (${eligibleMakers[1].roleName})` 
                    : (eligibleMakers[0] ? `${eligibleMakers[0].username} (${eligibleMakers[0].roleName})` : "วิจิตร (Manager)");
                  const m3 = eligibleMakers[2] 
                    ? `${eligibleMakers[2].username} (${eligibleMakers[2].roleName})` 
                    : (eligibleMakers[1] ? `${eligibleMakers[1].username} (${eligibleMakers[1].roleName})` : (eligibleMakers[0] ? `${eligibleMakers[0].username} (${eligibleMakers[0].roleName})` : "รสริน (Staff 2)"));

                  const getUsernameOnly = (fullName: string) => fullName.split(' (')[0];

                  const dynamicDemoProducts = DEMO_MULTI_USER_PRODUCTS.map(p => {
                    let addedBy = p.addedBy;
                    if (p.addedBy?.includes("สมเกียรติ")) {
                      addedBy = m1;
                    } else if (p.addedBy?.includes("วิจิตร")) {
                      addedBy = m2;
                    } else if (p.addedBy?.includes("รสริน")) {
                      addedBy = m3;
                    }
                    return {
                      ...p,
                      addedBy
                    };
                  });

                  triggerConfirm(
                    "โหลดข้อมูลจำลอง 3 ผู้ใช้",
                    `คุณต้องการโหลดข้อมูลจำลองเพื่อสาธิตการรวมยอดพนักงาน 3 คน (${getUsernameOnly(m1)}, ${getUsernameOnly(m2)}, ${getUsernameOnly(m3)}) บันทึกยอดสินค้าเดียวกันหรือไม่?`,
                    () => onLoadDemoProducts(dynamicDemoProducts)
                  );
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-lg shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
              >
                📥 คลิกเพื่อโหลดข้อมูลจำลองพนักงาน 3 คนร่วมกัน
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }


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

  // Group products by code so that identical products are consolidated
  const groupedProducts = (() => {
    if (!finalizedProducts) return [];
    const map = new Map<string, Product & { _allUsers?: string[] }>();
    finalizedProducts.forEach(p => {
      if (map.has(p.code)) {
        const existing = map.get(p.code)!;
        
        // Find which is the latest edit based on addedAt (latest timestamp string)
        const isCurrentLater = p.addedAt && existing.addedAt 
          ? p.addedAt > existing.addedAt 
          : !!p.addedAt;

        const latestP = isCurrentLater ? p : existing;

        // Keep all unique users list for tooltip hover
        const existingUsers = existing._allUsers || (existing.addedBy ? existing.addedBy.split(', ').map(u => u.trim()) : []);
        const newUsers = p.addedBy ? p.addedBy.split(', ').map(u => u.trim()) : [];
        const uniqueUsers = Array.from(new Set([...existingUsers, ...newUsers])).filter(Boolean);

        const mergedMulti = existing.multiQty + p.multiQty;
        const mergedPlus = existing.plusQty + p.plusQty;
        // OVERRIDE_QTY = MULTI_QTY + PLUS_QTY (multiQty represents subtraction)
        const mergedOverride = mergedPlus - mergedMulti;
        const mergedPrice = mergedOverride * existing.unitPrice;

        map.set(p.code, {
          ...existing,
          multiQty: mergedMulti,
          plusQty: mergedPlus,
          overrideQty: mergedOverride,
          price: mergedPrice,
          addedBy: latestP.addedBy, // USER = ชื่อ USER ที่ทำการแก้ไขล่าสุด
          addedAt: latestP.addedAt, // TIME = คือเวลาที่แก้ไขล่าสุด
          delDate: latestP.delDate, // DEL_DATE = วันที่ต้องการจะเพิ่มล่าสุด
          _allUsers: uniqueUsers
        });
      } else {
        map.set(p.code, { 
          ...p,
          _allUsers: p.addedBy ? p.addedBy.split(', ').map(u => u.trim()) : []
        });
      }
    });
    return Array.from(map.values()) as (Product & { _allUsers?: string[] })[];
  })();

  const sortedProducts = [...groupedProducts].sort((a, b) => {
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

  // Dynamic filter options based on consolidated list (groupedProducts)
  const codeOptions = Array.from(new Set(groupedProducts.map(p => p.code || ''))).filter(Boolean).sort();
  const nameOptions = Array.from(new Set(groupedProducts.map(p => p.name || ''))).filter(Boolean).sort();
  const multiOptions = Array.from(new Set(groupedProducts.map(p => p.multiQty))).sort((a, b) => a - b);
  const plusOptions = Array.from(new Set(groupedProducts.map(p => p.plusQty))).sort((a, b) => a - b);
  const overrideOptions = Array.from(new Set(groupedProducts.map(p => p.overrideQty))).sort((a, b) => a - b);
  const priceOptions = Array.from(new Set(groupedProducts.map(p => p.price))).sort((a, b) => a - b);
  const delDateOptions = Array.from(new Set(groupedProducts.map(p => p.delDate || ''))).filter(Boolean).sort();
  const userOptions = Array.from(new Set(groupedProducts.map(p => p.addedBy || 'ระบบ'))).sort();
  const timeOptions = Array.from(new Set(groupedProducts.map(p => p.addedAt || `${p.delDate} 08:30`))).sort();

  // Dynamic counts for each option based on consolidated list (groupedProducts)
  const codeCounts = groupedProducts.reduce((acc, p) => {
    const val = p.code || '';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const nameCounts = groupedProducts.reduce((acc, p) => {
    const val = p.name || '';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const multiCounts = groupedProducts.reduce((acc, p) => {
    const val = p.multiQty;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const plusCounts = groupedProducts.reduce((acc, p) => {
    const val = p.plusQty;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const overrideCounts = groupedProducts.reduce((acc, p) => {
    const val = p.overrideQty;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const priceCounts = groupedProducts.reduce((acc, p) => {
    const val = p.price;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const delDateCounts = groupedProducts.reduce((acc, p) => {
    const val = p.delDate || '';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const userCounts = groupedProducts.reduce((acc, p) => {
    const val = p.addedBy || 'ระบบ';
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  const timeCounts = groupedProducts.reduce((acc, p) => {
    const val = p.addedAt || `${p.delDate} 08:30`;
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string | number, number>);

  // Filter products based on search term and multi-select column filters
  const sortedAndFilteredProducts = sortedProducts.filter(p => {
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
  });

  // Totals calculations based on consolidated products
  const totalMulti = sortedAndFilteredProducts.reduce((sum, p) => sum + p.multiQty, 0);
  const totalPlus = sortedAndFilteredProducts.reduce((sum, p) => sum + p.plusQty, 0);
  const totalOverride = sortedAndFilteredProducts.reduce((sum, p) => sum + p.overrideQty, 0);
  const totalPrice = sortedAndFilteredProducts.reduce((sum, p) => sum + p.price, 0);

  // Export utility for branch processing
  const handleExportData = (type: 'csv' | 'xlsx') => {
    if (!groupedProducts || groupedProducts.length === 0) return;

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `Presale_Final_Report_Branch_${dateStr}`;

    if (type === 'xlsx') {
      try {
        // Map products into flat sheet representation
        const rawSheetData = groupedProducts.map((p, idx) => ({
          'ลำดับ (No.)': idx + 1,
          'รหัสสินค้า (ITEM CODE)': p.code,
          'ชื่อสินค้า (ITEM NAME)': p.name,
          'ประเภทสินค้า (CATEGORY)': p.category,
          'ยอดตัวคูณ (MULTI_QTY)': p.multiQty,
          'ยอดบวกเพิ่ม (PLUS_QTY)': p.plusQty,
          'ยอดปรับปรุงสุทธิ (OVERRIDE_QTY)': p.overrideQty,
          'มูลค่ารวมสุทธิ (PRICEAMT THB)': p.price,
          'วันส่งมอบ (DELIVERY DATE)': p.delDate,
          'ผู้บันทึก (USER)': p.addedBy || '-',
          'เวลาบันทึก (TIME)': getTimeOnly(p.addedAt),
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
        'USER',
        'TIME',
        'STATUS'
      ];
      
      const rows = groupedProducts.map((p, idx) => [
        idx + 1,
        `="${p.code}"`, // Force Excel string import prefix to prevent numeric sci-notations
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category.replace(/"/g, '""')}"`,
        p.multiQty,
        p.plusQty,
        p.overrideQty,
        p.price,
        `="${p.delDate}"`,
        `"${(p.addedBy || '-').replace(/"/g, '""')}"`,
        `"${getTimeOnly(p.addedAt)}"`,
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
    <div className="bg-white border border-slate-200 rounded-lg shadow-md text-sm overflow-hidden flex flex-col transition-all duration-300 transform border-l-[6px] border-l-emerald-500 relative">
      
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
          {/* Real-time search */}
          <div className="relative w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ค้นหาข้อมูลในตาราง (ค้นหาได้ทุกช่อง)..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded focus:border-emerald-500 focus:outline-emerald-500/10 text-xs focus:ring-1 focus:ring-emerald-500"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {anyFilterActive && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs font-black cursor-pointer transition-colors active:scale-95 flex items-center gap-1"
            >
              <span>ล้างการกรอง</span>
            </button>
          )}
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
            <tr className="border-b border-slate-200 bg-slate-55 select-none text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-50 z-20">
              <th 
                onClick={() => handleSort('code')}
                className="p-3 whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
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
                className="p-3 whitespace-nowrap w-2/5 cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
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
                className="p-3 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
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
                className="p-3 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
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
                className="p-3 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
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
                className="p-3 text-right whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>PRICEAMT (THB)</span>
                  <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                    sortField === 'price' ? 'text-[#ba191a] opacity-100' : 'text-slate-300 opacity-40 group-hover:opacity-100'
                  }`} />
                </div>
              </th>
              <th 
                onClick={() => handleSort('addedBy')}
                className="p-3 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
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
                className="p-3 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
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
                className="p-3 text-center whitespace-nowrap cursor-pointer hover:bg-slate-100 transition-colors group select-none sticky top-0 bg-slate-50 z-20"
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
            <tr className="bg-slate-50 border-b border-slate-200 sticky top-[40px] z-20 shadow-sm">
              {/* 1. Item Code */}
              <th className="px-2 py-1.5 align-middle sticky top-[40px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="รหัส"
                  options={codeOptions}
                  selected={selectedCodes}
                  onChange={setSelectedCodes}
                  isOpen={openDropdownId === 'final_code'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'final_code' ? null : 'final_code')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={codeCounts}
                  placeholder="รหัส"
                  dropdownWidth="w-56"
                />
              </th>
              {/* 2. Item Name */}
              <th className="px-2 py-1.5 align-middle sticky top-[40px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="สินค้า"
                  options={nameOptions}
                  selected={selectedNames}
                  onChange={setSelectedNames}
                  isOpen={openDropdownId === 'final_name'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'final_name' ? null : 'final_name')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={nameCounts}
                  placeholder="ชื่อสินค้า"
                  dropdownWidth="w-64"
                />
              </th>
              {/* 3. Multi Qty */}
              <th className="px-2 py-1.5 align-middle sticky top-[40px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="ลบ"
                  options={multiOptions}
                  selected={selectedMultis}
                  onChange={setSelectedMultis}
                  isOpen={openDropdownId === 'final_multi'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'final_multi' ? null : 'final_multi')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={multiCounts}
                  renderLabel={(val) => val !== 0 ? `-${val.toLocaleString()}` : '0'}
                  placeholder="ลบ"
                  dropdownWidth="w-44"
                />
              </th>
              {/* 4. Plus Qty */}
              <th className="px-2 py-1.5 align-middle sticky top-[40px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="บวก"
                  options={plusOptions}
                  selected={selectedPluses}
                  onChange={setSelectedPluses}
                  isOpen={openDropdownId === 'final_plus'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'final_plus' ? null : 'final_plus')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={plusCounts}
                  renderLabel={(val) => val !== 0 ? `+${val.toLocaleString()}` : '0'}
                  placeholder="บวก"
                  dropdownWidth="w-44"
                />
              </th>
              {/* 5. Override Qty */}
              <th className="px-2 py-1.5 align-middle sticky top-[40px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="สุทธิ"
                  options={overrideOptions}
                  selected={selectedOverrides}
                  onChange={setSelectedOverrides}
                  isOpen={openDropdownId === 'final_override'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'final_override' ? null : 'final_override')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={overrideCounts}
                  renderLabel={(val) => val > 0 ? `+${val.toLocaleString()}` : val.toLocaleString()}
                  placeholder="สุทธิ"
                  dropdownWidth="w-44"
                />
              </th>
              {/* 6. Price */}
              <th className="px-2 py-1.5 align-middle sticky top-[40px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="มูลค่า"
                  options={priceOptions}
                  selected={selectedPrices}
                  onChange={setSelectedPrices}
                  isOpen={openDropdownId === 'final_price'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'final_price' ? null : 'final_price')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={priceCounts}
                  renderLabel={(val) => `${val.toLocaleString()} ฿`}
                  placeholder="มูลค่า"
                  dropdownWidth="w-44"
                />
              </th>
              {/* 7. User */}
              <th className="px-2 py-1.5 align-middle sticky top-[40px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="ผู้ใช้"
                  options={userOptions}
                  selected={selectedUsers}
                  onChange={setSelectedUsers}
                  isOpen={openDropdownId === 'final_user'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'final_user' ? null : 'final_user')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={userCounts}
                  placeholder="ผู้ใช้"
                  dropdownWidth="w-56"
                />
              </th>
              {/* 8. Del Date */}
              <th className="px-2 py-1.5 align-middle sticky top-[40px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="วันที่"
                  options={delDateOptions}
                  selected={selectedDelDates}
                  onChange={setSelectedDelDates}
                  isOpen={openDropdownId === 'final_del_date'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'final_del_date' ? null : 'final_del_date')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={delDateCounts}
                  placeholder="วันที่"
                  dropdownWidth="w-56"
                />
              </th>
              {/* 9. Time */}
              <th className="px-2 py-1.5 align-middle sticky top-[40px] bg-slate-50 z-20 shadow-sm">
                <MultiSelectFilter
                  title="เวลา"
                  options={timeOptions}
                  selected={selectedTimes}
                  onChange={setSelectedTimes}
                  isOpen={openDropdownId === 'final_time'}
                  onToggle={() => setOpenDropdownId(openDropdownId === 'final_time' ? null : 'final_time')}
                  onClose={() => setOpenDropdownId(null)}
                  optionCounts={timeCounts}
                  placeholder="เวลา"
                  dropdownWidth="w-56"
                />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 text-xs font-semibold">
            {sortedAndFilteredProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-10 text-center text-slate-400 font-bold bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <AlertCircle className="w-5 h-5 text-slate-350" />
                    <span>ไม่พบสินค้าที่ตรงตามเงื่อนไขหรือคำค้นหา</span>
                    <span className="text-[10px] font-normal text-slate-400">กรุณาปรับตัวเลือกหรือคำค้นหาเพื่อรับรายงานสรุป</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedAndFilteredProducts.map(p => {
                const isPriceNegative = p.price < 0;
                // Get all raw records matching this code to see individual inputs
                const rawRecords = finalizedProducts.filter(r => r.code === p.code);
                const hasMultipleUsers = rawRecords.length > 1;

                return (
                  <tr 
                    key={p.code} 
                    className="hover:bg-emerald-50/15 transition-colors border-b border-slate-100"
                  >
                    <td className="p-3 font-mono text-slate-500 tracking-tight whitespace-nowrap">
                      <span>{p.code}</span>
                    </td>
                    <td className="p-3 truncate max-w-xs font-bold text-slate-800" title={p.name}>
                      <div className="flex items-center gap-2">
                        <span className="truncate">{p.name}</span>
                        <span className="text-[9px] text-slate-400 font-normal shrink-0 bg-slate-100 px-1.5 py-0.5 rounded-full">
                          {p.category}
                        </span>
                        {hasMultipleUsers && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (popoverAnchor && popoverAnchor.code === p.code) {
                                setPopoverAnchor(null);
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setPopoverAnchor({
                                  x: rect.right + 12,
                                  y: rect.top + rect.height / 2,
                                  code: p.code
                                });
                              }
                            }}
                            className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-black px-2 py-0.5 rounded-md shrink-0 flex items-center gap-0.5 cursor-pointer select-none active:scale-95 transition-all outline-none shadow-sm"
                          >
                            <Users className="w-3 h-3 text-rose-600" />
                            <span>รวม {rawRecords.length} คน</span>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono text-rose-600 text-xs font-semibold">
                      {p.multiQty > 0 ? `-${p.multiQty.toLocaleString()}` : '0'}
                    </td>
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
                    <td className="p-3 text-center whitespace-nowrap">
                      {p.addedBy ? (
                        <div className="flex flex-col items-center gap-0.5 select-none">
                          {p.addedBy.split(', ').map((user, uIdx) => {
                            const dept = getUserDeptInfo(user);
                            return (
                              <span key={uIdx} className={`text-[11px] font-black ${dept.textColor}`}>
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
              })
            )}
          </tbody>
          
          {/* Table Footer Totals Row */}
          {groupedProducts.length > 0 && (
            <tfoot className="sticky bottom-0 z-10 bg-slate-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-800 text-xs uppercase">
                <td className="p-3.5 text-center text-emerald-800 font-extrabold">TOTAL</td>
                <td className="p-3.5 text-slate-400 text-[10px] font-normal">ยืนยันและล็อคผลลัพธ์คำนวณแล้ว (รวมกลุ่มสินค้าเดียวกัน)</td>
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

      {popoverAnchor && (
        <>
          {/* Backdrop overlay to close when clicking outside */}
          <div 
            className="fixed inset-0 z-40 bg-transparent cursor-default" 
            onClick={() => setPopoverAnchor(null)}
          />

          {/* Floating Popover on the absolute top-most layer (fixed, z-50) */}
          <div 
            className="fixed bg-white text-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-xs border border-red-500 font-normal w-[420px] animate-scale-up"
            style={{
              left: `${popoverAnchor.x}px`,
              top: `${popoverAnchor.y}px`,
              transform: 'translateY(-50%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const activeProduct = sortedProducts.find(prod => prod.code === popoverAnchor.code);
              const activeRawRecords = activeProduct && finalizedProducts ? finalizedProducts.filter(r => r.code === activeProduct.code) : [];
              return (
                <>
                  <div className="font-extrabold text-red-700 border-b border-rose-100 pb-2.5 mb-3 flex items-center justify-between">
                    <span className="text-sm">รายชื่อผู้บันทึก & ยอดที่ทำ</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded font-bold">
                        รวม {activeRawRecords.length} คน
                      </span>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopoverAnchor(null);
                        }}
                        className="p-1 hover:bg-rose-50 rounded text-rose-500 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Table Layout */}
                  <div className="max-h-60 overflow-y-auto no-scrollbar border border-rose-100 rounded-xl">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-rose-50/70 text-rose-800 border-b border-rose-100 font-bold sticky top-0 z-10">
                          <th className="p-2 text-left font-black">ผู้บันทึก / เวลา</th>
                          <th className="p-2 text-right font-black">ลบ (Multi)</th>
                          <th className="p-2 text-right font-black">บวก (Plus)</th>
                          <th className="p-2 text-right font-black">สุทธิ(ชิ้น)</th>
                          <th className="p-2 text-right font-black">บาท</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeRawRecords.map((r, rIdx) => (
                          <tr key={r.id || rIdx} className="border-b border-slate-100 last:border-b-0 hover:bg-rose-50/20 transition-colors">
                            <td className="p-2 align-middle">
                              <div className="font-bold flex items-center gap-1 select-none">
                                <span className={getUserDeptInfo(r.addedBy || '').textColor}>{r.addedBy || 'ไม่ระบุชื่อ'}</span>
                                <span className="text-[9.5px] text-slate-400 font-medium">({getUserDeptInfo(r.addedBy || '').name})</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono pl-4">
                                {getTimeOnly(r.addedAt)}
                              </div>
                            </td>
                            <td className="p-2 text-right text-rose-600 font-bold font-mono align-middle">
                              {r.multiQty !== 0 ? `-${r.multiQty.toLocaleString()}` : '0'}
                            </td>
                            <td className="p-2 text-right text-emerald-600 font-bold font-mono align-middle">
                              {r.plusQty !== 0 ? `+${r.plusQty.toLocaleString()}` : '0'}
                            </td>
                            <td className={`p-2 text-right font-bold font-mono align-middle ${r.overrideQty < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {r.overrideQty > 0 ? `+${r.overrideQty.toLocaleString()}` : r.overrideQty.toLocaleString()}
                            </td>
                            <td className={`p-2 text-right font-bold font-mono align-middle ${r.price < 0 ? 'text-rose-600' : r.price > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                              {r.price.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Left pointing arrow on the left center of the popover */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-red-500"></div>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-[-1.5px] border-[5px] border-transparent border-r-white"></div>
                </>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}
