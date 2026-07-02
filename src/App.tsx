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
  Clock,
  Users,
  Shield,
  Trash2,
  Plus,
  UserCheck
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import RecipeConfigPanel from './components/RecipeConfigPanel';
import PresaleTable from './components/PresaleTable';
import DailyCards from './components/DailyCards';
import FinalSummaryTable from './components/FinalSummaryTable';
import FarmhouseLogo from './components/FarmhouseLogo';
import LoginPage from './components/LoginPage';
import UserManagement from './components/UserManagement';
import { Product, StoreFilterState, DailyCardData, FormulaType, User } from './types';
import { INITIAL_PRODUCTS, INITIAL_DAILY_DATA, CATEGORY_DEFINITIONS, INITIAL_USERS } from './data';

export default function App() {
  // User Accounts list state (persisted in localStorage)
  const [users, setUsers] = useState<User[]>(() => {
    const cached = localStorage.getItem('farmhouse_users');
    if (cached) {
      try {
        return JSON.parse(cached) as User[];
      } catch (e) {
        return INITIAL_USERS as User[];
      }
    }
    localStorage.setItem('farmhouse_users', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS as User[];
  });

  // Authentication access control state (Session-scoped for excellent UX)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('farmhouse_logged_in') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const cached = sessionStorage.getItem('farmhouse_current_user');
    if (cached) {
      try {
        return JSON.parse(cached) as User;
      } catch (e) {
        return null;
      }
    }
    // Backward compatibility fallback
    if (sessionStorage.getItem('farmhouse_logged_in') === 'true') {
      const uname = sessionStorage.getItem('farmhouse_username') || 'Admin';
      return {
        username: uname,
        pass: '1234',
        level: uname.toLowerCase() === 'admin' ? 1 : 2,
        roleName: uname.toLowerCase() === 'admin' ? 'Admin' : 'Manager',
        description: ''
      };
    }
    return null;
  });

  // Products management state
  const [products, setProducts] = useState<Product[]>(() => {
    const cachedUser = sessionStorage.getItem('farmhouse_current_user');
    let username = '';
    if (cachedUser) {
      try {
        username = JSON.parse(cachedUser).username;
      } catch (e) {}
    }
    const key = username ? `farmhouse_presale_products_v3_${username}` : 'farmhouse_presale_products_v3';
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Product[];
        const cachedCodes = new Set(parsed.map(p => p.code));
        const missing = INITIAL_PRODUCTS.filter(p => !cachedCodes.has(p.code));
        if (missing.length > 0) {
          return [...parsed, ...missing];
        }
        return parsed;
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    // Clean old caches
    localStorage.removeItem('farmhouse_presale_products');
    return INITIAL_PRODUCTS;
  });

  // Filters management state
  const [filters, setFilters] = useState<StoreFilterState>({
    productType: 'slice', // match screenshot starting context (sandwich/slice slice)
    searchCategory: '',
    selectedCategories: ['ขนมปังแผ่นทั่วไป', 'ขนมปังโฮลวีต', 'ขนมปังแถวพรีเมียม', 'ขนมปังแถวมีไส้'], // pre-ticked matching UI list
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

  // Active Work Date
  const [currentDate, setCurrentDate] = useState<string>(() => {
    const todayStr = (() => {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    })();
    return localStorage.getItem('farmhouse_current_date') || todayStr;
  });

  // Automated "New Day Detection and System Reset"
  useEffect(() => {
    const todayStr = (() => {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    })();

    const storedDate = localStorage.getItem('farmhouse_current_date');
    if (storedDate && storedDate !== todayStr) {
      // Auto-reset everything for the new day
      setCurrentDate(todayStr);
      localStorage.setItem('farmhouse_current_date', todayStr);

      setProducts(INITIAL_PRODUCTS);
      const cachedUser = sessionStorage.getItem('farmhouse_current_user');
      let username = '';
      if (cachedUser) {
        try {
          username = JSON.parse(cachedUser).username;
        } catch (e) {}
      }
      const key = username ? `farmhouse_presale_products_v3_${username}` : 'farmhouse_presale_products_v3';
      localStorage.setItem(key, JSON.stringify(INITIAL_PRODUCTS));

      setFinalizedProducts(null);
      localStorage.removeItem('farmhouse_presale_finalized_products');
      localStorage.removeItem('farmhouse_presale_finalized');

      setIsFormulaApproved(false);
      localStorage.setItem('farmhouse_formula_approved', 'false');

      setSelectedFormula(null);
    } else if (!storedDate) {
      localStorage.setItem('farmhouse_current_date', todayStr);
    }
  }, []);

  const formatThaiDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]) + 543; // Buddhist Era
        const monthNames = [
          'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];
        const monthIndex = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        return `วันส่งสินค้า: ${day} ${monthNames[monthIndex]} ${year}`;
      }
    } catch (e) {
      // fallback
    }
    return `วันส่งสินค้า: ${dateStr}`;
  };

  const formatDDMMYYYY = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (e) {
      // ignore
    }
    return dateStr;
  };

  const getCurrentFormattedDateTime = () => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  // Reference to main scroll container to bounce view back up automatically
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selectedFormula && mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedFormula]);

  // Finalized presale result
  const [finalizedProducts, setFinalizedProducts] = useState<Product[] | null>(() => {
    const cached = localStorage.getItem('farmhouse_presale_finalized_products') || localStorage.getItem('farmhouse_presale_finalized');
    return cached ? JSON.parse(cached) : null;
  });

  // Auto caching side effects (segmented by current user)
  useEffect(() => {
    const username = currentUser?.username || '';
    const key = username ? `farmhouse_presale_products_v3_${username}` : 'farmhouse_presale_products_v3';
    localStorage.setItem(key, JSON.stringify(products));
  }, [products, currentUser]);

  // Load products of the current user when currentUser switches
  useEffect(() => {
    const username = currentUser?.username || '';
    const key = username ? `farmhouse_presale_products_v3_${username}` : 'farmhouse_presale_products_v3';
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Product[];
        const cachedCodes = new Set(parsed.map(p => p.code));
        const missing = INITIAL_PRODUCTS.filter(p => !cachedCodes.has(p.code));
        if (missing.length > 0) {
          setProducts([...parsed, ...missing]);
        } else {
          setProducts(parsed);
        }
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
  }, [currentUser]);

  const productsWithCurrentDate = products.map(p => ({
    ...p,
    delDate: formatDDMMYYYY(currentDate)
  }));

  useEffect(() => {
    if (finalizedProducts) {
      localStorage.setItem('farmhouse_presale_finalized', JSON.stringify(finalizedProducts));
    } else {
      localStorage.removeItem('farmhouse_presale_finalized');
    }
  }, [finalizedProducts]);

  // Formula Approval State ("อนุมัติสูตร" duty for Manager and Admin)
  const [isFormulaApproved, setIsFormulaApproved] = useState<boolean>(() => {
    return localStorage.getItem('farmhouse_formula_approved') === 'true';
  });

  const handleApproveFormula = (approved: boolean) => {
    setIsFormulaApproved(approved);
    localStorage.setItem('farmhouse_formula_approved', String(approved));
  };

  // Tab navigation state for Admin (Level 1) view switching
  const [activeTab, setActiveTab] = useState<'presale' | 'users'>('presale');

  const handleAddUser = (newUser: User) => {
    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    localStorage.setItem('farmhouse_users', JSON.stringify(nextUsers));
  };

  const handleDeleteUser = (username: string) => {
    const nextUsers = users.filter(u => u.username !== username);
    setUsers(nextUsers);
    localStorage.setItem('farmhouse_users', JSON.stringify(nextUsers));
  };

  const handleUpdateUserPass = (username: string, newPass: string) => {
    const nextUsers = users.map(u => u.username === username ? { ...u, pass: newPass } : u);
    setUsers(nextUsers);
    localStorage.setItem('farmhouse_users', JSON.stringify(nextUsers));
    
    // Update currently logged in profile cache if matches
    if (currentUser && currentUser.username === username) {
      const updatedUser = { ...currentUser, pass: newPass };
      setCurrentUser(updatedUser);
      sessionStorage.setItem('farmhouse_current_user', JSON.stringify(updatedUser));
    }
  };

  const handleDeleteFinalizedProduct = (rIdx: number) => {
    if (!finalizedProducts) return;
    const nextList = finalizedProducts.filter((_, idx) => idx !== rIdx);
    const updated = nextList.length > 0 ? nextList : null;
    setFinalizedProducts(updated);
    if (updated) {
      localStorage.setItem('farmhouse_presale_finalized', JSON.stringify(updated));
    } else {
      localStorage.removeItem('farmhouse_presale_finalized');
    }
  };

  const handleClearAllFinalizedProducts = () => {
    setFinalizedProducts(null);
    localStorage.removeItem('farmhouse_presale_finalized');
  };

  // Custom confirmation dialog state bypassing sandboxed iframe window.confirm block
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const triggerConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(null);
      }
    });
  };

  // Product toggle checked state
  const handleToggleProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  // Toggle all visible products listed in current view
  const handleToggleAllProducts = (checked: boolean) => {
    const visibleIds = products.map(p => p.id);
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
        price: overrideQty * p.unitPrice,
        addedBy: currentUser?.username || 'Admin',
        addedAt: getCurrentFormattedDateTime()
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
          price,
          addedBy: currentUser?.username || 'Admin',
          addedAt: getCurrentFormattedDateTime()
        };
      });
    });

    // Close the recipe config slider after calculating to clean up space
    setSelectedFormula(null);
  };

  // Save/Finalize active workbook changes to final table
  const handleSavePresale = () => {
    if (currentUser?.level === 4) {
      triggerConfirm(
        "บันทึกข้อมูลแผนงาน Presale",
        "คุณต้องการบันทึกข้อมูลและผลลัพธ์การคำนวณทั้งหมดของตารางด้านบนใช่หรือไม่? (คุณยังคงสามารถแก้ไขและคำนวณข้อมูลต่อได้)",
        () => {
          // Edits are automatically saved to user-specific localStorage
        }
      );
      return;
    }

    // Level 1, 2, and 3 can finalize/lock the system for the day
    triggerConfirm(
      "บันทึกและยืนยันข้อมูลสรุปส่วนกลาง",
      "คุณยืนยันที่จะบันทึกผลการคำนวณลงตารางสรุปใช่หรือไม่? ข้อมูลบนกระดานทดลองส่วนตัวของคุณจะถูกนำเข้าไปบันทึกร่วมกับสมาชิกผู้ใช้อื่นในรายงานสรุปส่วนกลางด้านล่าง",
      () => {
        const username = currentUser?.username || 'ผู้ใช้';
        const timestamp = getCurrentFormattedDateTime();
        
        // Find products in current user's playground that have changes
        const userEdits = products
          .filter(p => p.plusQty !== 0 || p.overrideQty !== 0 || p.addedBy === username)
          .map(p => ({
            ...p,
            addedBy: p.addedBy || username,
            addedAt: p.addedAt || timestamp,
            delDate: formatDDMMYYYY(currentDate)
          }));

        if (userEdits.length === 0) {
          // Fallback to taking selected products or all products of the user
          const selectedList = products.filter(p => p.selected);
          const listToSave = selectedList.length > 0 ? selectedList : products;
          
          const mapped = listToSave.map(p => ({
            ...p,
            addedBy: p.addedBy || username,
            addedAt: p.addedAt || timestamp,
            delDate: formatDDMMYYYY(currentDate)
          }));
          userEdits.push(...mapped);
        }

        // Merge with existing finalizedProducts:
        // We match by code AND addedBy to update if the same user resubmits, otherwise append!
        const existing = finalizedProducts || [];
        const updatedFinalized = [...existing];

        userEdits.forEach(newP => {
          const idx = updatedFinalized.findIndex(
            oldP => oldP.code === newP.code && oldP.addedBy === newP.addedBy
          );
          if (idx > -1) {
            updatedFinalized[idx] = newP; // update existing entry for this user
          } else {
            updatedFinalized.push(newP); // add new entry
          }
        });

        setFinalizedProducts(updatedFinalized);
        localStorage.setItem('farmhouse_presale_finalized_products', JSON.stringify(updatedFinalized));
      }
    );
  };

  // Next Day handler that resets the entire system for a fresh start
  const handleNextDay = () => {
    triggerConfirm(
      "ยืนยันขึ้นวันใหม่",
      "คุณต้องการปิดรอบวันนี้และเริ่มงานสำหรับวันใหม่ใช่หรือไม่? ระบบจะทำการรีเซ็ตข้อมูลและแผนงานพรีเซลล์ของวันนี้กลับเป็นค่าเริ่มต้น เพื่อเตรียมคำนวณของวันถัดไป",
      () => {
        // Increment the date by 1 day
        const d = new Date(currentDate);
        d.setDate(d.getDate() + 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const nextDateStr = `${yyyy}-${mm}-${dd}`;

        setCurrentDate(nextDateStr);
        localStorage.setItem('farmhouse_current_date', nextDateStr);

        // Reset active user's products for the new day
        const username = currentUser?.username || '';
        const key = username ? `farmhouse_presale_products_v3_${username}` : 'farmhouse_presale_products_v3';
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem(key, JSON.stringify(INITIAL_PRODUCTS));

        setFinalizedProducts(null);
        localStorage.removeItem('farmhouse_presale_finalized_products');
        localStorage.removeItem('farmhouse_presale_finalized');

        setIsFormulaApproved(false);
        localStorage.setItem('farmhouse_formula_approved', 'false');

        setSelectedFormula(null);
      }
    );
  };

  // Clear/Reset entire board state to default templates
  const handleResetEntireBoard = () => {
    triggerConfirm(
      "รีเซ็ตข้อมูลกระดานทดลอง",
      "คุณต้องการรีเซ็ตแผนการคำนวณจำลองบนกระดานทดลองส่วนตัวของคุณกลับเป็นค่าเริ่มต้นใช่หรือไม่? (การรีเซ็ตนี้จะมีผลเฉพาะกระดานของคุณเท่านั้นและไม่ล้างข้อมูลรายงานในตารางสรุปส่วนกลางด้านล่าง)",
      () => {
        setProducts(INITIAL_PRODUCTS);
        setSelectedFormula(null);
      }
    );
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
            price: existing.overrideQty * nextUnitPrice,
            addedBy: currentUser?.username || 'Admin',
            addedAt: getCurrentFormattedDateTime()
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
            selected: false,
            addedBy: currentUser?.username || 'Admin',
            addedAt: getCurrentFormattedDateTime()
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
  const getFilteredProductsList = (list: Product[]) => {
    return list.filter(p => {
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
  const totalPriceAmt = products.reduce((sum, p) => sum + p.price, 0);
  const totalOverrideQty = products.reduce((sum, p) => sum + p.overrideQty, 0);
  const selectedCount = products.filter(p => p.selected).length;

  // Render authentic login portal if user is unauthenticated
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setIsLoggedIn(true);
          setCurrentUser(user);
          sessionStorage.setItem('farmhouse_logged_in', 'true');
          sessionStorage.setItem('farmhouse_username', user.username);
          sessionStorage.setItem('farmhouse_current_user', JSON.stringify(user));
        }}
      />
    );
  }

  // Get color configurations for header badge based on level
  const getHeaderBadgeClasses = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-[#ffd966] text-[#7f6000] border border-[#f1c232]';
      case 2:
        return 'bg-[#9fc5e8] text-[#0b5394] border border-[#6fa8dc]';
      case 3:
        return 'bg-[#b6d7a8] text-[#274e13] border border-[#93c47d]';
      case 4:
      default:
        return 'bg-[#f9cb9c] text-[#783f04] border border-[#e06666]';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      
      {/* BRAND HEADER BAR */}
      <header className="bg-[#ba191a] text-white h-16 shadow-md flex items-center justify-between px-6 shrink-0 relative z-30">
        <div className="flex items-center gap-6">
          {/* Authentic Farmhouse Brand Logo matching specification */}
          <FarmhouseLogo />

          {/* Tab Navigation for Admin (Level 1) */}
          {currentUser?.level === 1 && (
            <div className="hidden md:flex bg-[#a01516] p-1 rounded-xl border border-red-500/30 gap-1.5 ml-2">
              <button
                type="button"
                onClick={() => setActiveTab('presale')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'presale' 
                    ? 'bg-white text-[#ba191a] shadow-sm' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>คำนวณสูตรพรีเซลล์</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'users' 
                    ? 'bg-white text-[#ba191a] shadow-sm' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>จัดการผู้ใช้ & สรุปงาน ({users.length})</span>
              </button>
            </div>
          )}
        </div>

        {/* User profile with dropdown logout function */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xs font-black text-white font-sans tracking-wide uppercase">
                {currentUser?.username || 'admin'}
              </span>
              {/* Role/Level badge removed per user request */}
            </div>
            <button
              onClick={() => {
                triggerConfirm(
                  "ออกจากระบบ",
                  "คุณต้องการออกจากระบบจากโปรแกรมคำนวณ Presale ฟาร์มเฮ้าส์ใช่หรือไม่?",
                  () => {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    sessionStorage.removeItem('farmhouse_logged_in');
                    sessionStorage.removeItem('farmhouse_username');
                    sessionStorage.removeItem('farmhouse_current_user');
                  }
                );
              }}
              className="text-[10px] text-red-200/90 hover:text-white transition-colors underline block cursor-pointer text-right w-full font-medium"
            >
              ออกจากระบบ
            </button>
          </div>
          <div 
            onClick={() => {
              triggerConfirm(
                "ออกจากระบบ",
                "คุณต้องการออกจากระบบจากโปรแกรมคำนวณ Presale ฟาร์มเฮ้าส์ใช่หรือไม่?",
                () => {
                  setIsLoggedIn(false);
                  setCurrentUser(null);
                  sessionStorage.removeItem('farmhouse_logged_in');
                  sessionStorage.removeItem('farmhouse_username');
                  sessionStorage.removeItem('farmhouse_current_user');
                }
              );
            }}
            title="คลิกเพื่อออกจากระบบ"
            className="relative cursor-pointer group"
          >
            <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-black border-2 border-white/60 shadow-md group-hover:scale-105 transition-all uppercase font-sans text-xs">
              {(currentUser?.username || 'AD').slice(0, 2)}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-[#ba191a] shadow-sm animate-pulse"></span>
          </div>
        </div>
      </header>

      {/* THREE PANELS LAYOUT CONTAINER */}
      <div className="flex grow overflow-hidden">
        {activeTab === 'users' && currentUser?.level === 1 ? (
          <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)] bg-[#f7f9fa]">
            <UserManagement
              users={users}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              onUpdateUserPass={handleUpdateUserPass}
              finalizedProducts={finalizedProducts}
              onDeleteFinalizedProduct={handleDeleteFinalizedProduct}
              onClearAllFinalizedProducts={handleClearAllFinalizedProducts}
              triggerConfirm={triggerConfirm}
            />
          </div>
        ) : (
          <>
            {/* LEFT COLUMN: CONTROL AND SELECTION SLIDERS */}
            <Sidebar
              products={productsWithCurrentDate}
              filters={filters}
              onChangeFilters={setFilters}
              onSelectFormula={setSelectedFormula}
              selectedCount={selectedCount}
              onToggleProduct={handleToggleProduct}
              onToggleAllProducts={handleToggleAllProducts}
            />

            {/* MIDDLE/RIGHT EXPANSIVE SPACE */}
            <main ref={mainRef} className="flex-1 p-6 space-y-6 overflow-y-auto h-[calc(100vh-64px)] bg-[#f7f9fa] pb-16">
              
              {/* CURRENT DATE & SESSION CONTROLLER BAR */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 px-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#ba191a]/10 rounded-lg text-[#ba191a]">
                    <Clock className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-500 text-xs md:text-sm">วันที่ปฏิบัติงานพรีเซลล์หลัก (System Work Date):</span>
                      <span className="text-slate-950 font-black text-sm md:text-base">
                        {formatThaiDate(currentDate)}
                      </span>
                      {finalizedProducts !== null ? (
                        <span className="text-[10px] md:text-xs bg-emerald-100 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-black flex items-center gap-1.5 animate-fade-in">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          ยืนยันแล้ว
                        </span>
                      ) : (
                        <span className="text-[10px] md:text-xs bg-rose-100 border border-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-black flex items-center gap-1.5 animate-fade-in">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          ยังไม่ได้รับการยืนยัน
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Viewer (Level 4) Banner if active */}
              {currentUser?.level === 4 && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-xl text-orange-700">
                      <Clock className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">โหมดรับชมรายงานเท่านั้น (Read-Only Viewer Mode)</h4>
                      <p className="text-slate-500 font-bold text-xs">คุณเข้าสู่ระบบในสิทธิ์ผู้เข้าชม (Level 4) สามารถดูสรุปและวิเคราะห์รายงานได้ แต่ไม่สามารถแก้ไขข้อมูลหรือคำนวณสูตรได้</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-orange-200 text-orange-800 px-3 py-1 rounded-full font-black uppercase">Viewer Profile</span>
                </div>
              )}

              {/* Session status banner (Dynamic color based on finalizedProducts status) */}
              {finalizedProducts !== null ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                      <Shield className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">ยืนยันและสรุปข้อมูลวันปัจจุบันเรียบร้อยแล้ว (Locked Today's Session)</h4>
                      <p className="text-slate-500 font-bold text-xs">
                        {currentUser?.level === 1 
                          ? "แผนงาน Presale วันนี้ถูกบันทึกเรียบร้อยแล้ว แต่เนื่องจากคุณเป็น Admin คุณจึงยังมีสิทธิ์แก้ไขข้อมูลและอนุมัติสูตรได้ หรือปลดล็อกเพื่อให้เจ้าหน้าที่คนอื่นแก้ไขได้" 
                          : "แผนงาน Presale วันนี้ถูกบันทึกและส่งยันข้อมูลสรุปขั้นสุดท้ายเรียบร้อยแล้ว บอร์ดระบบอยู่ในสถานะฟรีซข้อมูล (Locked) ไม่สามารถทำการปรับเปลี่ยนใดๆ เพิ่มเติมได้ในขณะนี้"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentUser?.level === 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          triggerConfirm(
                            "ปลดล็อกวันนี้",
                            "คุณต้องการปลดล็อกข้อมูลเพื่อให้ทุกคนแก้ไขได้อีกครั้งใช่หรือไม่?",
                            () => {
                              setFinalizedProducts(null);
                              localStorage.removeItem('farmhouse_presale_finalized_products');
                            }
                          );
                        }}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase rounded-xl shadow transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span>🔓 ปลดล็อกระบบ (Admin)</span>
                      </button>
                    )}
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 px-3 py-1.5 rounded-full font-black uppercase shrink-0">Data Locked</span>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 animate-pulse">
                      <Clock className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">ยังไม่ได้รับการยืนยันและสรุปข้อมูล (Pending Daily Finalization)</h4>
                      <p className="text-slate-500 font-bold text-xs">
                        แผนงาน Presale ประจำวันนี้ยังไม่ได้กดยืนยันจัดทำรายงานสรุปขั้นสุดท้าย คุณยังคงแก้ไขสูตรและแผนงานคำนวณด้านบนได้ เมื่อเรียบร้อยแล้ว กรุณากดปุ่ม "บันทึกและยืนยัน (XLSX)" ด้านล่างสุดเพื่อส่งรายงาน
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-3 py-1.5 rounded-full font-black uppercase shrink-0">ยังไม่ได้รับการยืนยัน</span>
                  </div>
                </div>
              )}

              {/* DYNAMIC FORMULA CONFIG BANNER */}
              <RecipeConfigPanel
                selectedFormula={selectedFormula}
                products={productsWithCurrentDate}
                filters={filters}
                onSaveBatch={(updatedProducts) => {
                  const timestamp = getCurrentFormattedDateTime();
                  const username = currentUser?.username || '';
                  // Update any products that differ from the current products state
                  const finalProducts = products.map(original => {
                    const match = updatedProducts.find(u => u.code === original.code);
                    if (match) {
                      const hasChanged = match.plusQty !== original.plusQty || match.delDate !== original.delDate;
                      return {
                        ...match,
                        addedBy: hasChanged ? username : (match.addedBy || ''),
                        addedAt: hasChanged ? timestamp : (match.addedAt || '')
                      };
                    }
                    return original;
                  });
                  setProducts(finalProducts);
                }}
                onClearFormula={() => setSelectedFormula(null)}
                selectedCount={selectedCount}
                readOnly={currentUser?.level === 4 || (finalizedProducts !== null && currentUser?.level !== 1 && currentUser?.level !== 2 && currentUser?.level !== 3)}
              />

              {/* CENTRAL ACTION WORKBOOK TABLE */}
              <PresaleTable
                products={productsWithCurrentDate}
                onToggleProduct={handleToggleProduct}
                onToggleAllProducts={handleToggleAllProducts}
                onDeleteSelected={handleDeleteSelected}
                onUpdatePlusQtyDirectly={handleUpdatePlusQtyDirectly}
                onSavePresale={handleSavePresale}
                onImportBaseProducts={handleImportBaseProducts}
                onResetAllData={handleResetEntireBoard}
                readOnly={currentUser?.level === 4 || (finalizedProducts !== null && currentUser?.level !== 1 && currentUser?.level !== 2 && currentUser?.level !== 3)}
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
                <FinalSummaryTable 
                  finalizedProducts={finalizedProducts}
                  isFormulaApproved={isFormulaApproved}
                  onApproveFormula={handleApproveFormula}
                  currentUser={currentUser}
                  triggerConfirm={triggerConfirm}
                  onLoadDemoProducts={(demoProducts) => {
                    setFinalizedProducts(demoProducts);
                    localStorage.setItem('farmhouse_presale_finalized_products', JSON.stringify(demoProducts));
                  }}
                />
              </div>

            </main>
          </>
        )}
      </div>

      {/* CUSTOM CONFIRMATION DIALOG BYPASSING IFRAME WINDOW.CONFIRM SECURITY BLOCKS */}
      {confirmModal && (
        <div 
          id="custom-confirm-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        >
          <div 
            id="custom-confirm-modal-card"
            className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative transform scale-100 transition-all font-sans"
          >
            {/* Header with warm/red accent info */}
            <div className="bg-[#ba191a] px-5 py-4 text-white flex items-center gap-2.5">
              <span className="font-extrabold text-sm tracking-wide uppercase">{confirmModal.title}</span>
            </div>
            
            {/* Message Body */}
            <div className="p-5">
              <p className="text-slate-600 text-xs font-bold leading-relaxed">
                {confirmModal.message}
              </p>
            </div>
            
            {/* Decision Actions Button Group */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                id="confirm-modal-cancel-btn"
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold text-[11px] rounded-lg transition-all cursor-pointer"
              >
                ยกเลิก (Cancel)
              </button>
              <button
                id="confirm-modal-confirm-btn"
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                }}
                className="px-5 py-2 bg-[#ba191a] hover:bg-[#a01516] text-white font-black text-[11px] tracking-wider rounded-lg transition-all shadow active:scale-95 cursor-pointer"
              >
                ยืนยัน (Confirm)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
