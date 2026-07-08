/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string; // Internal React identifier
  code: string;
  name: string;
  category: string;
  multiQty: number; // Base quantity (MULTI_QTY)
  plusQty: number;  // Added qty (PLUS_QTY)
  overrideQty: number; // Override qty (OVERRIDE_QTY)
  price: number;       // Computed price (PRICE)
  unitPrice: number;   // Unit Price
  delDate: string;     // Delivery Date (DEL_DATE)
  selected: boolean;   // Checkbox state in the table
  addedBy?: string;    // Name of user who added the product
  addedAt?: string;    // Date/time when the product was added
}

export interface StoreFilterState {
  productType: string; // 'all' | 'piece' | 'slice' | 'long'
  searchCategory: string;
  selectedCategories: string[];
  searchProduct: string;
  selectedProducts: string[];
  searchStoreGroup: string;
  selectedStoreGroups: string[];
  selectedCustomerGroups: string[];
  selectedStoreTypes: string[];
  selectedGrades: string[];
  selectedProfiles: string[];
}

export interface DailyCardData {
  day: string;
  offset: string;
  estGenSelect: number;
  diffPercent: number;
  ovrAmt: number;
  estGenG10_G60: number;
  selectedCustomerGroups: string[];
}

export type FormulaType =
  | 'add_pieces'
  | 'add_percent'
  | 'add_first_min'
  | 'add_min_1'
  | 'reduce_pieces'
  | 'reduce_percent'
  | 'reduce_min_1'
  | 'reset_zero'
  | 'upload_file';

export interface User {
  username: string;
  pass: string;
  level: number;
  roleName: 'Admin' | 'Manager' | 'Staff' | 'Viewer';
  description: string;
  department?: string;
}

