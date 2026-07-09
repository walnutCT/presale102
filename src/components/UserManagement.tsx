/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Product } from '../types';
import { Users, Shield, Trash2, Plus, Key, CheckCircle, Info, Search, FileText, BarChart2, Calendar, ArrowUpDown, ChevronDown, Check, X, Filter } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data';
import { getHistoryDatabase, saveToHistoryDatabase } from '../historyData';

interface MultiSelectFilterProps {
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

function MultiSelectFilter({
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

  React.useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => {
    const labelStr = renderLabel ? String(opt) : String(opt);
    // If we have a custom renderLabel, let's convert the rendered element/string to search text safely
    const customLabel = renderLabel ? renderLabel(opt) : null;
    const searchText = typeof customLabel === 'string' 
      ? customLabel 
      : (customLabel && React.isValidElement(customLabel))
      ? String((customLabel.props as any).children || opt)
      : String(opt);

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
    <div className="relative inline-block text-left w-full select-none">
      {/* Dropdown trigger button */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`flex items-center justify-between bg-white hover:bg-slate-50 border ${
          selected.length > 0 ? 'border-rose-500 ring-2 ring-rose-200' : 'border-slate-200'
        } rounded-lg px-2.5 py-1.5 shadow-sm cursor-pointer transition-all gap-1 text-[11px] font-bold text-slate-700 min-h-[32px]`}
      >
        <span className="truncate max-w-[120px] font-bold">
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
              className="p-0.5 rounded-full hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-slate-450 transition-transform duration-200 ${isOpen ? 'rotate-180 text-rose-650' : ''}`} />
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

          <div className={`absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 mt-1.5 ${dropdownWidth} bg-white border border-rose-100 rounded-xl shadow-xl z-[110] py-2.5 flex flex-col gap-2 focus:outline-none animate-in fade-in slide-in-from-top-1 duration-100`}>
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
                    className="text-slate-400 hover:text-rose-600 text-[10.5px] font-black cursor-pointer pl-1"
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
                className="hover:text-rose-650 transition-colors cursor-pointer"
              >
                ✓ เลือกทั้งหมด
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
                className="hover:text-rose-650 transition-colors cursor-pointer"
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
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-rose-50/70 cursor-pointer text-[11px] text-slate-700 font-bold transition-colors select-none"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                        isChecked 
                          ? 'bg-rose-600 border-rose-600 text-white shadow-sm' 
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

interface UserManagementProps {
  users: User[];
  onAddUser: (newUser: User) => void;
  onDeleteUser: (username: string) => void;
  onUpdateUserPass: (username: string, newPass: string) => void;
  onRestoreDefaultUsers: () => void;
  finalizedProducts: Product[] | null;
  onDeleteFinalizedProduct: (rIdx: number) => void;
  onClearAllFinalizedProducts: () => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
  onLoadDemoProducts: (demoProducts: Product[]) => void;
}

export default function UserManagement({
  users,
  onAddUser,
  onDeleteUser,
  onUpdateUserPass,
  onRestoreDefaultUsers,
  finalizedProducts,
  onDeleteFinalizedProduct,
  onClearAllFinalizedProducts,
  triggerConfirm,
  onLoadDemoProducts
}: UserManagementProps) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('1234');
  const [newLevel, setNewLevel] = useState<number>(3); // Default to Staff (Level 3)
  const [newDept, setNewDept] = useState<string>('IT');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editPassValue, setEditPassValue] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // States for Admin Work Summary Panel
  const [summaryTab, setSummaryTab] = useState<'grouped' | 'raw_logs' | 'history'>('grouped');
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'data_summary' | 'history'>('users');

  // States for past calendar history (up to 1 month back)
  const [historyDatabase, setHistoryDatabase] = useState<Record<string, Product[]>>(() => {
    return getHistoryDatabase(users);
  });
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date());
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string>(() => {
    const keys = Object.keys(getHistoryDatabase(users));
    if (keys.length > 0) {
      keys.sort((a,b) => b.localeCompare(a));
      return keys[0];
    }
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const [historySearch, setHistorySearch] = useState('');
  const [historyFilterDept, setHistoryFilterDept] = useState('ALL');
  const [historyFilterUser, setHistoryFilterUser] = useState('ALL');

  // Fine-grained Column Filters
  const [filterUsername, setFilterUsername] = useState('');
  const [filterProductCode, setFilterProductCode] = useState('');
  const [filterProductName, setFilterProductName] = useState('');
  const [filterAddedBy, setFilterAddedBy] = useState('');
  const [filterRawDept, setFilterRawDept] = useState('');
  const [filterRawTime, setFilterRawTime] = useState('');
  const [filterDept, setFilterDept] = useState<string>('ALL');

  // Column-specific filters for Grouped User Performance Summary
  const [groupFilterUser, setGroupFilterUser] = useState('');
  const [groupFilterRole, setGroupFilterRole] = useState('');
  const [groupFilterDept, setGroupFilterDept] = useState('');
  const [groupFilterRecords, setGroupFilterRecords] = useState('');
  const [groupFilterMulti, setGroupFilterMulti] = useState('');
  const [groupFilterPlus, setGroupFilterPlus] = useState('');
  const [groupFilterNet, setGroupFilterNet] = useState('');
  const [groupFilterPrice, setGroupFilterPrice] = useState('');
  const [groupFilterTime, setGroupFilterTime] = useState('');

  // Open dropdown tracker state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Grouped Performance Multi-Select Dropdowns
  const [groupSelUser, setGroupSelUser] = useState<(string | number)[]>([]);
  const [groupSelRole, setGroupSelRole] = useState<(string | number)[]>([]);
  const [groupSelDept, setGroupSelDept] = useState<(string | number)[]>([]);
  const [groupSelRecords, setGroupSelRecords] = useState<(string | number)[]>([]);
  const [groupSelMulti, setGroupSelMulti] = useState<(string | number)[]>([]);
  const [groupSelPlus, setGroupSelPlus] = useState<(string | number)[]>([]);
  const [groupSelNet, setGroupSelNet] = useState<(string | number)[]>([]);
  const [groupSelPrice, setGroupSelPrice] = useState<(string | number)[]>([]);
  const [groupSelTime, setGroupSelTime] = useState<(string | number)[]>([]);

  // Raw Logs Multi-Select Dropdowns
  const [rawSelCode, setRawSelCode] = useState<(string | number)[]>([]);
  const [rawSelName, setRawSelName] = useState<(string | number)[]>([]);
  const [rawSelAddedBy, setRawSelAddedBy] = useState<(string | number)[]>([]);
  const [rawSelDept, setRawSelDept] = useState<(string | number)[]>([]);
  const [rawSelTime, setRawSelTime] = useState<(string | number)[]>([]);
  const [rawSelMulti, setRawSelMulti] = useState<(string | number)[]>([]);
  const [rawSelPlus, setRawSelPlus] = useState<(string | number)[]>([]);
  const [rawSelNet, setRawSelNet] = useState<(string | number)[]>([]);
  const [rawSelPrice, setRawSelPrice] = useState<(string | number)[]>([]);

  // Sorting States
  const [groupedSortField, setGroupedSortField] = useState<string>('username');
  const [groupedSortDirection, setGroupedSortDirection] = useState<'asc' | 'desc'>('asc');
  const [rawSortField, setRawSortField] = useState<string>('code');
  const [rawSortDirection, setRawSortDirection] = useState<'asc' | 'desc'>('asc');

  // History Table Multi-Select States
  const [histSelDept, setHistSelDept] = useState<(string | number)[]>([]);
  const [histSelCode, setHistSelCode] = useState<(string | number)[]>([]);
  const [histSelName, setHistSelName] = useState<(string | number)[]>([]);
  const [histSelMulti, setHistSelMulti] = useState<(string | number)[]>([]);
  const [histSelPlus, setHistSelPlus] = useState<(string | number)[]>([]);
  const [histSelNet, setHistSelNet] = useState<(string | number)[]>([]);
  const [histSelPrice, setHistSelPrice] = useState<(string | number)[]>([]);
  const [histSelAddedBy, setHistSelAddedBy] = useState<(string | number)[]>([]);
  const [histSelTime, setHistSelTime] = useState<(string | number)[]>([]);

  // History Table Sorting States
  const [histSortField, setHistSortField] = useState<string>('code');
  const [histSortDirection, setHistSortDirection] = useState<'asc' | 'desc'>('asc');

  // Role names mapping based on level
  const getRoleInfo = (level: number): { roleName: 'Admin' | 'Manager' | 'Staff' | 'Viewer'; duties: string } => {
    switch (level) {
      case 1:
        return { roleName: 'Admin', duties: 'ดูแลระบบทั้งหมด จัดการ User ทุกคน' };
      case 2:
        return { roleName: 'Manager', duties: 'อนุมัติสูตรเพื่อส่งไปรันงานต่อที่สาขา, คำนวณสูตร, บันทึกยอด' };
      case 3:
        return { roleName: 'Staff', duties: 'คำนวณสูตร, บันทึกยอด' };
      case 4:
      default:
        return { roleName: 'Viewer', duties: 'ดูรายงานอย่างเดียว แก้ไขไม่ได้' };
    }
  };

  const getUserDeptInfo = (username: string) => {
    // Look up in users list if they have an explicit department set
    const userObj = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    const deptName = userObj?.department || '';

    if (deptName) {
      const uDept = deptName.toUpperCase();
      if (uDept === 'IT') {
        return {
          name: 'IT',
          badge: 'bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase',
          bgRow: 'bg-blue-50/20 hover:bg-blue-100/30 text-blue-900 border-b border-blue-100/40 transition-colors',
          badgeColor: 'bg-blue-100 text-blue-800',
          textColor: 'text-blue-600'
        };
      }
      if (uDept === 'SALE') {
        return {
          name: 'SALE',
          badge: 'bg-yellow-100 text-amber-805 border border-yellow-350 px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase',
          bgRow: 'bg-yellow-50/30 hover:bg-yellow-100/40 text-amber-950 border-b border-yellow-150/40 transition-colors',
          badgeColor: 'bg-yellow-100 text-amber-900',
          textColor: 'text-amber-600'
        };
      }
      if (uDept === 'MARKETING') {
        return {
          name: 'MARKETING',
          badge: 'bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase',
          bgRow: 'bg-purple-50/20 hover:bg-purple-100/30 text-purple-900 border-b border-purple-100/40 transition-colors',
          badgeColor: 'bg-purple-100 text-purple-850',
          textColor: 'text-purple-600'
        };
      }
      if (uDept === 'อื่นๆ' || uDept === 'OTHER' || uDept === 'OTHERS') {
        return {
          name: 'อื่นๆ',
          badge: 'bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase',
          bgRow: 'bg-emerald-50/20 hover:bg-emerald-100/30 text-emerald-900 border-b border-emerald-100/40 transition-colors',
          badgeColor: 'bg-emerald-100 text-emerald-800',
          textColor: 'text-emerald-600'
        };
      }
    }

    const lower = username.toLowerCase();
    if (lower === 'admin') {
      return {
        name: 'IT',
        badge: 'bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase',
        bgRow: 'bg-blue-50/20 hover:bg-blue-100/30 text-[#0f4b82] border-b border-blue-100/40 transition-colors',
        badgeColor: 'bg-blue-100 text-blue-800',
        textColor: 'text-blue-600'
      };
    }
    if (lower.startsWith('s')) {
      return {
        name: 'SALE',
        badge: 'bg-yellow-100 text-amber-805 border border-yellow-350 px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase',
        bgRow: 'bg-yellow-50/30 hover:bg-yellow-100/40 text-amber-950 border-b border-yellow-150/40 transition-colors',
        badgeColor: 'bg-yellow-100 text-amber-900',
        textColor: 'text-amber-600'
      };
    }
    if (lower.startsWith('m')) {
      return {
        name: 'MARKETING',
        badge: 'bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase',
        bgRow: 'bg-purple-50/20 hover:bg-purple-100/30 text-purple-900 border-b border-purple-100/40 transition-colors',
        badgeColor: 'bg-purple-100 text-purple-850',
        textColor: 'text-purple-600'
      };
    }
    return {
      name: 'อื่นๆ',
      badge: 'bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase',
      bgRow: 'bg-emerald-50/20 hover:bg-emerald-100/30 text-emerald-900 border-b border-emerald-100/40 transition-colors',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      textColor: 'text-emerald-600'
    };
  };

  const handleLoadRandomMockData = () => {
    let eligibleUsers = users.filter(u => u.level !== 4);
    if (eligibleUsers.length === 0) {
      eligibleUsers = [
        { username: 'M-2', pass: '1234', level: 2, roleName: 'Manager', description: '' },
        { username: 'S-2', pass: '1234', level: 2, roleName: 'Manager', description: '' },
        { username: 'M-3', pass: '1234', level: 3, roleName: 'Staff', description: '' },
        { username: 'S-3', pass: '1234', level: 3, roleName: 'Staff', description: '' },
      ];
    }

    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const todayFormatted = `${dd}/${mm}/${yyyy}`;

    const newLogs: Product[] = [];

    // Let's pick 3-4 random eligible users to simulate multi-user work
    const numUsersToUse = Math.min(eligibleUsers.length, Math.floor(Math.random() * 2) + 3); // 3 to 4 users
    const shuffledUsers = [...eligibleUsers].sort(() => Math.random() - 0.5);
    const usersToGenerate = shuffledUsers.slice(0, numUsersToUse);

    usersToGenerate.forEach((usr, usrIdx) => {
      // Pick 5 to 9 random products from initial products list
      const shuffledProducts = [...INITIAL_PRODUCTS].sort(() => Math.random() - 0.5);
      const numProducts = Math.floor(Math.random() * 5) + 5; // 5 to 9 products
      const selectedProducts = shuffledProducts.slice(0, numProducts);

      selectedProducts.forEach((p, pIdx) => {
        const multiQty = Math.floor(Math.random() * 120) + 15; // random baseline 15 to 135
        const choice = Math.random();
        let plusQty = multiQty;
        
        if (choice < 0.45) {
          // Increase
          plusQty = multiQty + Math.floor(Math.random() * 35) + 5;
        } else if (choice < 0.8) {
          // Decrease
          plusQty = Math.max(0, multiQty - Math.floor(Math.random() * 25) - 5);
        } else if (choice < 0.9) {
          // Reset to 0
          plusQty = 0;
        }

        const overrideQty = plusQty > 0 ? (plusQty - multiQty) : -multiQty;
        const price = overrideQty * p.unitPrice;

        // Generate spaced out times on today's logs to look authentic (e.g., minutes ago)
        const minutesAgo = (usrIdx * 50) + (pIdx * 10) + Math.floor(Math.random() * 10);
        const dLog = new Date(Date.now() - minutesAgo * 60 * 1000);
        const logDD = String(dLog.getDate()).padStart(2, '0');
        const logMM = String(dLog.getMonth() + 1).padStart(2, '0');
        const logYYYY = dLog.getFullYear();
        const logHH = String(dLog.getHours()).padStart(2, '0');
        const logMin = String(dLog.getMinutes()).padStart(2, '0');
        const addedAt = `${logDD}/${logMM}/${logYYYY} ${logHH}:${logMin}`;

        newLogs.push({
          ...p,
          id: `mock-${usr.username}-${p.id}`,
          multiQty,
          plusQty,
          overrideQty,
          price,
          addedBy: usr.username,
          addedAt,
          delDate: todayFormatted,
          selected: true
        });
      });
    });

    onLoadDemoProducts(newLogs);
    setSuccessMsg(`สุ่มสร้างข้อมูลจำลองพรีเซลล์จำนวน ${newLogs.length} รายการ จากผู้ใช้งานที่เลือก ${usersToGenerate.length} คน เรียบร้อยแล้ว!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = newUsername.trim();
    if (!trimmedName) {
      setErrorMsg('กรุณากรอกชื่อผู้ใช้งาน');
      return;
    }

    if (users.some(u => u.username.toLowerCase() === trimmedName.toLowerCase())) {
      setErrorMsg(`ชื่อผู้ใช้ "${trimmedName}" มีอยู่ในระบบแล้ว`);
      return;
    }

    const { roleName, duties } = getRoleInfo(newLevel);
    const newUser: User = {
      username: trimmedName,
      pass: newPassword,
      level: newLevel,
      roleName,
      description: duties,
      department: newDept
    };

    onAddUser(newUser);
    setNewUsername('');
    setNewPassword('1234');
    setSuccessMsg(`✓ เพิ่มผู้ใช้งาน "${trimmedName}" ในระดับสิทธิ์ ${roleName} สำเร็จแล้ว!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const startEditPass = (user: User) => {
    setEditingUser(user.username);
    setEditPassValue(user.pass);
  };

  const handleSavePass = (username: string) => {
    if (!editPassValue.trim()) return;
    onUpdateUserPass(username, editPassValue.trim());
    setEditingUser(null);
    setSuccessMsg(`✓ ปรับปรุงรหัสผ่านของ "${username}" เรียบร้อยแล้ว!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Color mappings for levels matching spreadsheet screenshot
  const getLevelColorClasses = (level: number) => {
    switch (level) {
      case 1: // Admin: Yellow/Orangeish Warm Gold
        return {
          bg: 'bg-[#fff2cc]',
          border: 'border-[#f1c232]',
          text: 'text-[#7f6000]',
          badge: 'bg-[#ffd966] text-[#7f6000]'
        };
      case 2: // Manager: Soft Blue
        return {
          bg: 'bg-[#cfe2f3]',
          border: 'border-[#6fa8dc]',
          text: 'text-[#0b5394]',
          badge: 'bg-[#9fc5e8] text-[#0b5394]'
        };
      case 3: // Staff: Soft Green
        return {
          bg: 'bg-[#d9ead3]',
          border: 'border-[#93c47d]',
          text: 'text-[#274e13]',
          badge: 'bg-[#b6d7a8] text-[#274e13]'
        };
      case 4: // Viewer: Soft Orange/Peach
      default:
        return {
          bg: 'bg-[#fce5cd]',
          border: 'border-[#e06666]',
          text: 'text-[#783f04]',
          badge: 'bg-[#f9cb9c] text-[#783f04]'
        };
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-red-50 rounded-2xl shrink-0">
          <Users className="w-8 h-8 text-[#ba191a]" />
        </div>
        <div>
          <h2 className="text-slate-900 font-black text-lg tracking-tight">ระบบจัดการบัญชีผู้ใช้และกำหนดสิทธิ์</h2>
          <p className="text-slate-500 font-bold text-xs">
            Admin Management Console — จัดการเพิ่ม ลบ บัญชีผู้ใช้งาน และปรับสิทธิ์ตำแหน่งพนักงานประจำวัน
          </p>
        </div>
      </div>

      {/* ALERT BANNERS */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3.5 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Info className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR NAVIGATION PANEL (Span 3) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2 lg:sticky lg:top-6">
          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 pb-2.5 border-b border-slate-100 flex items-center justify-between">
            <span>เมนูผู้ดูแลระบบ (Admin Menu)</span>
            <span className="bg-rose-50 text-[#ba191a] text-[9px] px-1.5 py-0.5 rounded font-black">ระดับ 1</span>
          </div>
          
          <button
            type="button"
            onClick={() => setActiveAdminTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeAdminTab === 'users'
                ? 'bg-rose-50/70 text-[#ba191a] border border-rose-100 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
            }`}
          >
            <Users className="w-5 h-5 text-[#ba191a] shrink-0" />
            <div className="text-left">
              <div className="font-extrabold text-[12px]">จัดการบัญชีและสิทธิ์</div>
              <div className="text-[9.5px] opacity-70 font-bold">เพิ่ม ลบ และกำหนดระดับผู้ใช้งาน</div>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveAdminTab('data_summary')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeAdminTab === 'data_summary'
                ? 'bg-rose-50/70 text-[#ba191a] border border-rose-100 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
            }`}
          >
            <BarChart2 className="w-5 h-5 text-[#ba191a] shrink-0" />
            <div className="text-left">
              <div className="font-extrabold text-[12px]">รายงานและวิเคราะห์ยอด</div>
              <div className="text-[9.5px] opacity-70 font-bold">สรุปยอดสะสม แผนก และข้อมูลดิบ</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab('history')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeAdminTab === 'history'
                ? 'bg-rose-50/70 text-[#ba191a] border border-rose-100 shadow-sm'
                : 'text-slate-650 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
            }`}
          >
            <Calendar className="w-5 h-5 text-[#ba191a] shrink-0" />
            <div className="text-left">
              <div className="font-extrabold text-[12px]">ประวัติและปฏิทินข้อมูล</div>
              <div className="text-[9.5px] opacity-70 font-bold">ตรวจสอบข้อมูลพรีเซลล์ย้อนหลัง</div>
            </div>
          </button>
        </div>

        {/* RIGHT CONTENT DISPLAY WINDOW (Span 9) */}
        <div className="lg:col-span-9 space-y-6">
          
          {activeAdminTab === 'users' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-fade-in">
              
              {/* LEFT COLUMN: ADD USER FORM (Span 5) */}
              <div className="xl:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h3 className="text-[#ba191a] font-black text-sm uppercase tracking-wide flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    เพิ่มผู้ใช้จำลองใหม่ (Add User)
                  </h3>
                </div>

                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                        ชื่อผู้ใช้ (Username)
                      </label>
                      <span className="text-[9px] font-bold text-rose-600/80 bg-rose-50/50 px-1.5 py-0.5 rounded-md">
                        *อักษรแรกแผนก-รหัสพนักงาน (เช่น M-72000)
                      </span>
                    </div>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      placeholder="เช่น M-7200, S-72001"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#ba191a] focus:outline-none text-xs font-bold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                      รหัสผ่าน (Password)
                    </label>
                    <input
                      type="text"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="1234"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#ba191a] focus:outline-none text-xs font-bold text-slate-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                      ระดับสิทธิ์การใช้งาน (Select Level)
                    </label>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[1, 2, 3, 4].map(lvl => {
                        const info = getRoleInfo(lvl);
                        const colors = getLevelColorClasses(lvl);
                        const isSelected = newLevel === lvl;
                        return (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setNewLevel(lvl)}
                            className={`w-full p-2.5 text-left rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              isSelected 
                                ? `${colors.bg} ${colors.border} ${colors.text} ring-2 ring-[#ba191a]/25 scale-[1.01]` 
                                : 'bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-650'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="font-black">ระดับ {lvl} : {info.roleName}</span>
                              <span className="text-[9.5px] opacity-80 font-medium">{info.duties}</span>
                            </div>
                            {isSelected && (
                              <span className="h-2 w-2 rounded-full bg-[#ba191a]"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                      แผนก (Department)
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { key: 'IT', label: 'IT', bg: 'bg-blue-100 border-blue-300 text-blue-850' },
                        { key: 'SALE', label: 'SALE', bg: 'bg-yellow-100 border-yellow-350 text-amber-900' },
                        { key: 'MARKETING', label: 'MARKETING', bg: 'bg-purple-100 border-purple-250 text-purple-850' },
                        { key: 'อื่นๆ', label: 'อื่นๆ', bg: 'bg-emerald-100 border-emerald-300 text-emerald-850' }
                      ].map(dept => {
                        const isSelected = newDept === dept.key;
                        return (
                          <button
                            key={dept.key}
                            type="button"
                            onClick={() => setNewDept(dept.key)}
                            className={`p-2 text-center rounded-xl border text-[11px] font-black cursor-pointer transition-all ${
                              isSelected
                                ? `${dept.bg} ring-2 ring-[#ba191a]/20 scale-[1.02]`
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {dept.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#ba191a] hover:bg-[#a01516] text-white font-black text-xs uppercase rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 shrink-0" />
                    <span>ลงทะเบียนผู้ใช้ใหม่</span>
                  </button>
                </form>
              </div>

              {/* RIGHT COLUMN: USER DIRECTORY & DUTIES MATRIX (Span 7) */}
              <div className="xl:col-span-7 space-y-6">
                
                {/* USER TABLE */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-slate-800 font-black text-sm uppercase tracking-wide flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#ba191a]" />
                      รายชื่อผู้ใช้งานและรหัสผ่านทดลองในระบบ
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                        ทั้งหมด {users.length} บัญชี
                      </span>
                    </div>
                  </div>



                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse table-fixed text-xs font-sans">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[10%] border-r border-slate-200">ลำดับขั้น</th>
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[24%] border-r border-slate-200">User (ชื่อผู้ใช้งาน)</th>
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[18%] border-r border-slate-200">ระดับสิทธิ์</th>
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[14%] border-r border-slate-200">แผนก</th>
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[22%] border-r border-slate-200">PASS (รหัสผ่าน)</th>
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[12%]">การดำเนินงาน</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {users.map((user, idx) => {
                          const colors = getLevelColorClasses(user.level);
                          const deptInfo = getUserDeptInfo(user.username);
                          return (
                            <tr key={user.username} className="hover:bg-slate-50/50 transition-colors">
                              
                              {/* Level with Color */}
                              <td className={`px-4 py-3 text-center border-r border-slate-200 font-black font-mono ${colors.bg} ${colors.text}`}>
                                {user.level}
                              </td>
                              
                              {/* Username Row */}
                              <td className="px-4 py-3 border-r border-slate-200 font-black text-slate-800 text-center">
                                <span className="truncate">{user.username}</span>
                              </td>

                              {/* Permission Level Column without color */}
                              <td className="px-4 py-3 border-r border-slate-200 text-center font-black text-slate-700">
                                {user.roleName}
                              </td>

                              {/* Department Column without circle badge, using department text color */}
                              <td className={`px-4 py-3 border-r border-slate-200 text-center font-black ${deptInfo.textColor || 'text-slate-700'}`}>
                                {deptInfo.name}
                              </td>
                              
                              {/* Password (Editable inline) */}
                              <td className="px-4 py-3 border-r border-slate-200 text-center">
                                {editingUser === user.username ? (
                                  <div className="flex items-center gap-1 justify-center">
                                    <input
                                      type="text"
                                      value={editPassValue}
                                      onChange={e => setEditPassValue(e.target.value)}
                                      className="w-20 px-1.5 py-0.5 border border-slate-300 rounded font-mono font-bold text-center text-xs"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => handleSavePass(user.username)}
                                      className="px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9.5px] rounded"
                                    >
                                      บันทึก
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-2">
                                    <span className="font-mono font-bold text-slate-600">{user.pass}</span>
                                    <button
                                      onClick={() => startEditPass(user)}
                                      className="text-[10px] text-slate-400 hover:text-[#ba191a] transition-colors"
                                      title="คลิกเพื่อแก้ไขรหัสผ่าน"
                                    >
                                      ✎ แก้ไข
                                    </button>
                                  </div>
                                )}
                              </td>

                              {/* Action buttons (Delete) */}
                              <td className="px-4 py-3 text-center">
                                {user.username.toLowerCase() === 'admin' ? (
                                  <span className="text-[10px] text-slate-400 font-medium italic">ระบบบังคับ</span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteUser(user.username)}
                                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-[#ba191a] rounded transition-colors"
                                    title={`ลบผู้ใช้ ${user.username}`}
                                  >
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                  </button>
                                )}
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeAdminTab === 'data_summary' && (
            /* DETAILED WORK SUMMARY SECTION FOR ADMIN (Rendered when activeAdminTab === 'data_summary') */
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-600 shrink-0">
                    <BarChart2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-black text-sm uppercase tracking-wide">
                      ตารางสรุปผลงานและการลงบันทึกข้อมูลแบบละเอียด (Detailed Work Records Summary)
                    </h3>
                    <p className="text-slate-500 font-bold text-[11px]">
                      สรุปประวัติจำนวนชิ้น ยอดลบ ยอดบวก ยอดสุทธิ และมูลค่าบาททั้งหมดสะสมรายบุคคล
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start xl:self-auto w-full xl:w-auto">
                  {/* Sub Tab Switches */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 text-xs shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setSummaryTab('grouped');
                        setFilterUsername('');
                        setFilterProductCode('');
                        setFilterProductName('');
                        setFilterAddedBy('');
                        setFilterDept('ALL');
                      }}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        summaryTab === 'grouped' 
                          ? 'bg-white text-rose-700 shadow-sm border border-slate-200/50' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>สรุปผลงานรายบุคคล</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSummaryTab('raw_logs');
                        setFilterUsername('');
                        setFilterProductCode('');
                        setFilterProductName('');
                        setFilterAddedBy('');
                        setFilterDept('ALL');
                      }}
                      className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                        summaryTab === 'raw_logs' 
                          ? 'bg-white text-rose-700 shadow-sm border border-slate-200/50' 
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>รายการบันทึกดิบละเอียด</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls (Simulated Sandbox Testing & Reset Actions) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-rose-50/50 border border-rose-100 p-4 rounded-2xl shadow-inner-sm animate-fade-in">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[11px] text-rose-500 font-black uppercase tracking-wider block">🧪 กล่องทดสอบระบบ (Testing Sandbox)</span>
                  <span className="text-slate-500 text-xs font-bold leading-normal block mt-0.5">
                    จำลองผลงานพรีเซลล์ของเจ้าหน้าที่ท่านอื่นสุ่มเพื่อทดสอบระบบการค้นหา กรอง และจัดแสดงรายงาน
                  </span>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleLoadRandomMockData}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-black text-xs uppercase rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>⚡ สุ่มเพิ่มข้อมูลสินค้า (หลาย User)</span>
                  </button>

                  {finalizedProducts && finalizedProducts.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        triggerConfirm(
                          "ล้างข้อมูลพรีเซลล์ทั้งหมด",
                          "คุณต้องการล้างข้อมูลบันทึกผลงานการคำนวณพรีเซลล์ของพนักงานทุกคนในระบบสำหรับวันนี้ใช่หรือไม่? (การล้างข้อมูลนี้จะลบสถิติและข้อมูลดิบทั้งหมดออกจากระบบส่วนกลางและไม่สามารถกู้คืนได้)",
                          () => {
                            onClearAllFinalizedProducts();
                            setSuccessMsg("ล้างข้อมูลพรีเซลล์ของวันนี้เรียบร้อยแล้ว");
                            setTimeout(() => setSuccessMsg(null), 3000);
                          }
                        );
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-xs uppercase rounded-xl transition-all active:scale-95 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>ล้างข้อมูล ({finalizedProducts.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tab 1: Grouped Summary */}
              {summaryTab === 'grouped' && (() => {
                const allUsernames = Array.from(new Set([
                  ...users.map(u => u.username),
                  ...(finalizedProducts ? finalizedProducts.map(p => p.addedBy) : []).filter(Boolean)
                ]));

                const processedGroupedData = allUsernames.map(username => {
                  const account = users.find(u => u.username.toLowerCase() === username.toLowerCase());
                  const roleName = account ? account.roleName : 'ไม่ระบุสิทธิ์';
                  const level = account ? account.level : 3;
                  const userRecords = finalizedProducts ? finalizedProducts.filter(r => r.addedBy === username) : [];

                  const totalRecords = userRecords.length;
                  const totalMulti = userRecords.reduce((sum, r) => sum + (r.multiQty || 0), 0);
                  const totalPlus = userRecords.reduce((sum, r) => sum + (r.plusQty || 0), 0);
                  const totalNet = userRecords.reduce((sum, r) => sum + (r.overrideQty || 0), 0);
                  const totalPrice = userRecords.reduce((sum, r) => sum + (r.price || 0), 0);

                  let latestTime = '-';
                  if (userRecords.length > 0) {
                    latestTime = userRecords[userRecords.length - 1].addedAt || '-';
                  }

                  return {
                    username,
                    roleName,
                    level,
                    totalRecords,
                    totalMulti,
                    totalPlus,
                    totalNet,
                    totalPrice,
                    latestTime
                  };
                });

                const groupUserOptions = Array.from(new Set(processedGroupedData.map(item => item.username))).sort();
                const groupUserCounts = processedGroupedData.reduce((acc, item) => {
                  acc[item.username] = (acc[item.username] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const groupRoleOptions = Array.from(new Set(processedGroupedData.map(item => item.roleName))).sort();
                const groupRoleCounts = processedGroupedData.reduce((acc, item) => {
                  acc[item.roleName] = (acc[item.roleName] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const groupDeptOptions = Array.from(new Set(processedGroupedData.map(item => getUserDeptInfo(item.username).name))).sort();
                const groupDeptCounts = processedGroupedData.reduce((acc, item) => {
                  const d = getUserDeptInfo(item.username).name;
                  acc[d] = (acc[d] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const groupRecordsOptions = Array.from(new Set(processedGroupedData.map(item => item.totalRecords))).sort((a,b) => a-b);
                const groupRecordsCounts = processedGroupedData.reduce((acc, item) => {
                  acc[item.totalRecords] = (acc[item.totalRecords] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                const groupMultiOptions = Array.from(new Set(processedGroupedData.map(item => item.totalMulti))).sort((a,b) => a-b);
                const groupMultiCounts = processedGroupedData.reduce((acc, item) => {
                  acc[item.totalMulti] = (acc[item.totalMulti] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                const groupPlusOptions = Array.from(new Set(processedGroupedData.map(item => item.totalPlus))).sort((a,b) => a-b);
                const groupPlusCounts = processedGroupedData.reduce((acc, item) => {
                  acc[item.totalPlus] = (acc[item.totalPlus] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                const groupNetOptions = Array.from(new Set(processedGroupedData.map(item => item.totalNet))).sort((a,b) => a-b);
                const groupNetCounts = processedGroupedData.reduce((acc, item) => {
                  acc[item.totalNet] = (acc[item.totalNet] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                const groupPriceOptions = Array.from(new Set(processedGroupedData.map(item => item.totalPrice))).sort((a,b) => a-b);
                const groupPriceCounts = processedGroupedData.reduce((acc, item) => {
                  acc[item.totalPrice] = (acc[item.totalPrice] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                const groupTimeOptions = Array.from(new Set(processedGroupedData.map(item => item.latestTime || '-'))).sort();
                const groupTimeCounts = processedGroupedData.reduce((acc, item) => {
                  const t = item.latestTime || '-';
                  acc[t] = (acc[t] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                 const filteredGroupedData = processedGroupedData.filter(item => {
                   const deptInfo = getUserDeptInfo(item.username);
                   
                   // Multi-Select Filters
                   if (groupSelUser.length > 0 && !groupSelUser.includes(item.username)) return false;
                   if (groupSelRole.length > 0 && !groupSelRole.includes(item.roleName)) return false;
                   if (groupSelDept.length > 0 && !groupSelDept.includes(deptInfo.name)) return false;
                   if (groupSelRecords.length > 0 && !groupSelRecords.includes(item.totalRecords)) return false;
                   if (groupSelMulti.length > 0 && !groupSelMulti.includes(item.totalMulti)) return false;
                   if (groupSelPlus.length > 0 && !groupSelPlus.includes(item.totalPlus)) return false;
                   if (groupSelNet.length > 0 && !groupSelNet.includes(item.totalNet)) return false;
                   if (groupSelPrice.length > 0 && !groupSelPrice.includes(item.totalPrice)) return false;
                   if (groupSelTime.length > 0 && !groupSelTime.includes(item.latestTime)) return false;

                   // Column-specific fallback filters
                   if (groupFilterUser.trim()) {
                     const q = groupFilterUser.trim().toLowerCase();
                     if (!(item.username || '').toLowerCase().includes(q)) return false;
                   }
                   if (groupFilterRole.trim()) {
                     const q = groupFilterRole.trim().toLowerCase();
                     if (!(item.roleName || '').toLowerCase().includes(q)) return false;
                   }
                   if (groupFilterDept.trim()) {
                     const q = groupFilterDept.trim().toLowerCase();
                     if (!(deptInfo.name || '').toLowerCase().includes(q)) return false;
                   }
                   if (groupFilterRecords.trim()) {
                     const q = groupFilterRecords.trim().toLowerCase();
                     if (!String(item.totalRecords).toLowerCase().includes(q)) return false;
                   }
                   if (groupFilterMulti.trim()) {
                     const q = groupFilterMulti.trim().toLowerCase();
                     const strVal = item.totalMulti !== 0 ? `-${item.totalMulti}` : '-';
                     if (!strVal.toLowerCase().includes(q) && !String(item.totalMulti).toLowerCase().includes(q)) return false;
                   }
                   if (groupFilterPlus.trim()) {
                     const q = groupFilterPlus.trim().toLowerCase();
                     const strVal = item.totalPlus !== 0 ? `+${item.totalPlus}` : '-';
                     if (!strVal.toLowerCase().includes(q) && !String(item.totalPlus).toLowerCase().includes(q)) return false;
                   }
                   if (groupFilterNet.trim()) {
                     const q = groupFilterNet.trim().toLowerCase();
                     const strVal = item.totalNet > 0 ? `+${item.totalNet}` : String(item.totalNet);
                     if (!strVal.toLowerCase().includes(q) && !String(item.totalNet).toLowerCase().includes(q)) return false;
                   }
                   if (groupFilterPrice.trim()) {
                     const q = groupFilterPrice.trim().toLowerCase();
                     const strVal = item.totalPrice > 0 ? `+${item.totalPrice}` : String(item.totalPrice);
                     if (!strVal.toLowerCase().includes(q) && !String(item.totalPrice).toLowerCase().includes(q)) return false;
                   }
                   if (groupFilterTime.trim()) {
                     const q = groupFilterTime.trim().toLowerCase();
                     if (!(item.latestTime || '').toLowerCase().includes(q)) return false;
                   }

                   // Original global search/filter
                   if (filterUsername.trim()) {
                     const uFilter = filterUsername.trim().toLowerCase();
                     const username = (item.username || '').toLowerCase();
                     const roleName = (item.roleName || '').toLowerCase();
                     const deptName = (deptInfo.name || '').toLowerCase();
                     const totalRecords = String(item.totalRecords);
                     const totalMulti = item.totalMulti !== 0 ? `-${item.totalMulti}` : '-';
                     const totalPlus = item.totalPlus !== 0 ? `+${item.totalPlus}` : '-';
                     const totalNet = String(item.totalNet);
                     const totalPrice = String(item.totalPrice);
                     const latestTime = (item.latestTime || '').toLowerCase();

                     const matches = (
                       username.includes(uFilter) ||
                       roleName.includes(uFilter) ||
                       deptName.includes(uFilter) ||
                       totalRecords.includes(uFilter) ||
                       totalMulti.includes(uFilter) ||
                       totalPlus.includes(uFilter) ||
                       totalNet.includes(uFilter) ||
                       totalPrice.includes(uFilter) ||
                       latestTime.includes(uFilter)
                     );
                     if (!matches) return false;
                   }

                   if (filterDept !== 'ALL') {
                     if (deptInfo.name !== filterDept) return false;
                   }

                   return true;
                 });

                const handleGroupedSort = (field: string) => {
                  if (groupedSortField === field) {
                    setGroupedSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                  } else {
                    setGroupedSortField(field);
                    setGroupedSortDirection('asc');
                  }
                };

                const sortedGroupedData = [...filteredGroupedData].sort((a, b) => {
                  let valA: any;
                  let valB: any;

                  if (groupedSortField === 'dept') {
                    valA = getUserDeptInfo(a.username).name;
                    valB = getUserDeptInfo(b.username).name;
                  } else {
                    valA = a[groupedSortField as keyof typeof a];
                    valB = b[groupedSortField as keyof typeof b];
                  }

                  if (valA === undefined || valA === null) valA = '';
                  if (valB === undefined || valB === null) valB = '';

                  if (typeof valA === 'string' && typeof valB === 'string') {
                    return groupedSortDirection === 'asc' 
                      ? valA.localeCompare(valB, 'th') 
                      : valB.localeCompare(valA, 'th');
                  }
                  if (typeof valA === 'number' && typeof valB === 'number') {
                    return groupedSortDirection === 'asc' ? valA - valB : valB - valA;
                  }
                  return 0;
                });

                 return (
                   <div className="overflow-x-auto border border-rose-100 rounded-2xl shadow-sm">
                     <table className="w-full text-left border-collapse text-xs font-sans">
                       <thead>
                         <tr className="bg-rose-50/70 text-rose-800 border-b border-rose-100 font-bold select-none">
                           <th 
                             onClick={() => handleGroupedSort('username')}
                             className="px-4 py-3 text-left font-black cursor-pointer hover:bg-rose-100/50 select-none group transition-colors"
                           >
                             <div className="flex items-center gap-1">
                               <span>ผู้ใช้งาน (User)</span>
                               <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                 groupedSortField === 'username' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                               }`} />
                             </div>
                           </th>
                           <th 
                             onClick={() => handleGroupedSort('roleName')}
                             className="px-4 py-3 text-center font-black w-[15%] cursor-pointer hover:bg-rose-100/50 select-none group transition-colors"
                           >
                             <div className="flex items-center justify-center gap-1">
                               <span>ระดับสิทธิ์</span>
                               <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                 groupedSortField === 'roleName' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                               }`} />
                             </div>
                           </th>
                           <th 
                             onClick={() => handleGroupedSort('dept')}
                             className="px-4 py-3 text-center font-black w-[15%] cursor-pointer hover:bg-rose-100/50 select-none group transition-colors"
                           >
                             <div className="flex items-center justify-center gap-1">
                               <span>แผนก</span>
                               <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                 groupedSortField === 'dept' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                               }`} />
                             </div>
                           </th>
                           <th 
                             onClick={() => handleGroupedSort('totalRecords')}
                             className="px-4 py-3 text-center font-black cursor-pointer hover:bg-rose-100/50 select-none group transition-colors"
                           >
                             <div className="flex items-center justify-center gap-1">
                               <span>จำนวนรายการที่ทำ</span>
                               <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                 groupedSortField === 'totalRecords' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                               }`} />
                             </div>
                           </th>
                           <th 
                             onClick={() => handleGroupedSort('totalMulti')}
                             className="px-4 py-3 text-right font-black cursor-pointer hover:bg-rose-100/50 select-none group transition-colors"
                           >
                             <div className="flex items-center justify-end gap-1">
                               <span>ลบสะสม (Multi)</span>
                               <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                 groupedSortField === 'totalMulti' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                               }`} />
                             </div>
                           </th>
                           <th 
                             onClick={() => handleGroupedSort('totalPlus')}
                             className="px-4 py-3 text-right font-black cursor-pointer hover:bg-rose-100/50 select-none group transition-colors"
                           >
                             <div className="flex items-center justify-end gap-1">
                               <span>บวกสะสม (Plus)</span>
                               <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                 groupedSortField === 'totalPlus' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                               }`} />
                             </div>
                           </th>
                           <th 
                             onClick={() => handleGroupedSort('totalNet')}
                             className="px-4 py-3 text-right font-black cursor-pointer hover:bg-rose-100/50 select-none group transition-colors"
                           >
                             <div className="flex items-center justify-end gap-1">
                               <span>สุทธิรวม (ชิ้น)</span>
                               <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                 groupedSortField === 'totalNet' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                               }`} />
                             </div>
                           </th>
                           <th 
                             onClick={() => handleGroupedSort('totalPrice')}
                             className="px-4 py-3 text-right font-black cursor-pointer hover:bg-rose-100/50 select-none group transition-colors"
                           >
                             <div className="flex items-center justify-end gap-1">
                               <span>มูลค่ารวม (บาท)</span>
                               <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                 groupedSortField === 'totalPrice' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                               }`} />
                             </div>
                           </th>
                           <th 
                             onClick={() => handleGroupedSort('latestTime')}
                             className="px-4 py-3 text-center font-black cursor-pointer hover:bg-rose-100/50 select-none group transition-colors"
                           >
                             <div className="flex items-center justify-center gap-1">
                               <span>เวลาบันทึกล่าสุด</span>
                               <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                 groupedSortField === 'latestTime' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                               }`} />
                             </div>
                           </th>
                         </tr>
                         {/* Column Filters Row */}
                         <tr className="bg-slate-50/60 border-b border-rose-100/40">
                            {/* 1. User */}
                            <th className="px-2 py-2">
                              <MultiSelectFilter
                                title="ผู้ใช้งาน"
                                options={groupUserOptions}
                                selected={groupSelUser}
                                onChange={setGroupSelUser}
                                isOpen={openDropdownId === 'group_user'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'group_user' ? null : 'group_user')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={groupUserCounts}
                                placeholder="ผู้ใช้งาน"
                                dropdownWidth="w-56"
                              />
                            </th>
                            {/* 2. Role */}
                            <th className="px-2 py-2 w-[15%]">
                              <MultiSelectFilter
                                title="ระดับสิทธิ์"
                                options={groupRoleOptions}
                                selected={groupSelRole}
                                onChange={setGroupSelRole}
                                isOpen={openDropdownId === 'group_role'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'group_role' ? null : 'group_role')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={groupRoleCounts}
                                placeholder="สิทธิ์"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* 3. Dept */}
                            <th className="px-2 py-2 w-[15%]">
                              <MultiSelectFilter
                                title="แผนก"
                                options={groupDeptOptions}
                                selected={groupSelDept}
                                onChange={setGroupSelDept}
                                isOpen={openDropdownId === 'group_dept'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'group_dept' ? null : 'group_dept')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={groupDeptCounts}
                                placeholder="แผนก"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* 4. Total Records */}
                            <th className="px-2 py-2">
                              <MultiSelectFilter
                                title="จำนวนรายการ"
                                options={groupRecordsOptions}
                                selected={groupSelRecords}
                                onChange={setGroupSelRecords}
                                isOpen={openDropdownId === 'group_records'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'group_records' ? null : 'group_records')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={groupRecordsCounts}
                                renderLabel={(val) => `${val.toLocaleString()} รายการ`}
                                placeholder="จำนวน"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* 5. Total Multi */}
                            <th className="px-2 py-2">
                              <MultiSelectFilter
                                title="ลบสะสม"
                                options={groupMultiOptions}
                                selected={groupSelMulti}
                                onChange={setGroupSelMulti}
                                isOpen={openDropdownId === 'group_multi'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'group_multi' ? null : 'group_multi')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={groupMultiCounts}
                                renderLabel={(val) => val !== 0 ? `-${val.toLocaleString()}` : '-'}
                                placeholder="ลบสะสม"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* 6. Total Plus */}
                            <th className="px-2 py-2">
                              <MultiSelectFilter
                                title="บวกสะสม"
                                options={groupPlusOptions}
                                selected={groupSelPlus}
                                onChange={setGroupSelPlus}
                                isOpen={openDropdownId === 'group_plus'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'group_plus' ? null : 'group_plus')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={groupPlusCounts}
                                renderLabel={(val) => val !== 0 ? `+${val.toLocaleString()}` : '-'}
                                placeholder="บวกสะสม"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* 7. Total Net */}
                            <th className="px-2 py-2">
                              <MultiSelectFilter
                                title="สุทธิ"
                                options={groupNetOptions}
                                selected={groupSelNet}
                                onChange={setGroupSelNet}
                                isOpen={openDropdownId === 'group_net'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'group_net' ? null : 'group_net')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={groupNetCounts}
                                renderLabel={(val) => val > 0 ? `+${val.toLocaleString()}` : val.toLocaleString()}
                                placeholder="สุทธิ"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* 8. Total Price */}
                            <th className="px-2 py-2">
                              <MultiSelectFilter
                                title="มูลค่า"
                                options={groupPriceOptions}
                                selected={groupSelPrice}
                                onChange={setGroupSelPrice}
                                isOpen={openDropdownId === 'group_price'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'group_price' ? null : 'group_price')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={groupPriceCounts}
                                renderLabel={(val) => `${val.toLocaleString()} ฿`}
                                placeholder="มูลค่า"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* 9. Latest Time */}
                            <th className="px-2 py-2">
                              <MultiSelectFilter
                                title="เวลาล่าสุด"
                                options={groupTimeOptions}
                                selected={groupSelTime}
                                onChange={setGroupSelTime}
                                isOpen={openDropdownId === 'group_time'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'group_time' ? null : 'group_time')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={groupTimeCounts}
                                placeholder="เวลา"
                                dropdownWidth="w-56"
                              />
                            </th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 bg-white">
                         {sortedGroupedData.length === 0 ? (
                           <tr>
                             <td colSpan={9} className="px-4 py-10 text-center text-slate-400 font-bold italic">
                               ไม่พบประวัติผลงานการบันทึกข้อมูล
                             </td>
                           </tr>
                         ) : (
                           sortedGroupedData.map((item) => {
                             const colors = getLevelColorClasses(item.level);
                             const deptInfo = getUserDeptInfo(item.username);
                             return (
                               <tr key={item.username} className={`${deptInfo.bgRow} border-b border-slate-100 transition-colors`}>
                                 <td className="px-4 py-3 align-middle font-black text-slate-850">
                                    <span className={deptInfo.textColor}>{item.username}</span>
                                  </td>
                                  <td className="px-4 py-3 align-middle text-center font-black text-slate-700">
                                    {item.roleName}
                                  </td>
                                  <td className={`px-4 py-3 align-middle text-center font-black ${deptInfo.textColor || "text-slate-700"}`}>
                                    {deptInfo.name}
                                   </td>
                                <td className="px-4 py-3 text-center font-bold font-mono text-slate-750">
                                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md text-[11px]">
                                    {item.totalRecords.toLocaleString()} รายการ
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right font-black font-mono text-rose-600">
                                  {item.totalMulti !== 0 ? `-${item.totalMulti.toLocaleString()}` : '-'}
                                </td>
                                <td className="px-4 py-3 text-right font-black font-mono text-emerald-600">
                                  {item.totalPlus !== 0 ? `+${item.totalPlus.toLocaleString()}` : '-'}
                                </td>
                                <td className="px-4 py-3 text-right align-middle">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-black ${
                                    item.totalNet < 0 
                                      ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                      : item.totalNet > 0 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                        : 'bg-slate-50 text-slate-650 border border-slate-100'
                                  }`}>
                                    {item.totalNet > 0 ? `+${item.totalNet.toLocaleString()}` : item.totalNet.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right align-middle">
                                  <span className={`inline-block px-2 py-0.5 rounded font-mono font-black ${
                                    item.totalPrice < 0 
                                      ? 'bg-rose-50 text-rose-700' 
                                      : item.totalPrice > 0 
                                        ? 'bg-emerald-50 text-emerald-700' 
                                        : 'text-slate-550'
                                  }`}>
                                    {item.totalPrice.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center font-bold font-mono text-slate-400 text-[11px]">
                                  {item.latestTime}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* Tab 2: Raw Logs */}
              {summaryTab === 'raw_logs' && (() => {
                const rawLogsData = finalizedProducts || [];

                const rawCodeOptions = Array.from(new Set(rawLogsData.map(log => log.code || ''))).sort();
                const rawCodeCounts = rawLogsData.reduce((acc, log) => {
                  const val = log.code || '';
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const rawNameOptions = Array.from(new Set(rawLogsData.map(log => log.name || ''))).sort();
                const rawNameCounts = rawLogsData.reduce((acc, log) => {
                  const val = log.name || '';
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const rawAddedByOptions = Array.from(new Set(rawLogsData.map(log => log.addedBy || ''))).sort();
                const rawAddedByCounts = rawLogsData.reduce((acc, log) => {
                  const val = log.addedBy || '';
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const rawDeptOptions = Array.from(new Set(rawLogsData.map(log => getUserDeptInfo(log.addedBy || '').name))).sort();
                const rawDeptCounts = rawLogsData.reduce((acc, log) => {
                  const val = getUserDeptInfo(log.addedBy || '').name;
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const rawTimeOptions = Array.from(new Set(rawLogsData.map(log => log.addedAt || ''))).sort();
                const rawTimeCounts = rawLogsData.reduce((acc, log) => {
                  const val = log.addedAt || '';
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                const rawMultiOptions = Array.from(new Set(rawLogsData.map(log => log.multiQty || 0))).sort((a,b) => a-b);
                const rawMultiCounts = rawLogsData.reduce((acc, log) => {
                  const val = log.multiQty || 0;
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                const rawPlusOptions = Array.from(new Set(rawLogsData.map(log => log.plusQty || 0))).sort((a,b) => a-b);
                const rawPlusCounts = rawLogsData.reduce((acc, log) => {
                  const val = log.plusQty || 0;
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                const rawNetOptions = Array.from(new Set(rawLogsData.map(log => log.overrideQty || 0))).sort((a,b) => a-b);
                const rawNetCounts = rawLogsData.reduce((acc, log) => {
                  const val = log.overrideQty || 0;
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                const rawPriceOptions = Array.from(new Set(rawLogsData.map(log => log.price || 0))).sort((a,b) => a-b);
                const rawPriceCounts = rawLogsData.reduce((acc, log) => {
                  const val = log.price || 0;
                  acc[val] = (acc[val] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                const filteredRawLogs = rawLogsData.filter(log => {
                  // Multi-Select Filters
                  if (rawSelCode.length > 0 && !rawSelCode.includes(log.code || '')) return false;
                  if (rawSelName.length > 0 && !rawSelName.includes(log.name || '')) return false;
                  if (rawSelAddedBy.length > 0 && !rawSelAddedBy.includes(log.addedBy || '')) return false;
                  
                  const deptInfo = getUserDeptInfo(log.addedBy || '');
                  if (rawSelDept.length > 0 && !rawSelDept.includes(deptInfo.name)) return false;
                  if (rawSelTime.length > 0 && !rawSelTime.includes(log.addedAt || '')) return false;
                  if (rawSelMulti.length > 0 && !rawSelMulti.includes(log.multiQty || 0)) return false;
                  if (rawSelPlus.length > 0 && !rawSelPlus.includes(log.plusQty || 0)) return false;
                  if (rawSelNet.length > 0 && !rawSelNet.includes(log.overrideQty || 0)) return false;
                  if (rawSelPrice.length > 0 && !rawSelPrice.includes(log.price || 0)) return false;

                  if (filterProductCode.trim()) {
                    const codeFilter = filterProductCode.trim().toLowerCase();
                    if (!(log.code || '').toLowerCase().includes(codeFilter)) return false;
                  }

                  if (filterProductName.trim()) {
                    const nameFilter = filterProductName.trim().toLowerCase();
                    if (!(log.name || '').toLowerCase().includes(nameFilter)) return false;
                  }

                  if (filterAddedBy.trim()) {
                    const addedByFilter = filterAddedBy.trim().toLowerCase();
                    if (!(log.addedBy || '').toLowerCase().includes(addedByFilter)) return false;
                  }

                  if (filterRawDept.trim()) {
                    const deptFilter = filterRawDept.trim().toLowerCase();
                    if (!(deptInfo.name || '').toLowerCase().includes(deptFilter)) return false;
                  }

                  if (filterRawTime.trim()) {
                    const timeFilter = filterRawTime.trim().toLowerCase();
                    if (!(log.addedAt || '').toLowerCase().includes(timeFilter)) return false;
                  }

                  if (filterDept !== 'ALL') {
                    const deptInfo = getUserDeptInfo(log.addedBy || '');
                    if (deptInfo.name !== filterDept) return false;
                  }

                  return true;
                });

                const handleRawSort = (field: string) => {
                  if (rawSortField === field) {
                    setRawSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                  } else {
                    setRawSortField(field);
                    setRawSortDirection('asc');
                  }
                };

                const sortedRawLogs = [...filteredRawLogs].sort((a, b) => {
                  let valA: any;
                  let valB: any;

                  if (rawSortField === 'dept') {
                    valA = getUserDeptInfo(a.addedBy || '').name;
                    valB = getUserDeptInfo(b.addedBy || '').name;
                  } else {
                    valA = a[rawSortField as keyof typeof a];
                    valB = b[rawSortField as keyof typeof b];
                  }

                  if (rawSortField === 'addedBy') {
                    valA = valA || '';
                    valB = valB || '';
                  } else if (rawSortField === 'addedAt') {
                    valA = valA || '';
                    valB = valB || '';
                  }

                  if (valA === undefined || valA === null) valA = '';
                  if (valB === undefined || valB === null) valB = '';

                  if (typeof valA === 'string' && typeof valB === 'string') {
                    return rawSortDirection === 'asc' 
                      ? valA.localeCompare(valB, 'th') 
                      : valB.localeCompare(valA, 'th');
                  }
                  if (typeof valA === 'number' && typeof valB === 'number') {
                    return rawSortDirection === 'asc' ? valA - valB : valB - valA;
                  }
                  return 0;
                });

                return (
                  <div className="overflow-hidden border border-rose-100 rounded-2xl shadow-sm">
                    <div className="max-h-[750px] overflow-x-auto overflow-y-auto no-scrollbar">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                                                    <tr className="bg-rose-50 text-rose-800 border-b border-rose-100 font-bold sticky top-0 z-20 select-none">
                            <th 
                              onClick={() => handleRawSort('code')}
                              className="px-4 py-3 text-left font-black w-[12%] cursor-pointer hover:bg-rose-100/50 group transition-colors sticky top-0 bg-rose-50 z-20"
                            >
                              <div className="flex items-center gap-1">
                                <span>รหัสสินค้า (Code)</span>
                                <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                  rawSortField === 'code' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                }`} />
                              </div>
                            </th>
                            <th 
                              onClick={() => handleRawSort('name')}
                              className="px-4 py-3 text-left font-black w-[20%] cursor-pointer hover:bg-rose-100/50 group transition-colors sticky top-0 bg-rose-50 z-20"
                            >
                              <div className="flex items-center gap-1">
                                <span>ชื่อสินค้า (Product Name)</span>
                                <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                  rawSortField === 'name' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                }`} />
                              </div>
                            </th>
                            <th 
                              onClick={() => handleRawSort('addedBy')}
                              className="px-4 py-3 text-center font-black w-[12%] cursor-pointer hover:bg-rose-100/50 group transition-colors sticky top-0 bg-rose-50 z-20"
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span>ผู้บันทึก</span>
                                <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                  rawSortField === 'addedBy' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                }`} />
                              </div>
                            </th>
                            <th 
                              onClick={() => handleRawSort('dept')}
                              className="px-4 py-3 text-center font-black w-[10%] cursor-pointer hover:bg-rose-100/50 group transition-colors sticky top-0 bg-rose-50 z-20"
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span>แผนก</span>
                                <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                  rawSortField === 'dept' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                }`} />
                              </div>
                            </th>
                            <th 
                              onClick={() => handleRawSort('addedAt')}
                              className="px-4 py-3 text-center font-black w-[15%] cursor-pointer hover:bg-rose-100/50 group transition-colors sticky top-0 bg-rose-50 z-20"
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span>เวลาบันทึก</span>
                                <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                  rawSortField === 'addedAt' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                }`} />
                              </div>
                            </th>
                            <th 
                              onClick={() => handleRawSort('multiQty')}
                              className="px-4 py-3 text-right font-black w-[8%] cursor-pointer hover:bg-rose-100/50 group transition-colors sticky top-0 bg-rose-50 z-20"
                            >
                              <div className="flex items-center justify-end gap-1">
                                <span>ลบ (Multi)</span>
                                <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                  rawSortField === 'multiQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                }`} />
                              </div>
                            </th>
                            <th 
                              onClick={() => handleRawSort('plusQty')}
                              className="px-4 py-3 text-right font-black w-[8%] cursor-pointer hover:bg-rose-100/50 group transition-colors sticky top-0 bg-rose-50 z-20"
                            >
                              <div className="flex items-center justify-end gap-1">
                                <span>บวก (Plus)</span>
                                <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                  rawSortField === 'plusQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                }`} />
                              </div>
                            </th>
                            <th 
                              onClick={() => handleRawSort('overrideQty')}
                              className="px-4 py-3 text-right font-black w-[8%] cursor-pointer hover:bg-rose-100/50 group transition-colors sticky top-0 bg-rose-50 z-20"
                            >
                              <div className="flex items-center justify-end gap-1">
                                <span>สุทธิ (ชิ้น)</span>
                                <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                  rawSortField === 'overrideQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                }`} />
                              </div>
                            </th>
                            <th 
                              onClick={() => handleRawSort('price')}
                              className="px-4 py-3 text-right font-black w-[10%] cursor-pointer hover:bg-rose-100/50 group transition-colors sticky top-0 bg-rose-50 z-20"
                            >
                              <div className="flex items-center justify-end gap-1">
                                <span>มูลค่า (บาท)</span>
                                <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                  rawSortField === 'price' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                }`} />
                              </div>
                            </th>
                            <th className="px-4 py-3 text-center font-black w-[5%] select-none sticky top-0 bg-rose-50 z-20">จัดการ</th>
                          </tr>
                          {/* Column Filter Row */}
                          <tr className="bg-slate-50 border-b border-rose-100/40 sticky top-[38px] z-20 shadow-sm">
                            {/* Filter Code */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <MultiSelectFilter
                                title="รหัสสินค้า"
                                options={rawCodeOptions}
                                selected={rawSelCode}
                                onChange={setRawSelCode}
                                isOpen={openDropdownId === 'raw_code'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'raw_code' ? null : 'raw_code')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={rawCodeCounts}
                                placeholder="รหัส"
                                dropdownWidth="w-56"
                              />
                            </th>
                            {/* Filter Name */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <MultiSelectFilter
                                title="ชื่อสินค้า"
                                options={rawNameOptions}
                                selected={rawSelName}
                                onChange={setRawSelName}
                                isOpen={openDropdownId === 'raw_name'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'raw_name' ? null : 'raw_name')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={rawNameCounts}
                                placeholder="ชื่อสินค้า"
                                dropdownWidth="w-64"
                              />
                            </th>
                            {/* Filter AddedBy */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <MultiSelectFilter
                                title="ผู้บันทึก"
                                options={rawAddedByOptions}
                                selected={rawSelAddedBy}
                                onChange={setRawSelAddedBy}
                                isOpen={openDropdownId === 'raw_added_by'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'raw_added_by' ? null : 'raw_added_by')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={rawAddedByCounts}
                                placeholder="ผู้บันทึก"
                                dropdownWidth="w-56"
                              />
                            </th>
                            {/* Filter RawDept */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <MultiSelectFilter
                                title="แผนก"
                                options={rawDeptOptions}
                                selected={rawSelDept}
                                onChange={setRawSelDept}
                                isOpen={openDropdownId === 'raw_dept'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'raw_dept' ? null : 'raw_dept')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={rawDeptCounts}
                                placeholder="แผนก"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* Filter RawTime */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <MultiSelectFilter
                                title="เวลาบันทึก"
                                options={rawTimeOptions}
                                selected={rawSelTime}
                                onChange={setRawSelTime}
                                isOpen={openDropdownId === 'raw_time'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'raw_time' ? null : 'raw_time')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={rawTimeCounts}
                                placeholder="เวลา"
                                dropdownWidth="w-56"
                              />
                            </th>
                            {/* Filter Multi */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <MultiSelectFilter
                                title="ลบ"
                                options={rawMultiOptions}
                                selected={rawSelMulti}
                                onChange={setRawSelMulti}
                                isOpen={openDropdownId === 'raw_multi'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'raw_multi' ? null : 'raw_multi')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={rawMultiCounts}
                                renderLabel={(val) => val !== 0 ? `-${val.toLocaleString()}` : '-'}
                                placeholder="ลบ"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* Filter Plus */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <MultiSelectFilter
                                title="บวก"
                                options={rawPlusOptions}
                                selected={rawSelPlus}
                                onChange={setRawSelPlus}
                                isOpen={openDropdownId === 'raw_plus'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'raw_plus' ? null : 'raw_plus')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={rawPlusCounts}
                                renderLabel={(val) => val !== 0 ? `+${val.toLocaleString()}` : '-'}
                                placeholder="บวก"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* Filter Net */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <MultiSelectFilter
                                title="สุทธิ"
                                options={rawNetOptions}
                                selected={rawSelNet}
                                onChange={setRawSelNet}
                                isOpen={openDropdownId === 'raw_net'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'raw_net' ? null : 'raw_net')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={rawNetCounts}
                                renderLabel={(val) => val > 0 ? `+${val.toLocaleString()}` : val.toLocaleString()}
                                placeholder="สุทธิ"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* Filter Price */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <MultiSelectFilter
                                title="มูลค่า"
                                options={rawPriceOptions}
                                selected={rawSelPrice}
                                onChange={setRawSelPrice}
                                isOpen={openDropdownId === 'raw_price'}
                                onToggle={() => setOpenDropdownId(openDropdownId === 'raw_price' ? null : 'raw_price')}
                                onClose={() => setOpenDropdownId(null)}
                                optionCounts={rawPriceCounts}
                                renderLabel={(val) => `${val.toLocaleString()} ฿`}
                                placeholder="มูลค่า"
                                dropdownWidth="w-48"
                              />
                            </th>
                            {/* Actions Header Empty Space for alignment */}
                            <th className="px-2 py-2 align-middle sticky top-[38px] bg-slate-50 z-20 shadow-sm">
                              <div className="h-6 w-full bg-transparent"></div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {sortedRawLogs.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="px-4 py-10 text-center text-slate-400 font-bold italic">
                                ไม่พบประวัติผลงานการบันทึกข้อมูลรายสินค้า
                              </td>
                            </tr>
                          ) : (
                            sortedRawLogs.map((r, rIdx) => {
                              const deptInfo = getUserDeptInfo(r.addedBy || '');
                              return (
                                <tr key={r.id || rIdx} className={`${deptInfo.bgRow} transition-colors`}>
                                <td className="px-4 py-3 align-middle font-mono text-[11px]">
                                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-black border border-slate-200">
                                    {r.code}
                                  </span>
                                </td>
                                <td className="px-4 py-3 align-middle text-slate-800 font-black text-[11.5px] truncate max-w-[200px]" title={r.name}>
                                  {r.name}
                                </td>
                                <td className="px-4 py-3 align-middle text-center font-black text-[11px] select-none">
                                  <span className={deptInfo.textColor}>{r.addedBy || 'ไม่ระบุชื่อ'}</span>
                                </td>
                                <td className="px-4 py-3 align-middle text-center font-black text-[11px] select-none">
                                  <span className="text-[11px] text-slate-500 font-medium">{deptInfo.name}</span>
                                </td>
                                <td className="px-4 py-3 align-middle text-center font-mono text-[10px] font-bold text-slate-450">
                                  {r.addedAt}
                                </td>
                                <td className="px-4 py-3 text-right text-rose-600 font-black font-mono align-middle">
                                  {r.multiQty !== 0 ? `-${r.multiQty.toLocaleString()}` : '-'}
                                </td>
                                <td className="px-4 py-3 text-right text-emerald-600 font-black font-mono align-middle">
                                  {r.plusQty !== 0 ? `+${r.plusQty.toLocaleString()}` : '-'}
                                </td>
                                <td className="px-4 py-3 text-right align-middle">
                                  <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-mono font-black ${
                                    r.overrideQty < 0 
                                      ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                                      : r.overrideQty > 0 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                        : 'bg-slate-50 text-slate-650 border border-slate-100'
                                  }`}>
                                    {r.overrideQty > 0 ? `+${r.overrideQty.toLocaleString()}` : r.overrideQty.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right align-middle">
                                  <span className={`inline-block px-2 py-0.5 rounded font-mono font-black ${
                                    r.price < 0 
                                      ? 'bg-rose-50 text-rose-700' 
                                      : r.price > 0 
                                        ? 'bg-emerald-50 text-emerald-700' 
                                        : 'text-slate-550'
                                  }`}>
                                    {r.price.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center align-middle">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const originalIndex = finalizedProducts ? finalizedProducts.indexOf(r) : -1;
                                      if (originalIndex !== -1) {
                                        triggerConfirm(
                                          "ลบบันทึกสินค้าเฉพาะรายการนี้",
                                          `คุณต้องการลบข้อมูลพรีเซลล์ของสินค้า ${r.code} - ${r.name} ที่บันทึกโดย ${r.addedBy || 'ไม่ระบุชื่อ'} ใช่หรือไม่?`,
                                          () => {
                                            onDeleteFinalizedProduct(originalIndex);
                                            setSuccessMsg(`ลบบันทึกสินค้า ${r.code} เรียบร้อยแล้ว`);
                                            setTimeout(() => setSuccessMsg(null), 3000);
                                          }
                                        );
                                      }
                                    }}
                                    className="p-1.5 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                    title="ลบบันทึกรายการนี้"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mx-auto" />
                                  </button>
                                </td>
                              </tr>
                            );
                           })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

            </div>
          )}

          {activeAdminTab === 'history' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-50 rounded-xl text-[#ba191a] shrink-0">
                    <Calendar className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-black text-sm uppercase tracking-wide">
                      ประวัติปฏิทินบันทึกข้อมูลย้อนหลัง (Past Calendar History)
                    </h3>
                    <p className="text-slate-500 font-bold text-[11px]">
                      บันทึกรายงานพรีเซลล์ย้อนหลัง 30 วัน ค้นหารายการ ตรวจสอบสถิติและผลต่างสะสมรายวัน
                    </p>
                  </div>
                </div>
              </div>

              {(() => {
                // Get month and year
                const year = calendarViewDate.getFullYear();
                const month = calendarViewDate.getMonth();

                // Grid calculations
                const firstDayIndex = new Date(year, month, 1).getDay();
                const totalDays = new Date(year, month + 1, 0).getDate();
                const prevMonthTotalDays = new Date(year, month, 0).getDate();

                const paddingCells = [];
                for (let i = firstDayIndex - 1; i >= 0; i--) {
                  const prevMonthNum = month === 0 ? 11 : month - 1;
                  const prevYearNum = month === 0 ? year - 1 : year;
                  paddingCells.push({
                    day: prevMonthTotalDays - i,
                    isCurrentMonth: false,
                    dateStr: `${prevYearNum}-${String(prevMonthNum + 1).padStart(2, '0')}-${String(prevMonthTotalDays - i).padStart(2, '0')}`
                  });
                }

                const currentMonthCells = [];
                for (let d = 1; d <= totalDays; d++) {
                  currentMonthCells.push({
                    day: d,
                    isCurrentMonth: true,
                    dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                  });
                }

                const totalCellsSoFar = paddingCells.length + currentMonthCells.length;
                const nextMonthCells = [];
                const remaining = totalCellsSoFar % 7 === 0 ? 0 : 7 - (totalCellsSoFar % 7);
                for (let d = 1; d <= remaining; d++) {
                  const nextMonthNum = month === 11 ? 0 : month + 1;
                  const nextYearNum = month === 11 ? year + 1 : year;
                  nextMonthCells.push({
                    day: d,
                    isCurrentMonth: false,
                    dateStr: `${nextYearNum}-${String(nextMonthNum + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                  });
                }

                const allCells = [...paddingCells, ...currentMonthCells, ...nextMonthCells];

                // Selected date details
                const dayProducts = historyDatabase[selectedHistoryDate] || [];

                // 1. Dept Options and counts
                const histDeptOptions = Array.from(new Set(dayProducts.map(p => getUserDeptInfo(p.addedBy || '').name))).sort() as string[];
                const histDeptCounts = dayProducts.reduce((acc, p) => {
                  const d = getUserDeptInfo(p.addedBy || '').name;
                  acc[d] = (acc[d] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                // 2. Code Options and counts
                const histCodeOptions = Array.from(new Set(dayProducts.map(p => p.code))).sort() as string[];
                const histCodeCounts = dayProducts.reduce((acc, p) => {
                  acc[p.code] = (acc[p.code] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                // 3. Name Options and counts
                const histNameOptions = Array.from(new Set(dayProducts.map(p => p.name))).sort() as string[];
                const histNameCounts = dayProducts.reduce((acc, p) => {
                  acc[p.name] = (acc[p.name] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);

                // 4. MultiQty (ยอดเดิม) Options and counts
                const histMultiOptions = Array.from(new Set(dayProducts.map(p => p.multiQty))).sort((a, b) => (a as number) - (b as number)) as number[];
                const histMultiCounts = dayProducts.reduce((acc, p) => {
                  acc[p.multiQty] = (acc[p.multiQty] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                // 5. PlusQty (พรีเซลล์) Options and counts
                const histPlusOptions = Array.from(new Set(dayProducts.map(p => p.plusQty))).sort((a, b) => (a as number) - (b as number)) as number[];
                const histPlusCounts = dayProducts.reduce((acc, p) => {
                  acc[p.plusQty] = (acc[p.plusQty] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                // 6. OverrideQty (ผลต่าง) Options and counts
                const histNetOptions = Array.from(new Set(dayProducts.map(p => p.overrideQty))).sort((a, b) => (a as number) - (b as number)) as number[];
                const histNetCounts = dayProducts.reduce((acc, p) => {
                  acc[p.overrideQty] = (acc[p.overrideQty] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                // 7. Price Options and counts
                const histPriceOptions = Array.from(new Set(dayProducts.map(p => p.price))).sort((a, b) => (a as number) - (b as number)) as number[];
                const histPriceCounts = dayProducts.reduce((acc, p) => {
                  acc[p.price] = (acc[p.price] || 0) + 1;
                  return acc;
                }, {} as Record<number, number>);

                // 8. AddedBy (ผู้ลงชื่อ) Options and counts
                const histAddedByOptions = Array.from(new Set(dayProducts.map(p => p.addedBy || ''))).filter(Boolean).sort() as string[];
                const histAddedByCounts = dayProducts.reduce((acc, p) => {
                  if (p.addedBy) {
                    acc[p.addedBy] = (acc[p.addedBy] || 0) + 1;
                  }
                  return acc;
                }, {} as Record<string, number>);

                // 9. Time Options and counts
                const histTimeOptions = Array.from(new Set(dayProducts.map(p => p.addedAt?.split(' ')[1] || p.addedAt || ''))).filter(Boolean).sort() as string[];
                const histTimeCounts = dayProducts.reduce((acc, p) => {
                  const t = p.addedAt?.split(' ')[1] || p.addedAt || '';
                  if (t) {
                    acc[t] = (acc[t] || 0) + 1;
                  }
                  return acc;
                }, {} as Record<string, number>);

                // Sort Handler for History table
                const handleHistSort = (field: string) => {
                  if (histSortField === field) {
                    setHistSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                  } else {
                    setHistSortField(field);
                    setHistSortDirection('asc');
                  }
                };

                // Filter options on selected date (legacy dropdown selectors in UI header card)
                const dayUsernames = Array.from(new Set(dayProducts.map(p => p.addedBy || ''))).filter(Boolean);
                const dayDepts = Array.from(new Set(dayProducts.map(p => getUserDeptInfo(p.addedBy || '').name))).filter(Boolean);

                // Multi-select status check
                const anyHistFilterActive = 
                  histSelDept.length > 0 ||
                  histSelCode.length > 0 ||
                  histSelName.length > 0 ||
                  histSelMulti.length > 0 ||
                  histSelPlus.length > 0 ||
                  histSelNet.length > 0 ||
                  histSelPrice.length > 0 ||
                  histSelAddedBy.length > 0 ||
                  histSelTime.length > 0;

                const handleClearAllHistFilters = () => {
                  setHistSelDept([]);
                  setHistSelCode([]);
                  setHistSelName([]);
                  setHistSelMulti([]);
                  setHistSelPlus([]);
                  setHistSelNet([]);
                  setHistSelPrice([]);
                  setHistSelAddedBy([]);
                  setHistSelTime([]);
                };

                const filteredDayProducts = dayProducts.filter(p => {
                  const deptName = getUserDeptInfo(p.addedBy || '').name;
                  const timeStr = p.addedAt?.split(' ')[1] || p.addedAt || '';
                  
                  if (historyFilterDept !== 'ALL' && deptName !== historyFilterDept) return false;
                  if (historyFilterUser !== 'ALL' && p.addedBy !== historyFilterUser) return false;

                  if (historySearch.trim()) {
                    const q = historySearch.trim().toLowerCase();
                    const codeMatch = (p.code || '').toLowerCase().includes(q);
                    const nameMatch = (p.name || '').toLowerCase().includes(q);
                    const addedByMatch = (p.addedBy || '').toLowerCase().includes(q);
                    if (!codeMatch && !nameMatch && !addedByMatch) return false;
                  }

                  // Column Multi-Select Filters
                  if (histSelDept.length > 0 && !histSelDept.includes(deptName)) return false;
                  if (histSelCode.length > 0 && !histSelCode.includes(p.code)) return false;
                  if (histSelName.length > 0 && !histSelName.includes(p.name)) return false;
                  if (histSelMulti.length > 0 && !histSelMulti.includes(p.multiQty)) return false;
                  if (histSelPlus.length > 0 && !histSelPlus.includes(p.plusQty)) return false;
                  if (histSelNet.length > 0 && !histSelNet.includes(p.overrideQty)) return false;
                  if (histSelPrice.length > 0 && !histSelPrice.includes(p.price)) return false;
                  if (histSelAddedBy.length > 0 && !histSelAddedBy.includes(p.addedBy || '')) return false;
                  if (histSelTime.length > 0 && !histSelTime.includes(timeStr)) return false;

                  return true;
                });

                // Sort the filtered list
                const sortedDayProducts = [...filteredDayProducts].sort((a, b) => {
                  let valA: any;
                  let valB: any;

                  if (histSortField === 'dept') {
                    valA = getUserDeptInfo(a.addedBy || '').name;
                    valB = getUserDeptInfo(b.addedBy || '').name;
                  } else if (histSortField === 'addedAt') {
                    valA = a.addedAt?.split(' ')[1] || a.addedAt || '';
                    valB = b.addedAt?.split(' ')[1] || b.addedAt || '';
                  } else {
                    valA = a[histSortField as keyof typeof a];
                    valB = b[histSortField as keyof typeof b];
                  }

                  if (valA === undefined || valA === null) valA = '';
                  if (valB === undefined || valB === null) valB = '';

                  if (typeof valA === 'string' && typeof valB === 'string') {
                    return histSortDirection === 'asc' 
                      ? valA.localeCompare(valB, 'th') 
                      : valB.localeCompare(valA, 'th');
                  }
                  if (typeof valA === 'number' && typeof valB === 'number') {
                    return histSortDirection === 'asc' ? valA - valB : valB - valA;
                  }
                  return 0;
                });

                // Stats calculations for selected day (using all)
                const totalMulti = dayProducts.reduce((sum, p) => sum + (p.multiQty || 0), 0);
                const totalPlus = dayProducts.reduce((sum, p) => sum + (p.plusQty || 0), 0);
                const totalNet = dayProducts.reduce((sum, p) => sum + (p.overrideQty || 0), 0);
                const totalPrice = dayProducts.reduce((sum, p) => sum + (p.price || 0), 0);
                const uniqueUsers = Array.from(new Set(dayProducts.map(p => p.addedBy?.split(' (')[0]))).filter(Boolean);

                const getThaiMonthName = (monthIdx: number) => {
                  const monthNames = [
                    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
                    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
                  ];
                  return monthNames[monthIdx];
                };

                const formatThaiDateFull = (dateStr: string) => {
                  try {
                    const parts = dateStr.split('-');
                    if (parts.length === 3) {
                      const y = parseInt(parts[0]) + 543;
                      const mIdx = parseInt(parts[1]) - 1;
                      const d = parseInt(parts[2]);
                      return `${d} ${getThaiMonthName(mIdx)} ${y}`;
                    }
                  } catch (e) {}
                  return dateStr;
                };

                return (
                  <div className="space-y-6 animate-fade-in mt-2 text-left">
                    
                    {/* TOP SECTION: TWO COLUMNS (Calendar & Summary) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                      
                      {/* LEFT PANEL: CALENDAR CARD (lg:col-span-5) */}
                      <div className="lg:col-span-5 flex flex-col">
                        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#ba191a]" />
                                <span>ปฏิทินบันทึกข้อมูลย้อนหลัง</span>
                              </h4>
                              
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const prev = new Date(calendarViewDate);
                                    prev.setMonth(prev.getMonth() - 1);
                                    setCalendarViewDate(prev);
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                                  title="เดือนก่อนหน้า"
                                >
                                  <ChevronDown className="w-4 h-4 rotate-90" />
                                </button>
                                <span className="text-xs font-black text-slate-800 px-2 min-w-[90px] text-center">
                                  {getThaiMonthName(month)} {year + 543}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = new Date(calendarViewDate);
                                    next.setMonth(next.getMonth() + 1);
                                    setCalendarViewDate(next);
                                  }}
                                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                                  title="เดือนถัดไป"
                                >
                                  <ChevronDown className="w-4 h-4 -rotate-90" />
                                </button>
                              </div>
                            </div>

                            {/* Calendar Grid Header */}
                            <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                              <div className="text-rose-500">อา</div>
                              <div>จ</div>
                              <div>อ</div>
                              <div>พ</div>
                              <div>พฤ</div>
                              <div>ศ</div>
                              <div className="text-blue-500">ส</div>
                            </div>

                            {/* Calendar Cells */}
                            <div className="grid grid-cols-7 gap-1">
                              {allCells.map((cell, idx) => {
                                const hasData = historyDatabase[cell.dateStr] && historyDatabase[cell.dateStr].length > 0;
                                const isSelected = selectedHistoryDate === cell.dateStr;
                                
                                // Check if today
                                const today = new Date();
                                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                const isToday = todayStr === cell.dateStr;

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setSelectedHistoryDate(cell.dateStr);
                                      setHistoryFilterDept('ALL');
                                      setHistoryFilterUser('ALL');
                                      setHistorySearch('');
                                    }}
                                    className={`h-12 rounded-xl flex flex-col items-center justify-between p-1 transition-all relative border cursor-pointer ${
                                      !cell.isCurrentMonth
                                        ? 'text-slate-300 border-transparent hover:bg-slate-50 opacity-40'
                                        : isSelected
                                          ? 'bg-[#ba191a] border-[#ba191a] text-white shadow-md shadow-rose-600/20'
                                          : isToday
                                            ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                                            : hasData
                                              ? 'bg-emerald-50 border-emerald-100 text-slate-800 hover:bg-emerald-50 hover:border-emerald-200'
                                              : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                                    }`}
                                  >
                                    {/* Day Number */}
                                    <span className="text-[11px] font-extrabold">{cell.day}</span>
                                    
                                    {/* Indicators (Dot / Badge) */}
                                    <div className="flex items-center gap-0.5 justify-center min-h-[14px] w-full">
                                      {hasData && (
                                        <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'} animate-pulse`} />
                                      )}
                                      {hasData && (
                                        <span className={`text-[8px] font-mono font-black ${isSelected ? 'text-rose-100' : 'text-emerald-700'}`}>
                                          {historyDatabase[cell.dateStr].length}
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT PANEL: SELECTED DAY SUMMARY BENTO (lg:col-span-7) */}
                      <div className="lg:col-span-7 flex flex-col">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-full flex flex-col justify-between space-y-4">
                          
                          {/* Active Day Header */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-150 pb-3.5 shrink-0">
                            <div>
                              <span className="text-[10px] font-extrabold text-[#ba191a] uppercase tracking-wider block">ประวัติสรุปข้อมูลประจำวัน</span>
                              <h3 className="text-slate-900 font-black text-sm flex items-center gap-2 mt-0.5">
                                <span>วันส่งสินค้า: {formatThaiDateFull(selectedHistoryDate)}</span>
                              </h3>
                            </div>
                          </div>

                          {/* If No Data for Selected Day */}
                          {dayProducts.length === 0 ? (
                            <div className="py-12 text-center flex flex-col items-center justify-center space-y-4 animate-fade-in flex-1">
                              <div className="h-16 w-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                                <Calendar className="w-8 h-8" />
                              </div>
                              <div className="space-y-1">
                                <h5 className="font-extrabold text-slate-800 text-sm">ไม่มีประวัติการพรีเซลล์ในวันที่เลือก</h5>
                                <p className="text-slate-500 font-bold text-xs max-w-sm mx-auto leading-relaxed">
                                  ยังไม่มีการปิดยอดหรือล็อกระบบบันทึกพรีเซลล์ส่วนกลางในวันนี้ คุณสามารถเลือกวันอื่นๆ ที่มี <span className="text-emerald-500 font-extrabold">จุดสีเขียว</span> เพื่อตรวจสอบข้อมูล หรือทดลองสุ่มจำลองข้อมูลสำหรับวันนี้ได้ที่ด้านล่าง
                                </p>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  // Load mock data specifically for this day to play with!
                                  const mockDataForDay = [
                                    { code: '1072_01', name: 'ขนมปังเนยสดไส้มะพร้าว', plusQty: 25, overrideQty: 15, multiQty: 10, price: 570, addedBy: 'M-72000 (Manager)', addedAt: `08/07/2026 08:45`, delDate: selectedHistoryDate },
                                    { code: '1010_01', name: 'ขนมปังแผ่นขาวแถวสั้น', plusQty: 20, overrideQty: 12, multiQty: 8, price: 504, addedBy: 'S-72001 (Staff)', addedAt: `08/07/2026 09:12`, delDate: selectedHistoryDate },
                                    { code: '1060_01', name: 'เดลี่แซนวิชไส้ชีสทูน่า', plusQty: 40, overrideQty: 25, multiQty: 15, price: 700, addedBy: 'S-72001 (Staff)', addedAt: `08/07/2026 09:15`, delDate: selectedHistoryDate },
                                    { code: '1064_01', name: 'แซนวิชเค้กสอดไส้ครีมส้ม', plusQty: 15, overrideQty: -5, multiQty: 20, price: -100, addedBy: 'M-72000 (Manager)', addedAt: `08/07/2026 09:44`, delDate: selectedHistoryDate }
                                  ];
                                  const nextDB = {
                                    ...historyDatabase,
                                    [selectedHistoryDate]: mockDataForDay
                                  };
                                  setHistoryDatabase(nextDB);
                                  localStorage.setItem('farmhouse_presale_history', JSON.stringify(nextDB));
                                  setSuccessMsg(`โหลดข้อมูลทดลองประจำวันที่ ${selectedHistoryDate} สำเร็จ`);
                                  setTimeout(() => setSuccessMsg(null), 3000);
                                }}
                                className="px-4 py-2 bg-[#ba191a] hover:bg-[#a01516] text-white font-black text-xs rounded-xl shadow transition-all active:scale-95 cursor-pointer"
                              >
                                ⚡ สุ่มจำลองโหลดประวัติในวันนี้เพื่อทดสอบบอร์ด
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4 flex-1 flex flex-col justify-center">
                              
                              {/* Stats Summary Bento (Grid of 4) */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                
                                {/* Stat 1: Users */}
                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-left">
                                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">ผู้ส่งงาน (Users)</span>
                                  <span className="text-slate-900 text-sm font-black font-mono block mt-0.5">
                                    {uniqueUsers.length} <span className="text-[9px] text-slate-500 font-bold">คน</span>
                                  </span>
                                </div>

                                {/* Stat 2: Total Qty */}
                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-left">
                                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">ยอดรวมชิ้น (Qty)</span>
                                  <span className="text-slate-900 text-sm font-black font-mono block mt-0.5">
                                    {totalPlus.toLocaleString()} <span className="text-[9px] text-slate-500 font-bold">ชิ้น</span>
                                  </span>
                                </div>

                                {/* Stat 3: Net Difference */}
                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-left">
                                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">ส่วนต่างสุทธิ (Net)</span>
                                  <span className={`text-sm font-black font-mono block mt-0.5 ${
                                    totalNet > 0 ? 'text-emerald-600' : totalNet < 0 ? 'text-[#ba191a]' : 'text-slate-700'
                                  }`}>
                                    {totalNet > 0 ? `+${totalNet.toLocaleString()}` : totalNet.toLocaleString()} <span className="text-[9px] text-slate-500 font-bold">ชิ้น</span>
                                  </span>
                                </div>

                                {/* Stat 4: Price Valuation */}
                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-left">
                                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">มูลค่ารวม (Valuation)</span>
                                  <span className={`text-sm font-black font-mono block mt-0.5 ${
                                    totalPrice > 0 ? 'text-emerald-600' : totalPrice < 0 ? 'text-[#ba191a]' : 'text-slate-700'
                                  }`}>
                                    {totalPrice.toLocaleString()} <span className="text-[9px] text-slate-500 font-bold">฿</span>
                                  </span>
                                </div>

                              </div>

                              {/* Bottom explanation */}
                              <div className="text-slate-500 font-bold text-[11px] bg-rose-50/20 border border-rose-100/50 p-3 rounded-xl flex items-start gap-2">
                                <span className="text-[#ba191a] text-xs">💡</span>
                                <p className="leading-normal">
                                  <span className="text-slate-800 font-extrabold">มุมมองรายงานขนาดใหญ่</span>: รายชื่อสินค้าพร้อมรายละเอียดทั้งหมดในประวัติประจำวันจะถูกย้ายลงไปสถิติวางอยู่ที่ <span className="text-[#ba191a] font-extrabold">ตารางกว้างด้านล่างปฏิทิน</span> เพื่อให้ผู้ดูแลระบบมองเห็นเงื่อนไข ตัวกรองแผนก และคอลัมน์สำคัญทั้งหมดได้อย่างกว้างขวางและครบถ้วนสูงสุด
                                </p>
                              </div>

                            </div>
                          )}

                        </div>
                      </div>

                    </div>

                    {/* BOTTOM SECTION: EXPANDED DETAILED RECORDS TABLE (FULL WIDTH / LARGE) */}
                    {dayProducts.length > 0 && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
                        
                        <div className="border-b border-slate-150 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-slate-900 font-black text-sm uppercase tracking-wide flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#ba191a] animate-pulse shrink-0" />
                              <span>ตารางวิเคราะห์ข้อมูลพรีเซลล์ละเอียด - วันส่งสินค้า {formatThaiDateFull(selectedHistoryDate)}</span>
                            </h4>
                            <p className="text-slate-500 font-bold text-[11px] mt-0.5">
                              แสดงรายงานทั้งหมดจำนวน {sortedDayProducts.length} จากทั้งหมด {dayProducts.length} รายการ (ปรับแต่ง ตัวกรอง ค้นหา ข้อมูลขนาดใหญ่ได้อย่างสมบูรณ์)
                            </p>
                          </div>
                        </div>

                        {/* Filters row inside Selected Day */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-left">
                          
                          {/* Search */}
                          <div className="relative">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={historySearch}
                              onChange={e => setHistorySearch(e.target.value)}
                              placeholder="ค้นหารหัส/ชื่อสินค้า หรือผู้บันทึก"
                              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                            />
                          </div>

                          {/* Filter Department */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-slate-500 shrink-0">แผนก:</span>
                            <select
                              value={historyFilterDept}
                              onChange={e => setHistoryFilterDept(e.target.value)}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-rose-500"
                            >
                              <option value="ALL">แสดงทุกแผนก ({dayDepts.length})</option>
                              {dayDepts.map((d, i) => (
                                <option key={i} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>

                          {/* Filter User */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold text-slate-500 shrink-0">ผู้ลงชื่อ:</span>
                            <select
                              value={historyFilterUser}
                              onChange={e => setHistoryFilterUser(e.target.value)}
                              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-rose-500"
                            >
                              <option value="ALL">ทุกคนที่บันทึก ({dayUsernames.length})</option>
                              {dayUsernames.map((u, i) => (
                                <option key={i} value={u}>{u}</option>
                              ))}
                            </select>
                          </div>

                        </div>

                        {/* Detailed Records Table */}
                        <div className="overflow-hidden border border-rose-100 rounded-2xl shadow-sm bg-white">
                          <div className="max-h-[500px] overflow-x-auto overflow-y-auto no-scrollbar">
                            <table className="w-full text-left border-collapse text-xs font-sans">
                              <thead>
                                <tr className="bg-rose-50/70 text-rose-800 border-b border-rose-100 font-bold select-none sticky top-0 z-10 bg-rose-50">
                                  <th className="px-4 py-3 text-center font-black sticky top-0 bg-rose-50 z-10">ลำดับ</th>
                                  <th 
                                    onClick={() => handleHistSort('dept')}
                                    className="px-4 py-3 text-left font-black sticky top-0 bg-rose-50 z-10 cursor-pointer hover:bg-rose-100/50 transition-colors group select-none"
                                  >
                                    <div className="flex items-center gap-1">
                                      <span>แผนก</span>
                                      <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                        histSortField === 'dept' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                      }`} />
                                    </div>
                                  </th>
                                  <th 
                                    onClick={() => handleHistSort('code')}
                                    className="px-4 py-3 text-left font-black sticky top-0 bg-rose-50 z-10 cursor-pointer hover:bg-rose-100/50 transition-colors group select-none"
                                  >
                                    <div className="flex items-center gap-1">
                                      <span>รหัส</span>
                                      <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                        histSortField === 'code' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                      }`} />
                                    </div>
                                  </th>
                                  <th 
                                    onClick={() => handleHistSort('name')}
                                    className="px-4 py-3 text-left font-black sticky top-0 bg-rose-50 z-10 w-2/5 cursor-pointer hover:bg-rose-100/50 transition-colors group select-none"
                                  >
                                    <div className="flex items-center gap-1">
                                      <span>ชื่อสินค้า</span>
                                      <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                        histSortField === 'name' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                      }`} />
                                    </div>
                                  </th>
                                  <th 
                                    onClick={() => handleHistSort('multiQty')}
                                    className="px-4 py-3 text-right font-black sticky top-0 bg-rose-50 z-10 cursor-pointer hover:bg-rose-100/50 transition-colors group select-none"
                                  >
                                    <div className="flex items-center justify-end gap-1">
                                      <span>ยอดเดิม</span>
                                      <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                        histSortField === 'multiQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                      }`} />
                                    </div>
                                  </th>
                                  <th 
                                    onClick={() => handleHistSort('plusQty')}
                                    className="px-4 py-3 text-right font-black sticky top-0 bg-rose-50 z-10 cursor-pointer hover:bg-rose-100/50 transition-colors group select-none"
                                  >
                                    <div className="flex items-center justify-end gap-1">
                                      <span>พรีเซลล์</span>
                                      <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                        histSortField === 'plusQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                      }`} />
                                    </div>
                                  </th>
                                  <th 
                                    onClick={() => handleHistSort('overrideQty')}
                                    className="px-4 py-3 text-right font-black sticky top-0 bg-rose-50 z-10 cursor-pointer hover:bg-rose-100/50 transition-colors group select-none"
                                  >
                                    <div className="flex items-center justify-end gap-1">
                                      <span>ผลต่าง</span>
                                      <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                        histSortField === 'overrideQty' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                      }`} />
                                    </div>
                                  </th>
                                  <th 
                                    onClick={() => handleHistSort('price')}
                                    className="px-4 py-3 text-right font-black sticky top-0 bg-rose-50 z-10 cursor-pointer hover:bg-rose-100/50 transition-colors group select-none"
                                  >
                                    <div className="flex items-center justify-end gap-1">
                                      <span>บาท</span>
                                      <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                        histSortField === 'price' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                      }`} />
                                    </div>
                                  </th>
                                  <th 
                                    onClick={() => handleHistSort('addedBy')}
                                    className="px-4 py-3 text-left font-black sticky top-0 bg-rose-50 z-10 cursor-pointer hover:bg-rose-100/50 transition-colors group select-none"
                                  >
                                    <div className="flex items-center gap-1">
                                      <span>ผู้ลงชื่อ</span>
                                      <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                        histSortField === 'addedBy' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                      }`} />
                                    </div>
                                  </th>
                                  <th 
                                    onClick={() => handleHistSort('addedAt')}
                                    className="px-4 py-3 text-center font-black sticky top-0 bg-rose-50 z-10 cursor-pointer hover:bg-rose-100/50 transition-colors group select-none"
                                  >
                                    <div className="flex items-center justify-center gap-1">
                                      <span>เวลา</span>
                                      <ArrowUpDown className={`w-4 h-4 shrink-0 transition-opacity ${
                                        histSortField === 'addedAt' ? 'text-[#ba191a] opacity-100' : 'text-slate-400 opacity-40 group-hover:opacity-100'
                                      }`} />
                                    </div>
                                  </th>
                                  <th className="px-4 py-3 text-center font-black sticky top-0 bg-rose-50 z-10">ลบ</th>
                                </tr>

                                {/* Multi-Select Column Filters Row */}
                                <tr className="bg-rose-50/40 border-b border-rose-100/40 select-none">
                                  <th className="px-2 py-2 text-center">
                                    {anyHistFilterActive && (
                                      <button
                                        type="button"
                                        onClick={handleClearAllHistFilters}
                                        className="p-1 px-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[10px] rounded border border-red-200 transition-colors cursor-pointer select-none active:scale-95 flex items-center justify-center mx-auto"
                                        title="ล้างการกรองทั้งหมด"
                                      >
                                        ล้าง
                                      </button>
                                    )}
                                  </th>
                                  {/* 1. Dept */}
                                  <th className="px-2 py-2">
                                    <MultiSelectFilter
                                      title="แผนก"
                                      options={histDeptOptions}
                                      selected={histSelDept}
                                      onChange={setHistSelDept}
                                      isOpen={openDropdownId === 'hist_dept'}
                                      onToggle={() => setOpenDropdownId(openDropdownId === 'hist_dept' ? null : 'hist_dept')}
                                      onClose={() => setOpenDropdownId(null)}
                                      optionCounts={histDeptCounts}
                                      placeholder="แผนก"
                                      dropdownWidth="w-48"
                                    />
                                  </th>
                                  {/* 2. Code */}
                                  <th className="px-2 py-2">
                                    <MultiSelectFilter
                                      title="รหัส"
                                      options={histCodeOptions}
                                      selected={histSelCode}
                                      onChange={setHistSelCode}
                                      isOpen={openDropdownId === 'hist_code'}
                                      onToggle={() => setOpenDropdownId(openDropdownId === 'hist_code' ? null : 'hist_code')}
                                      onClose={() => setOpenDropdownId(null)}
                                      optionCounts={histCodeCounts}
                                      placeholder="รหัส"
                                      dropdownWidth="w-48"
                                    />
                                  </th>
                                  {/* 3. Name */}
                                  <th className="px-2 py-2 w-2/5">
                                    <MultiSelectFilter
                                      title="สินค้า"
                                      options={histNameOptions}
                                      selected={histSelName}
                                      onChange={setHistSelName}
                                      isOpen={openDropdownId === 'hist_name'}
                                      onToggle={() => setOpenDropdownId(openDropdownId === 'hist_name' ? null : 'hist_name')}
                                      onClose={() => setOpenDropdownId(null)}
                                      optionCounts={histNameCounts}
                                      placeholder="ชื่อสินค้า"
                                      dropdownWidth="w-72"
                                    />
                                  </th>
                                  {/* 4. MultiQty */}
                                  <th className="px-2 py-2">
                                    <MultiSelectFilter
                                      title="ยอดเดิม"
                                      options={histMultiOptions}
                                      selected={histSelMulti}
                                      onChange={setHistSelMulti}
                                      isOpen={openDropdownId === 'hist_multi'}
                                      onToggle={() => setOpenDropdownId(openDropdownId === 'hist_multi' ? null : 'hist_multi')}
                                      onClose={() => setOpenDropdownId(null)}
                                      optionCounts={histMultiCounts}
                                      renderLabel={(val) => val !== 0 ? val.toLocaleString() : '-'}
                                      placeholder="ยอดเดิม"
                                      dropdownWidth="w-48"
                                    />
                                  </th>
                                  {/* 5. PlusQty */}
                                  <th className="px-2 py-2">
                                    <MultiSelectFilter
                                      title="พรีเซลล์"
                                      options={histPlusOptions}
                                      selected={histSelPlus}
                                      onChange={setHistSelPlus}
                                      isOpen={openDropdownId === 'hist_plus'}
                                      onToggle={() => setOpenDropdownId(openDropdownId === 'hist_plus' ? null : 'hist_plus')}
                                      onClose={() => setOpenDropdownId(null)}
                                      optionCounts={histPlusCounts}
                                      renderLabel={(val) => val !== 0 ? `+${val.toLocaleString()}` : '-'}
                                      placeholder="พรีเซลล์"
                                      dropdownWidth="w-48"
                                    />
                                  </th>
                                  {/* 6. OverrideQty */}
                                  <th className="px-2 py-2">
                                    <MultiSelectFilter
                                      title="ผลต่าง"
                                      options={histNetOptions}
                                      selected={histSelNet}
                                      onChange={setHistSelNet}
                                      isOpen={openDropdownId === 'hist_net'}
                                      onToggle={() => setOpenDropdownId(openDropdownId === 'hist_net' ? null : 'hist_net')}
                                      onClose={() => setOpenDropdownId(null)}
                                      optionCounts={histNetCounts}
                                      renderLabel={(val) => val !== 0 ? val.toLocaleString() : '-'}
                                      placeholder="ผลต่าง"
                                      dropdownWidth="w-48"
                                    />
                                  </th>
                                  {/* 7. Price */}
                                  <th className="px-2 py-2">
                                    <MultiSelectFilter
                                      title="บาท"
                                      options={histPriceOptions}
                                      selected={histSelPrice}
                                      onChange={setHistSelPrice}
                                      isOpen={openDropdownId === 'hist_price'}
                                      onToggle={() => setOpenDropdownId(openDropdownId === 'hist_price' ? null : 'hist_price')}
                                      onClose={() => setOpenDropdownId(null)}
                                      optionCounts={histPriceCounts}
                                      renderLabel={(val) => `${val.toLocaleString()} ฿`}
                                      placeholder="บาท"
                                      dropdownWidth="w-48"
                                    />
                                  </th>
                                  {/* 8. AddedBy */}
                                  <th className="px-2 py-2">
                                    <MultiSelectFilter
                                      title="ผู้ลงชื่อ"
                                      options={histAddedByOptions}
                                      selected={histSelAddedBy}
                                      onChange={setHistSelAddedBy}
                                      isOpen={openDropdownId === 'hist_added_by'}
                                      onToggle={() => setOpenDropdownId(openDropdownId === 'hist_added_by' ? null : 'hist_added_by')}
                                      onClose={() => setOpenDropdownId(null)}
                                      optionCounts={histAddedByCounts}
                                      placeholder="ผู้ลงชื่อ"
                                      dropdownWidth="w-56"
                                    />
                                  </th>
                                  {/* 9. Time */}
                                  <th className="px-2 py-2">
                                    <MultiSelectFilter
                                      title="เวลา"
                                      options={histTimeOptions}
                                      selected={histSelTime}
                                      onChange={setHistSelTime}
                                      isOpen={openDropdownId === 'hist_time'}
                                      onToggle={() => setOpenDropdownId(openDropdownId === 'hist_time' ? null : 'hist_time')}
                                      onClose={() => setOpenDropdownId(null)}
                                      optionCounts={histTimeCounts}
                                      placeholder="เวลา"
                                      dropdownWidth="w-48"
                                    />
                                  </th>
                                  <th className="px-2 py-2" />
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 bg-white text-slate-600 text-xs font-semibold">
                                {sortedDayProducts.length === 0 ? (
                                  <tr>
                                    <td colSpan={11} className="px-4 py-10 text-center text-slate-400 font-bold italic">
                                      ไม่พบรายการบันทึกที่ตรงตามเงื่อนไขค้นหา
                                    </td>
                                  </tr>
                                ) : (
                                  sortedDayProducts.map((p, index) => {
                                    const deptInfo = getUserDeptInfo(p.addedBy || '');
                                    return (
                                      <tr key={index} className={`${deptInfo.bgRow} border-b border-slate-100 transition-colors hover:bg-rose-50/20`}>
                                        <td className="px-4 py-3 text-center font-mono font-bold text-slate-400 text-[11px]">{index + 1}</td>
                                        <td className="px-4 py-3">
                                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black ${deptInfo.textColor} bg-slate-100`}>
                                            {deptInfo.name}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono font-extrabold text-[11px] text-slate-500">{p.code}</td>
                                        <td className="px-4 py-3 text-left font-bold text-slate-800 text-[11px] max-w-[200px] truncate" title={p.name}>{p.name}</td>
                                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-500">{p.multiQty.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-mono font-black text-[#ba191a]">+{p.plusQty.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right align-middle">
                                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-black ${
                                            p.overrideQty < 0 
                                              ? 'bg-rose-50 text-[#ba191a] border border-rose-100' 
                                              : p.overrideQty > 0 
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                                : 'bg-slate-50 text-slate-650 border border-slate-100'
                                          }`}>
                                            {p.overrideQty > 0 ? `+${p.overrideQty.toLocaleString()}` : p.overrideQty.toLocaleString()}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-right align-middle">
                                          <span className={`inline-block px-2 py-0.5 rounded font-mono font-black ${
                                            p.price < 0 
                                              ? 'bg-rose-50 text-[#ba191a]' 
                                              : p.price > 0 
                                                ? 'bg-emerald-50 text-emerald-700' 
                                                : 'text-slate-550'
                                          }`}>
                                            {p.price.toLocaleString()}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-left align-middle">
                                          <span className={`font-black ${deptInfo.textColor || 'text-slate-800'}`}>
                                            {p.addedBy?.split(' (')[0]}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-center font-mono text-[11px] text-slate-400 font-bold">{p.addedAt?.split(' ')[1] || p.addedAt}</td>
                                        <td className="px-4 py-3 text-center align-middle">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              triggerConfirm(
                                                "ลบประวัติรายการย่อยนี้",
                                                `คุณต้องการลบรายงานสินค้า ${p.code} - ${p.name} จากผู้ใช้ ${p.addedBy} ออกจากประวัติประจำวันใช่หรือไม่?`,
                                                () => {
                                                  const updatedProducts = dayProducts.filter(item => !(item.code === p.code && item.addedBy === p.addedBy));
                                                  const nextDB = {
                                                    ...historyDatabase,
                                                    [selectedHistoryDate]: updatedProducts
                                                  };
                                                  setHistoryDatabase(nextDB);
                                                  localStorage.setItem('farmhouse_presale_history', JSON.stringify(nextDB));
                                                  setSuccessMsg(`ลบประวัติรายการ ${p.code} เรียบร้อยแล้ว`);
                                                  setTimeout(() => setSuccessMsg(null), 3000);
                                                }
                                              );
                                            }}
                                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-[#ba191a] rounded cursor-pointer transition-colors"
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
