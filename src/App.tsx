/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  Sparkles, 
  Award, 
  HelpCircle, 
  FileCheck, 
  Database, 
  RefreshCw, 
  Info,
  Sliders,
  CheckCircle,
  Clock
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import RecipeConfigPanel from './components/RecipeConfigPanel';
import PresaleTable from './components/PresaleTable';
import DailyCards from './components/DailyCards';
import FinalSummaryTable from './components/FinalSummaryTable';
import FarmhouseLogo from './components/FarmhouseLogo';
import { Product, StoreFilterState, DailyCardData, FormulaType } from './types';
import { INITIAL_PRODUCTS, INITIAL_DAILY_DATA, CATEGORY_DEFINITIONS } from './data';

export default function App() {
  // Products management state
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('farmhouse_presale_products');
    return cached ? JSON.parse(cached) : INITIAL_PRODUCTS;
  });

  // Filters management state
  const [filters, setFilters] = useState<StoreFilterState>({
    productType: 'slice', // match screenshot starting context (sandwich/slice slice)
    searchCategory: '',
    selectedCategories: ['เดลี่แซนวิช', 'ขนมปังยอดตลอดครัมเล็ก', 'โดนัท', 'บราวนี่', 'สินค้าอายุยาว'], // pre-ticked matching UI list
    searchProduct: '',
    selectedProducts: INITIAL_PRODUCTS.map(p => p.id), // Initially select all so the workbook is prepopulated
    searchStoreGroup: '',
    selectedStoreGroups: ['10056', '10402'], // preloaded tags from screenshot
    selectedCustomerGroups: ['10', '20', '30', '40'], // preloaded
    selectedStoreTypes: ['ทุกวัน', 'เว้นวัน', 'สลับสัปดาห์', 'วันที่'],
    selectedGrades: ['AAA', 'AA', 'A', 'B'],
    selectedProfiles: ['1', '2', '4'],
  });

  // Daily cards metrics
  const [dailyData, setDailyData] = useState<DailyCardData[]>(INITIAL_DAILY_DATA);

  // Active recipes formula selection
  const [selectedFormula, setSelectedFormula] = useState<FormulaType | null>(null);

  // Reference to main scroll container to bounce view back up automatically
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selectedFormula && mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedFormula]);

  // Finalized presale result
  const [finalizedProducts, setFinalizedProducts] = useState<Product[] | null>(() => {
    const cached = localStorage.getItem('farmhouse_presale_finalized');
    return cached ? JSON.parse(cached) : null;
  });

  // Auto caching side effects
  useEffect(() => {
    localStorage.setItem('farmhouse_presale_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (finalizedProducts) {
      localStorage.setItem('farmhouse_presale_finalized', JSON.stringify(finalizedProducts));
    } else {
      localStorage.removeItem('farmhouse_presale_finalized');
    }
  }, [finalizedProducts]);

  // Product toggle checked state
  const handleToggleProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  // Toggle all visible products listed in current filtered view
  const handleToggleAllProducts = (checked: boolean) => {
    const visibleIds = getFilteredProducts().map(p => p.id);
    setProducts(prev => prev.map(p => visibleIds.includes(p.id) ? { ...p, selected: checked } : p));
  };

  // Delete selected products from the ACTIVE workbook
  const handleDeleteSelected = () => {
    setProducts(prev => prev.filter(p => !p.selected));
  };

  // Direct keyboard input override of PLUS_QTY values
  const handleUpdatePlusQtyDirectly = (id: string, newQty: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const overrideQty = newQty > 0 ? (newQty - p.multiQty) : -p.multiQty;
      return {
        ...p,
        plusQty: newQty,
        overrideQty,
        price: overrideQty * p.unitPrice
      };
    }));
  };

  // Formula formula calculations trigger
  const handleApplyFormula = (params: { val: number }) => {
    if (!selectedFormula) return;

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        // Only modify items checked (selected: true)
        if (!p.selected) return p;

        let nextPlusQty = p.plusQty;

        switch (selectedFormula) {
          case 'add_pieces':
            nextPlusQty = p.plusQty + params.val;
            break;
          case 'add_percent':
            // Added count calculated as percentage of MULTI_QTY basis
            nextPlusQty = Math.round(p.multiQty * (1 + params.val / 100));
            break;
          case 'add_first_min':
            nextPlusQty = Math.max(p.multiQty, params.val);
            break;
          case 'add_min_1':
            nextPlusQty = Math.max(1, p.multiQty + 1);
            break;
          case 'reduce_pieces':
            nextPlusQty = Math.max(0, p.plusQty - params.val);
            break;
          case 'reduce_percent':
            nextPlusQty = Math.max(0, Math.round(p.plusQty * (1 - params.val / 100)));
            break;
          case 'reduce_min_1':
            nextPlusQty = Math.max(1, p.plusQty - params.val);
            break;
          case 'reset_zero':
            nextPlusQty = 0;
            break;
          default:
            break;
        }

        // Recalculate override qty and total price matching specification
        const overrideQty = nextPlusQty > 0 ? (nextPlusQty - p.multiQty) : -p.multiQty;
        const price = overrideQty * p.unitPrice;

        return {
          ...p,
          plusQty: nextPlusQty,
          overrideQty,
          price
        };
      });
    });

    // Close the recipe config slider after calculating to clean up space
    setSelectedFormula(null);
  };

  // Save/Finalize active workbook changes to final table
  const handleSavePresale = () => {
    // Clone active products list into finalized state
    setFinalizedProducts([...products]);
  };

  // Clear/Reset entire board state to default templates
  const handleResetEntireBoard = () => {
    if (window.confirm("คุณต้องการรีเซ็ตแผนการคำนวณ Presale กลับเป็นค่าเริ่มต้นใช่หรือไม่?")) {
      setProducts(INITIAL_PRODUCTS);
      setFinalizedProducts(null);
      setSelectedFormula(null);
    }
  };

  // Handler to merge imported database catalogs into live states!
  const handleImportBaseProducts = (importedList: Partial<Product>[]) => {
    setProducts(prevProducts => {
      const nextList = prevProducts.map(existing => {
        const match = importedList.find(imported => imported.code === existing.code);
        if (match) {
          const nextUnitPrice = match.unitPrice !== undefined ? match.unitPrice : existing.unitPrice;
          return {
            ...existing,
            name: match.name || existing.name,
            unitPrice: nextUnitPrice,
            price: existing.overrideQty * nextUnitPrice
          };
        }
        return existing;
      });

      // Append new codes that were not in existing list
      const newlyAdded: Product[] = [];
      importedList.forEach(imported => {
        if (!imported.code) return;
        const exists = prevProducts.some(existing => existing.code === imported.code);
        if (!exists) {
          newlyAdded.push({
            id: `imported-${imported.code}`,
            code: imported.code,
            name: imported.name || `สินค้าใหม่ (${imported.code})`,
            category: 'เดลี่แซนวิช', // default category fallback
            multiQty: 0,
            plusQty: 0,
            overrideQty: 0,
            unitPrice: imported.unitPrice || 25,
            price: 0,
            delDate: '02/03/2026',
            selected: false
          });
        }
      });

      return [...nextList, ...newlyAdded];
    });
  };

  // Checkbox togglers inside daily columns cards
  const handleToggleCustomerGroupForDay = (dayIndex: number, groupCode: string) => {
    setDailyData(prev => prev.map((item, idx) => {
      if (idx !== dayIndex) return item;
      const nextGroups = item.selectedCustomerGroups.includes(groupCode)
        ? item.selectedCustomerGroups.filter(g => g !== groupCode)
        : [...item.selectedCustomerGroups, groupCode];
      return { ...item, selectedCustomerGroups: nextGroups };
    }));
  };

  const handleSetAllCustomerGroupsForDay = (dayIndex: number) => {
    setDailyData(prev => prev.map((item, idx) => {
      if (idx !== dayIndex) return item;
      return { ...item, selectedCustomerGroups: ['10', '20', '30', '40'] };
    }));
  };

  // Core filter logic matching selected tags from user interactive sidebar
  const getFilteredProducts = () => {
    return products.filter(p => {
      // Filter by main product type (piece, slice, long)
      if (filters.productType !== 'all') {
        const catDef = CATEGORY_DEFINITIONS.find(c => c.name === p.category);
        if (!catDef || catDef.type !== filters.productType) {
          return false;
        }
      }

      // Filter by selected categories list
      if (filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(p.category)) {
          return false;
        }
      }

      return true;
    });
  };

  // Computations for active summary variables to supply daily tiles
  const activeFilteredProducts = getFilteredProducts();
  const totalPriceAmt = activeFilteredProducts.reduce((sum, p) => sum + p.price, 0);
  const totalOverrideQty = activeFilteredProducts.reduce((sum, p) => sum + p.overrideQty, 0);
  const selectedCount = activeFilteredProducts.filter(p => p.selected).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* BRAND HEADER BAR */}
      <header className="bg-[#ba191a] text-white h-16 shadow-md flex items-center justify-between px-6 shrink-0 relative z-30">
        <div className="flex items-center gap-4">
          {/* Authentic Farmhouse Brand Logo matching specification */}
          <FarmhouseLogo />
        </div>

        {/* User profile with placeholder dropdown */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-100 font-sans tracking-wide">USER123</div>
          </div>
          <div className="relative group cursor-pointer">
            <div className="h-9 w-9 rounded-full bg-orange-400 text-white flex items-center justify-center font-black border-2 border-white/60 shadow-md group-hover:scale-105 transition-all">
              TH
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-red-600 shadow-sm animate-pulse"></span>
          </div>
        </div>
      </header>

      {/* THREE PANELS LAYOUT CONTAINER */}
      <div className="flex grow overflow-hidden">
        
        {/* LEFT COLUMN: CONTROL AND SELECTION SLIDERS */}
        <Sidebar
          products={products}
          filters={filters}
          onChangeFilters={setFilters}
          onSelectFormula={setSelectedFormula}
          selectedCount={selectedCount}
          onToggleProduct={handleToggleProduct}
          onToggleAllProducts={handleToggleAllProducts}
        />

        {/* MIDDLE/RIGHT EXPANSIVE SPACE */}
        <main ref={mainRef} className="flex-1 p-6 space-y-6 overflow-y-auto h-[calc(100vh-64px)] bg-[#f7f9fa] pb-16">
          
          {/* DYNAMIC FORMULA CONFIG BANNER */}
          <RecipeConfigPanel
            selectedFormula={selectedFormula}
            products={products}
            filters={filters}
            onSaveBatch={(updatedProducts) => {
              setProducts(updatedProducts);
            }}
            onClearFormula={() => setSelectedFormula(null)}
            selectedCount={selectedCount}
          />

          {/* CENTRAL ACTION WORKBOOK TABLE */}
          <PresaleTable
            products={activeFilteredProducts}
            onToggleProduct={handleToggleProduct}
            onToggleAllProducts={handleToggleAllProducts}
            onDeleteSelected={handleDeleteSelected}
            onUpdatePlusQtyDirectly={handleUpdatePlusQtyDirectly}
            onSavePresale={handleSavePresale}
            onImportBaseProducts={handleImportBaseProducts}
            onResetAllData={handleResetEntireBoard}
          />

          {/* DAILY TILES DISPLAYING OUTCOMES COMPARED */}
          <div className="my-6">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4.5 h-4.5 text-[#ba191a]" />
              <h3 className="font-extrabold text-[#ba191a] text-sm uppercase tracking-wider">
                วิเคราะห์ประมาณการจัดส่งประประจำวัน (Daily Dispatch Forecasts)
              </h3>
            </div>
            <DailyCards
              dailyData={dailyData}
              onToggleCustomerGroupForDay={handleToggleCustomerGroupForDay}
              onSetAllCustomerGroupsForDay={handleSetAllCustomerGroupsForDay}
              totalPriceAmt={totalPriceAmt}
              totalOverrideQty={totalOverrideQty}
            />
          </div>

          {/* FINAL SUMMARY REPORT TABLE (REVEALED AND PERSISTENT ON SAVE) */}
          <div className="pt-4 border-t border-slate-200">
            <FinalSummaryTable finalizedProducts={finalizedProducts} />
          </div>

        </main>
      </div>
    </div>
  );
}
