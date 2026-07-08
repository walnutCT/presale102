/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { 
  Upload, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Layers, 
  Sliders, 
  RotateCcw,
  Download
} from 'lucide-react';
import { StoreFilterState, FormulaType, Product } from '../types';
import { CATEGORY_DEFINITIONS, CUSTOMER_GROUPS, STORE_TYPES, GRADES, STORE_PROFILES } from '../data';

interface SidebarProps {
  products: Product[];
  filters: StoreFilterState;
  onChangeFilters: (f: StoreFilterState) => void;
  onSelectFormula: (formula: FormulaType) => void;
  selectedCount: number;
  onToggleProduct: (id: string) => void;
  onToggleAllProducts: (checked: boolean) => void;
}

export default function Sidebar({
  products,
  filters,
  onChangeFilters,
  onSelectFormula,
  selectedCount,
  onToggleProduct,
  onToggleAllProducts
}: SidebarProps) {
  // Toggle states for collapsible panels
  const [openSection, setOpenSection] = useState<{ [key: string]: boolean }>({
    upload: true,
    manual: true,
    products: true,
    stores: true,
    formulas: true,
  });

  const toggleSection = (section: string) => {
    setOpenSection(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // State for simulated file upload status
  const [dragActive, setDragActive] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateFileUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateFileUpload(file);
    }
  };

  const simulateFileUpload = (file: File) => {
    setUploadMessage(`อัพโหลด ${file.name} สำเร็จ! (พบข้อมูล 15 รายการ)`);
    setTimeout(() => {
      setUploadMessage(null);
    }, 4000);
  };

  // Helpers to fetch visible categories list under selected "productType" button
  const getVisibleCategories = () => {
    return CATEGORY_DEFINITIONS.filter(cat => {
      // Filter by type button
      if (filters.productType !== 'all' && cat.type !== filters.productType) {
        return false;
      }
      // Filter by search bar
      if (filters.searchCategory && !cat.name.toLowerCase().includes(filters.searchCategory.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const visibleCategories = getVisibleCategories();

  // Multi-select helper functions
  const toggleCategory = (catName: string) => {
    const nextCats = filters.selectedCategories.includes(catName)
      ? filters.selectedCategories.filter(c => c !== catName)
      : [...filters.selectedCategories, catName];
    onChangeFilters({ ...filters, selectedCategories: nextCats });
  };

  const clearCategoryTag = (catName: string) => {
    onChangeFilters({
      ...filters,
      selectedCategories: filters.selectedCategories.filter(c => c !== catName),
    });
  };

  // Toggle all visible categories
  const handleToggleAllCategories = () => {
    const visibleNames = visibleCategories.map(c => c.name);
    const allSelected = visibleNames.every(name => filters.selectedCategories.includes(name));
    
    let nextCats: string[];
    if (allSelected) {
      // Remove visible categories
      nextCats = filters.selectedCategories.filter(name => !visibleNames.includes(name));
    } else {
      // Add all visible categories
      nextCats = Array.from(new Set([...filters.selectedCategories, ...visibleNames]));
    }
    onChangeFilters({ ...filters, selectedCategories: nextCats });
  };

  const getVisibleProducts = () => {
    return products.filter(p => {
      // Search Box filter
      if (filters.searchProduct) {
        const query = filters.searchProduct.toLowerCase().trim();
        const match = p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query);
        if (!match) return false;
      }

      // Selected Category filter
      if (filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(p.category)) {
          return false;
        }
      } else {
        // If no categories are explicitly queried, but a productType tab is clicked, constrain to categories with that type
        if (filters.productType !== 'all') {
          const parentCat = CATEGORY_DEFINITIONS.find(cat => cat.name === p.category);
          if (!parentCat || parentCat.type !== filters.productType) return false;
        }
      }

      return true;
    });
  };

  const visibleProducts = getVisibleProducts();

  // Handle product list check/uncheck
  const toggleProductSelection = (productId: string) => {
    const nextProducts = filters.selectedProducts.includes(productId)
      ? filters.selectedProducts.filter(id => id !== productId)
      : [...filters.selectedProducts, productId];
    onChangeFilters({ ...filters, selectedProducts: nextProducts });
  };

  const handleToggleAllVisibleProducts = () => {
    const visibleIds = visibleProducts.map(p => p.id);
    const allSelected = visibleIds.every(id => filters.selectedProducts.includes(id));

    let nextProducts: string[];
    if (allSelected) {
      nextProducts = filters.selectedProducts.filter(id => !visibleIds.includes(id));
    } else {
      nextProducts = Array.from(new Set([...filters.selectedProducts, ...visibleIds]));
    }
    onChangeFilters({ ...filters, selectedProducts: nextProducts });
  };

  const toggleCustomerGroup = (grp: string) => {
    const nextGrps = filters.selectedCustomerGroups.includes(grp)
      ? filters.selectedCustomerGroups.filter(g => g !== grp)
      : [...filters.selectedCustomerGroups, grp];
    onChangeFilters({ ...filters, selectedCustomerGroups: nextGrps });
  };

  const toggleStoreType = (type: string) => {
    const nextTypes = filters.selectedStoreTypes.includes(type)
      ? filters.selectedStoreTypes.filter(t => t !== type)
      : [...filters.selectedStoreTypes, type];
    onChangeFilters({ ...filters, selectedStoreTypes: nextTypes });
  };

  const toggleGrade = (grade: string) => {
    const nextGrades = filters.selectedGrades.includes(grade)
      ? filters.selectedGrades.filter(g => g !== grade)
      : [...filters.selectedGrades, grade];
    onChangeFilters({ ...filters, selectedGrades: nextGrades });
  };

  const toggleProfile = (id: string) => {
    const nextProfiles = filters.selectedProfiles.includes(id)
      ? filters.selectedProfiles.filter(p => p !== id)
      : [...filters.selectedProfiles, id];
    onChangeFilters({ ...filters, selectedProfiles: nextProfiles });
  };

  // Helper to add store codes manually (badges)
  const [storeInput, setStoreInput] = useState('');
  const handleStoreKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && storeInput.trim()) {
      e.preventDefault();
      const code = storeInput.trim();
      if (!filters.selectedStoreGroups.includes(code)) {
        onChangeFilters({
          ...filters,
          selectedStoreGroups: [...filters.selectedStoreGroups, code],
        });
      }
      setStoreInput('');
    }
  };

  const removeStoreTag = (code: string) => {
    onChangeFilters({
      ...filters,
      selectedStoreGroups: filters.selectedStoreGroups.filter(c => c !== code),
    });
  };

  return (
    <aside className="w-80 shrink-0 bg-[#fbfcfd] border-r border-slate-200 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar pb-10 shadow-sm text-sm">
      
      {/* SECTION 1: UPLOAD FILE BAR MATCHING SPEC */}
      <div className="bg-[#ba191a] text-white px-4 py-1.5 font-extrabold tracking-widest text-[10px] uppercase flex items-center justify-between shadow-inner select-none">
        <span>UPLODE FILE</span>
        <span className="px-1.5 py-0.5 bg-[#941014] rounded text-[9px] font-black tracking-normal">IMPORT MODES</span>
      </div>
      <div className="p-4 border-b border-slate-100 flex flex-col gap-2 bg-white">
        {/* Pink action button */}
        <button
          type="button"
          onClick={() => onSelectFormula('upload_file')}
          className="w-full py-2.5 bg-[#ffebeb] border border-[#ff9c9c] hover:bg-[#ffd1d1] font-black text-slate-800 text-[13px] rounded-2xl shadow-sm transition-all text-center cursor-pointer select-none"
        >
          อัพโหลดไฟล์
        </button>
      </div>

      {/* MANUAL CONTROLS LABEL */}
      <div className="bg-[#ba191a] text-white px-4 py-1.5 font-extrabold tracking-widest text-[10px] uppercase flex items-center justify-between shadow-inner">
        <span>MANUAL SETUP</span>
        <span className="px-1.5 py-0.5 bg-[#941014] rounded text-[9px] font-black tracking-normal">ACTIVE MODES</span>
      </div>

      {/* SECTION 2: 1. เลือกสินค้า (PRODUCT SELECTION WITH LEVEL 1, 2, 3) */}
      <div className="border-b border-slate-100">
        <button
          onClick={() => toggleSection('products')}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/75 font-black text-slate-800 bg-white"
        >
          <span className="flex items-center gap-2 text-slate-800 uppercase tracking-tight text-xs">
            <Layers className="w-4.5 h-4.5 text-red-650" />
            <span>1. เลือกสินค้า</span>
          </span>
          {openSection.products ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSection.products && (
          <div className="px-4 pb-5 space-y-4 bg-white">
            
            {/* LEVEL 1: BUTTONS ROWS (ทุกประเภท, ชิ้น, แผ่น, อายุยาว) */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                1. ประเภทสินค้าหลัก (Type Segment)
              </label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-lg border border-slate-200/50">
                {(['all', 'piece', 'slice', 'long'] as const).map(tab => {
                  const labelMap = { all: 'ทุกประเภท', piece: 'ชิ้น', slice: 'แผ่น', long: 'อายุยาว' };
                  const isActive = filters.productType === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        const targetCats = tab === 'all'
                          ? CATEGORY_DEFINITIONS.map(c => c.name)
                          : CATEGORY_DEFINITIONS.filter(c => c.type === tab).map(c => c.name);
                        onChangeFilters({
                          ...filters,
                          productType: tab,
                          selectedCategories: targetCats
                        });
                      }}
                      className={`py-1.5 text-center font-extrabold rounded text-[10px] md:text-[11px] transition-all truncate cursor-pointer ${
                        isActive
                          ? 'bg-red-600 text-white shadow-sm font-black scale-[1.02]'
                          : 'text-slate-650 hover:text-slate-900 font-bold'
                      }`}
                    >
                      {labelMap[tab]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LEVEL 2: ประเภทสินค้า (CATEGORIES CHECKBOXES) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                2. ประเภทสินค้า (Category)
              </label>
              
              {/* Search Category Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="ค้นหารหัสประเภทสินค้า..."
                  className="w-full pl-8 pr-3 py-1.8 bg-slate-50 border border-slate-200 rounded focus:border-red-500 focus:outline-none text-[11px] font-semibold text-slate-700"
                  value={filters.searchCategory}
                  onChange={e => onChangeFilters({ ...filters, searchCategory: e.target.value })}
                />
              </div>

              {/* Checkboxes Wrapper */}
              <div className="border border-slate-200 rounded p-2 max-h-36 overflow-y-auto no-scrollbar space-y-1 bg-slate-50/50">
                <label className="flex items-center gap-2 cursor-pointer pb-1.5 border-b border-slate-100 select-none">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-red-650 focus:ring-red-500 h-3.5 w-3.5"
                    checked={visibleCategories.length > 0 && visibleCategories.every(cat => filters.selectedCategories.includes(cat.name))}
                    onChange={handleToggleAllCategories}
                  />
                  <span className="text-[11px] font-black text-slate-800">ทุกประเภทสินค้า</span>
                  <span className="ml-auto text-[9px] bg-slate-200 text-slate-600 px-1 rounded font-bold">
                    {visibleCategories.length}
                  </span>
                </label>

                {visibleCategories.map(cat => {
                  const isChecked = filters.selectedCategories.includes(cat.name);
                  return (
                    <label 
                      key={cat.code} 
                      className="flex items-center gap-2 cursor-pointer py-0.5 hover:bg-slate-100/70 px-1 rounded transition-colors select-none"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-red-655 focus:ring-red-500 h-3.5 w-3.5"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat.name)}
                      />
                      <div className="flex flex-col text-left leading-normal">
                        <span className="text-[11px] font-bold text-slate-700">{cat.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold leading-none">{cat.code} : {cat.subLabel}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* LEVEL 2 SELECTED BADGES BOX */}
              <div className="border border-teal-150/50 rounded p-2.5 bg-teal-50/10 min-h-[46px] flex flex-wrap gap-1">
                <div className="text-[9px] font-black text-teal-800 tracking-wide uppercase w-full mb-1">
                  ประเภทสินค้าที่เลือกแล้ว:
                </div>
                {filters.selectedCategories.length === 0 ? (
                  <span className="text-[10px] text-slate-400 italic">ไม่ได้เลือกประเภทส่งผลให้แสดงผลสินค้าทั้งหมด</span>
                ) : (
                  filters.selectedCategories.map(catName => (
                    <span
                      key={catName}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-100 text-[10px] font-semibold"
                    >
                      <span>{catName}</span>
                      <button 
                        type="button" 
                        onClick={() => clearCategoryTag(catName)}
                        className="hover:bg-red-200/50 rounded-full p-0.5 cursor-pointer text-[9px]"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* LEVEL 3: รหัสสินค้า (PRODUCTS CHECKBOXES LIST) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                3. รหัสสินค้า (Product Items checklist)
              </label>

              {/* Product Search Code */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="ค้นหารหัสสินค้า..."
                  className="w-full pl-8 pr-3 py-1.8 bg-slate-50 border border-slate-200 rounded focus:border-red-500 focus:outline-none text-[11px] font-semibold text-slate-700"
                  value={filters.searchProduct}
                  onChange={e => onChangeFilters({ ...filters, searchProduct: e.target.value })}
                />
              </div>

              {/* Checklist container for products */}
              <div className="border border-slate-200 rounded p-2 max-h-48 overflow-y-auto no-scrollbar space-y-1 bg-slate-50/50">
                <label className="flex items-center gap-2 cursor-pointer pb-1.5 border-b border-slate-100 select-none">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-red-650 focus:ring-red-500 h-3.5 w-3.5"
                    checked={visibleProducts.length > 0 && visibleProducts.every(p => p.selected)}
                    onChange={(e) => onToggleAllProducts(e.target.checked)}
                  />
                  <span className="text-[11px] font-black text-slate-800">เลือกสินค้าทั้งหมด</span>
                  <span className="ml-auto text-[9px] bg-slate-200 text-slate-600 px-1.5 rounded font-black font-mono">
                    {visibleProducts.length}
                  </span>
                </label>

                {visibleProducts.map(p => {
                  const isChecked = p.selected;
                  const catDef = CATEGORY_DEFINITIONS.find(c => c.name === p.category);
                  const subtextLabel = catDef ? `${p.code} : ${catDef.subLabel}` : `${p.code}`;

                  return (
                    <label 
                      key={p.id} 
                      className="flex items-center gap-2 cursor-pointer py-1 px-1 rounded hover:bg-slate-100/70 transition-colors select-none"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-red-650 focus:ring-red-500 h-3.5 w-3.5"
                        checked={isChecked}
                        onChange={() => onToggleProduct(p.id)}
                      />
                      <div className="flex flex-col text-left leading-tight">
                        <span className="text-[11px] font-black text-slate-700">{p.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold">{subtextLabel}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 3: 2. ตัวกรองร้านค้า (STORE FILTERS SECT) */}
      <div className="border-b border-slate-100">
        <button
          onClick={() => toggleSection('stores')}
          className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/75 font-black text-slate-800 bg-white"
        >
          <span className="flex items-center gap-2 text-slate-800 uppercase tracking-tight text-xs">
            <Filter className="w-4.5 h-4.5 text-red-600" />
            <span>2. ตัวกรองร้านค้า</span>
          </span>
          {openSection.stores ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSection.stores && (
          <div className="px-4 pb-5 space-y-4 bg-white">
            
            {/* Input tag selection box for Store Groups */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1">
                รหัสลูกค้า... (5หลัก)
              </label>
              <input
                type="text"
                placeholder="พิมพ์รหัสร้านค้าแล้วกด Enter..."
                className="w-full px-2.5 py-1.8 bg-slate-50 border border-slate-200 rounded focus:border-red-500 focus:outline-[#ba191a]/10 text-xs text-slate-700 font-bold"
                value={storeInput}
                onChange={e => setStoreInput(e.target.value)}
                onKeyDown={handleStoreKeyDown}
              />
              
              {/* STORE BADGES PRE-SELECTED BOX */}
              <div className="mt-2 border border-orange-100 rounded p-2 bg-orange-50/10 min-h-[46px] flex flex-wrap gap-1">
                <div className="text-[9px] font-black text-orange-850 uppercase tracking-wide w-full mb-0.5">
                  ประเภทลูกค้าที่เลือกแล้ว:
                </div>
                {filters.selectedStoreGroups.length === 0 ? (
                  <span className="text-[10px] text-slate-400 italic">ไม่มีข้อมูลการเลือกแบรนด์ร้าน</span>
                ) : (
                  filters.selectedStoreGroups.map(code => (
                    <span
                      key={code}
                      className="inline-flex items-center gap-1.2 px-2 py-0.5 rounded bg-orange-60 text-orange-900 border border-orange-200 text-[10px] font-black font-mono shadow-sm bg-orange-100"
                    >
                      {code}
                      <button 
                        type="button"
                        onClick={() => removeStoreTag(code)} 
                        className="text-orange-500 hover:text-orange-800 font-black cursor-pointer text-[9px]"
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* CUSTOMER GROUPS LIST */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1">
                กลุ่มลูกค้าทั้งหมด (CUSTOMER GRAPH)
              </label>
              <div className="border border-slate-200 rounded p-2 max-h-36 overflow-y-auto no-scrollbar space-y-1 bg-slate-50/50">
                <label className="flex items-center gap-2 cursor-pointer pb-1.5 border-b border-slate-100 select-none">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-red-650 focus:ring-red-500 h-3.5 w-3.5"
                    checked={CUSTOMER_GROUPS.every(grp => filters.selectedCustomerGroups.includes(grp.code))}
                    onChange={() => {
                      const allSelected = CUSTOMER_GROUPS.every(grp => filters.selectedCustomerGroups.includes(grp.code));
                      const next = allSelected ? [] : CUSTOMER_GROUPS.map(g => g.code);
                      onChangeFilters({ ...filters, selectedCustomerGroups: next });
                    }}
                  />
                  <span className="text-[11px] font-black text-slate-800">กลุ่มลูกค้าทั้งหมด</span>
                  <span className="ml-auto text-[9px] bg-slate-200 text-slate-500 px-1 rounded font-bold font-mono">
                    {CUSTOMER_GROUPS.length}
                  </span>
                </label>

                {CUSTOMER_GROUPS.map(grp => {
                  const isChecked = filters.selectedCustomerGroups.includes(grp.code);
                  return (
                    <label key={grp.code} className="flex items-center gap-2 cursor-pointer py-0.5 hover:bg-slate-100 px-1 rounded transition-all select-none">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-red-650 focus:ring-red-500 h-3.5 w-3.5"
                        checked={isChecked}
                        onChange={() => toggleCustomerGroup(grp.code)}
                      />
                      <span className="text-[11px] text-slate-800 font-extrabold">{grp.code}</span>
                      <span className="text-[9px] text-slate-400 font-bold">({grp.name})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* STORE TYPE CHECKBOXS LIMITS */}
            <div>
              <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1">
                ประเภทย่อยร้านค้า
              </label>
              <div className="border border-slate-200 rounded p-2 max-h-32 overflow-y-auto no-scrollbar space-y-1 bg-slate-50/50">
                {STORE_TYPES.map(type => {
                  const isChecked = filters.selectedStoreTypes.includes(type);
                  return (
                    <label key={type} className="flex items-center gap-2 cursor-pointer py-0.5 hover:bg-slate-100 px-1 rounded transition-all select-none">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-red-650 focus:ring-red-500 h-3.5 w-3.5"
                        checked={isChecked}
                        onChange={() => toggleStoreType(type)}
                      />
                      <span className="text-xs text-slate-650 font-bold">{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Store Grade & Profiles stacked visually */}
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1">เกรด</label>
                <div className="border border-slate-200 rounded p-1.5 max-h-24 overflow-y-auto no-scrollbar space-y-0.5 bg-slate-50/50">
                  {GRADES.map(grade => {
                    const isChecked = filters.selectedGrades.includes(grade);
                    return (
                      <label key={grade} className="flex items-center gap-1.5 cursor-pointer py-0.5 hover:bg-slate-100 px-1 rounded transition-all text-[11px] select-none">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-red-650 h-3 w-3"
                          checked={isChecked}
                          onChange={() => toggleGrade(grade)}
                        />
                        <span className="font-extrabold text-slate-700">{grade}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1">Profile</label>
                <div className="border border-slate-200 rounded p-1.5 max-h-28 overflow-y-auto no-scrollbar space-y-1 bg-slate-50/50">
                  {STORE_PROFILES.map(profile => {
                    const isChecked = filters.selectedProfiles.includes(profile.id);
                    return (
                      <label key={profile.id} className="flex items-start gap-1.5 cursor-pointer py-1 hover:bg-slate-100 px-1.5 rounded transition-all text-[11px] select-none" title={profile.label}>
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-red-650 h-3.5 w-3.5 mt-0.5 shrink-0"
                          checked={isChecked}
                          onChange={() => toggleProfile(profile.id)}
                        />
                        <span className="font-black text-slate-700 leading-normal" title={profile.label}>{profile.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* SECTION 4: เลือกสูตรคำนวณและปรับยอด (RECIPE FORMULAS) */}
      <div className="border-b border-slate-100">
        <button
          onClick={() => toggleSection('formulas')}
          className="w-full flex items-center justify-between px-4 py-3.5 bg-red-50/20 hover:bg-slate-50/70 font-black text-[#ba191a]"
        >
          <span className="flex items-center gap-2 uppercase tracking-tight text-xs">
            <Sliders className="w-4.5 h-4.5" />
            <span>3. สูตรปรับยอด PRESALE</span>
          </span>
          {openSection.formulas ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </button>

        {openSection.formulas && (
          <div className="p-4 space-y-4 bg-white">
            
            {/* ADD PRODUCT */}
            <div>
              <div className="text-[10px] font-black text-emerald-800 tracking-wider uppercase mb-1.5 border-b border-emerald-100 pb-1">
                + เพิ่มสินค้า (INCREASE FORMULA)
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectFormula('add_pieces')}
                  className="w-full text-left px-3 py-2 bg-white hover:bg-red-50/35 border border-slate-200 hover:border-red-300 rounded font-black text-slate-700 text-xs shadow-sm transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>เพิ่มแบบจำนวนชิ้น</span>
                  <span className="text-[9px] bg-red-100 text-red-800 font-extrabold px-1.5 py-0.5 rounded shadow-sm">+ QTY</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFormula('add_percent')}
                  className="w-full text-left px-3 py-2 bg-white hover:bg-red-50/35 border border-slate-200 hover:border-red-300 rounded font-black text-slate-700 text-xs shadow-sm transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>เพิ่มแบบร้อยละ (%)</span>
                  <span className="text-[9px] bg-red-100 text-red-800 font-extrabold px-1.5 py-0.5 rounded shadow-sm">+ %</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFormula('add_first_min')}
                  className="w-full text-left px-3 py-2 bg-white hover:bg-teal-50/40 border border-slate-200 hover:border-teal-300 rounded font-black text-slate-700 text-xs shadow-sm transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>เพิ่มแบบจำนวน First Min</span>
                  <span className="text-[9px] bg-teal-100 text-teal-850 font-extrabold px-1.5 py-0.5 rounded shadow-sm">F-MIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFormula('add_min_1')}
                  className="w-full text-left px-3 py-2 bg-white hover:bg-teal-50/40 border border-slate-200 hover:border-teal-300 rounded font-black text-slate-700 text-xs shadow-sm transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>เพิ่มแบบขั้นต่ำ Min 1</span>
                  <span className="text-[9px] bg-teal-100 text-teal-850 font-extrabold px-1.5 py-0.5 rounded shadow-sm">MIN 1</span>
                </button>
              </div>
            </div>

            {/* REDUCE PRODUCT */}
            <div>
              <div className="text-[10px] font-black text-rose-800 tracking-wider uppercase mb-1.5 border-b border-rose-100 pb-1">
                - ลดสินค้า (DECREASE FORMULA)
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectFormula('reduce_pieces')}
                  className="w-full text-left px-3 py-2 bg-white hover:bg-rose-50/30 border border-slate-200 hover:border-rose-300 rounded font-black text-slate-700 text-xs shadow-sm transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>ลดแบบจำนวนชิ้น</span>
                  <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded shadow-sm">- QTY</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFormula('reduce_percent')}
                  className="w-full text-left px-3 py-2 bg-white hover:bg-rose-50/30 border border-slate-200 hover:border-rose-300 rounded font-black text-slate-700 text-xs shadow-sm transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>ลดแบบร้อยละ (-%)</span>
                  <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded shadow-sm">-%</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFormula('reduce_min_1')}
                  className="w-full text-left px-3 py-2 bg-white hover:bg-rose-50/30 border border-slate-200 hover:border-rose-300 rounded font-black text-slate-700 text-xs shadow-sm transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>ลดแบบขั้นต่ำ Min 1</span>
                  <span className="text-[9px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded shadow-sm">-MIN</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectFormula('reset_zero')}
                  className="w-full text-left px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 rounded text-amber-900 font-black text-xs shadow-sm transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>ลดและจัดเซต 0 ทั้งหมด</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.5 rounded shadow-sm">SET 0</span>
                </button>
              </div>
            </div>


          </div>
        )}
      </div>
    </aside>
  );
}

// Helper to bundle push array uniqueness
function nextCatsArrayUnion(arr: string[], items: string[]) {
  items.forEach(itm => {
    if (!arr.includes(itm)) arr.push(itm);
  });
}
