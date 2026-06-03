/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, DailyCardData } from './types';

export interface CategoryDefinition {
  name: string;
  code: string;
  subLabel: string;
  type: 'piece' | 'slice' | 'long';
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  { name: 'เดลี่แซนวิช', code: '1060', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'บราวนี่', code: '1143', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'ขนมปังยอดตลอดครัมเล็ก', code: '1079', subLabel: 'ขนมปังแผ่น', type: 'slice' },
  { name: 'โดนัท', code: '1110', subLabel: 'ขนมปังแผ่น', type: 'slice' },
  { name: 'สินค้าอายุยาว', code: '1250', subLabel: 'ขนมปังอายุยาว', type: 'long' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // เดลี่แซนวิช
  { id: 'p-1', code: '8850123110656', name: 'เดลี่ไก่หยอง', category: 'เดลี่แซนวิช', multiQty: 85, plusQty: 0, overrideQty: -85, price: -1020, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-2', code: '8850123110801', name: 'เดลี่หมูหยอง', category: 'เดลี่แซนวิช', multiQty: 120, plusQty: 0, overrideQty: -120, price: -1440, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-3', code: '8850123120565', name: 'เดลี่ทูน่า', category: 'เดลี่แซนวิช', multiQty: 64, plusQty: 0, overrideQty: -64, price: -768, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-4', code: '8850123110849', name: 'เดลี่สปริง', category: 'เดลี่แซนวิช', multiQty: 95, plusQty: 0, overrideQty: -95, price: -1140, unitPrice: 12, delDate: '02/03/2026', selected: true },

  // ขนมปังยอดตลอดครัมเล็ก
  { id: 'p-5', code: '8850123110108', name: 'แซนวิช480ก', category: 'ขนมปังยอดตลอดครัมเล็ก', multiQty: 137, plusQty: 0, overrideQty: -137, price: -5480, unitPrice: 40, delDate: '02/03/2026', selected: true },
  { id: 'p-6', code: '8850123110146', name: 'ตัดขอบ220ก', category: 'ขนมปังยอดตลอดครัมเล็ก', multiQty: 72, plusQty: 0, overrideQty: -72, price: -2160, unitPrice: 30, delDate: '02/03/2026', selected: true },
  { id: 'p-7', code: '8850123110412', name: 'โฮลวีต250ก', category: 'ขนมปังยอดตลอดครัมเล็ก', multiQty: 110, plusQty: 0, overrideQty: -110, price: -2640, unitPrice: 24, delDate: '02/03/2026', selected: true },
  { id: 'p-8', code: '8850123110436', name: 'โฮลวีต500ก', category: 'ขนมปังยอดตลอดครัมเล็ก', multiQty: 45, plusQty: 0, overrideQty: -45, price: -1980, unitPrice: 44, delDate: '02/03/2026', selected: true },
  { id: 'p-9', code: '8850123110443', name: 'ไฟเบอร์วิช250ก', category: 'ขนมปังยอดตลอดครัมเล็ก', multiQty: 50, plusQty: 0, overrideQty: -50, price: -1200, unitPrice: 24, delDate: '02/03/2026', selected: true },
  { id: 'p-10', code: '8850123110535', name: 'ขนมปังเนยเมเปิ้ล', category: 'ขนมปังยอดตลอดครัมเล็ก', multiQty: 30, plusQty: 0, overrideQty: -30, price: -900, unitPrice: 30, delDate: '02/03/2026', selected: true },
  { id: 'p-11', code: '8850123111105', name: 'รอยัลโฮลวีต', category: 'ขนมปังยอดตลอดครัมเล็ก', multiQty: 60, plusQty: 0, overrideQty: -60, price: -2400, unitPrice: 40, delDate: '02/03/2026', selected: true },
  { id: 'p-12', code: '8850123111211', name: 'ข้าวกล้องงอกงา', category: 'ขนมปังยอดตลอดครัมเล็ก', multiQty: 25, plusQty: 0, overrideQty: -25, price: -1250, unitPrice: 50, delDate: '02/03/2026', selected: true },

  // โดนัท
  { id: 'p-13', code: '8850123111402', name: 'สวีทแซนวิชช็อคฯ', category: 'โดนัท', multiQty: 80, plusQty: 0, overrideQty: -80, price: -960, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-14', code: '8850123111419', name: 'สวีทแซนวิชเนยสด', category: 'โดนัท', multiQty: 105, plusQty: 0, overrideQty: -105, price: -1260, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-15', code: '8850123111433', name: 'สวีทแซนวิชสังขยา', category: 'โดนัท', multiQty: 90, plusQty: 0, overrideQty: -90, price: -1080, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-16', code: '8850123120566', name: 'เนยสดใบเตยอ่อน', category: 'โดนัท', multiQty: 140, plusQty: 0, overrideQty: -140, price: -1400, unitPrice: 10, delDate: '02/03/2026', selected: true },

  // บราวนี่
  { id: 'p-17', code: '8850123120510', name: 'ไส้ถั่วแดง80ก', category: 'บราวนี่', multiQty: 70, plusQty: 0, overrideQty: -70, price: -700, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-18', code: '8850123120527', name: 'ไส้เผือก80ก', category: 'บราวนี่', multiQty: 65, plusQty: 0, overrideQty: -65, price: -650, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-19', code: '8850123120718', name: 'ไส้คัสตาร์ด50ก', category: 'บราวนี่', multiQty: 115, plusQty: 0, overrideQty: -115, price: -690, unitPrice: 6, delDate: '02/03/2026', selected: true },

  // สินค้าอายุยาว
  { id: 'p-20', code: '8850123515750', name: 'กล่องแดงรวมคุกกี้เนย', category: 'สินค้าอายุยาว', multiQty: 15, plusQty: 0, overrideQty: -15, price: -2700, unitPrice: 180, delDate: '02/03/2026', selected: true }
];

export const CATEGORIES = [
  'เดลี่แซนวิช',
  'บราวนี่',
  'ขนมปังยอดตลอดครัมเล็ก',
  'โดนัท',
  'สินค้าอายุยาว'
];

export const CLIENT_GROUPS = [
  '10056',
  '10402',
  '10920',
  '11540',
];

export const CUSTOMER_GROUPS = [
  { code: '10', name: 'Hypermarket' },
  { code: '20', name: 'Department Store' },
  { code: '30', name: 'Supermarket' },
  { code: '40', name: 'Convenience Store' },
];

export const STORE_TYPES = [
  'ทุกวัน',
  'เว้นวัน',
  'สลับสัปดาห์',
  'วันที่',
];

export const GRADES = [
  'AAA',
  'AA',
  'A',
  'B',
  'C',
];

export const STORE_PROFILES = [
  { id: '1', label: '1 - กทม/ปริมณฑล (อนุมัติแล้ว)' },
  { id: '2', label: '2 - ภาคเหนือ/ตะวันออก' },
  { id: '3', label: '3 - ยอดพรีเมียมตัวแทน' },
  { id: '4', label: '4 - ปริมณฑล (เขตชุมชน)' },
];

export const INITIAL_DAILY_DATA: DailyCardData[] = [
  {
    day: 'Mon 02/03/2026',
    offset: '+2',
    estGenSelect: 1892570,
    diffPercent: -0.86,
    ovrAmt: -214888,
    estGenG10_G60: 21243435,
    selectedCustomerGroups: ['10', '20'],
  },
  {
    day: 'Tue 03/03/2026',
    offset: '+3',
    estGenSelect: 1892570,
    diffPercent: -0.86,
    ovrAmt: -214888,
    estGenG10_G60: 21243435,
    selectedCustomerGroups: ['10', '20'],
  },
  {
    day: 'Wed 04/03/2026',
    offset: '+4',
    estGenSelect: 1892570,
    diffPercent: -0.86,
    ovrAmt: -214888,
    estGenG10_G60: 21243435,
    selectedCustomerGroups: ['10', '20'],
  },
  {
    day: 'Thu 05/03/2026',
    offset: '+5',
    estGenSelect: 1892570,
    diffPercent: -0.86,
    ovrAmt: -214888,
    estGenG10_G60: 21243435,
    selectedCustomerGroups: ['10', '20'],
  },
];
