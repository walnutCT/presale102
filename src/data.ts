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
  // Slice (ขนมปังแผ่น)
  { name: 'ขนมปังแผ่นทั่วไป', code: '1010', subLabel: 'ขนมปังแผ่น', type: 'slice' },
  { name: 'ขนมปังโฮลวีต', code: '1020', subLabel: 'ขนมปังแผ่น', type: 'slice' },
  { name: 'ขนมปังแถวพรีเมียม', code: '1030', subLabel: 'ขนมปังแผ่น', type: 'slice' },
  { name: 'ขนมปังแถวมีไส้', code: '1045', subLabel: 'ขนมปังแผ่น', type: 'slice' },

  // Piece (ขนมปังชิ้น)
  { name: 'เดลี่แซนวิช', code: '1060', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'แซนวิชสอดไส้', code: '1062', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'แซนวิชเค้ก', code: '1064', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'โดนัทเปียก', code: '1066', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'เดลี่พาย', code: '1068', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'ขนมปังจิ๋วสอดไส้', code: '1071', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'ขนมปังไส้หวาน', code: '1072', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'เบเกอรี่ช็อกโกแลต', code: '1074', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'ฮอตด็อกสอดไส้', code: '1080', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'ฮอตด็อกไส้เค็ม', code: '1081', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'ขนมปังแพ', code: '1082', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'ขนมปังหน้าเนยสด', code: '1085', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'โดนัทเค้ก', code: '1135', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'เค้กโรล', code: '1091', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'แซนวิชเค้กสด', code: '1092', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'เค้กกล้วยหอม', code: '1093', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'ขนมปังโมจิ', code: '1094', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'เค้กโดรายากิ', code: '1130', subLabel: 'ขนมปังชิ้น', type: 'piece' },
  { name: 'บราวนี่', code: '1145', subLabel: 'ขนมปังชิ้น', type: 'piece' },

  // Long (สินค้าอายุยาว)
  { name: 'ข้าวกล้องพร้อมทาน', code: '2010', subLabel: 'สินค้าอายุยาว', type: 'long' },
  { name: 'คุกกี้สเปเชียล', code: '1900', subLabel: 'สินค้าอายุยาว', type: 'long' },
  { name: 'เซ็ตคุกกี้และเค้กเทศกาล', code: '2020', subLabel: 'สินค้าอายุยาว', type: 'long' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1072 ขนมปังไส้หวาน
  { id: 'p-1', code: '8850123005381', name: 'ไส้ช็อกโกแลต80ก', category: 'ขนมปังไส้หวาน', multiQty: 100, plusQty: 120, overrideQty: 20, price: 200, unitPrice: 10, delDate: '02/03/2026', selected: true },
  
  // 1010 ขนมปังแผ่นทั่วไป
  { id: 'p-2', code: '8850123110108', name: 'แซนวิช480ก', category: 'ขนมปังแผ่นทั่วไป', multiQty: 137, plusQty: 0, overrideQty: -137, price: -5480, unitPrice: 40, delDate: '02/03/2026', selected: true },
  { id: 'p-3', code: '8850123110115', name: 'แซนวิช240ก', category: 'ขนมปังแผ่นทั่วไป', multiQty: 90, plusQty: 110, overrideQty: 20, price: 420, unitPrice: 21, delDate: '02/03/2026', selected: true },
  { id: 'p-4', code: '8850123110146', name: 'ตัดขอบ220ก', category: 'ขนมปังแผ่นทั่วไป', multiQty: 72, plusQty: 0, overrideQty: -72, price: -2160, unitPrice: 30, delDate: '02/03/2026', selected: true },
  { id: 'p-5', code: '8850123110191', name: 'อังกฤษ เบรด', category: 'ขนมปังแผ่นทั่วไป', multiQty: 80, plusQty: 90, overrideQty: 10, price: 290, unitPrice: 29, delDate: '02/03/2026', selected: true },
  { id: 'p-6', code: '8850123110535', name: 'ขนมปังเนยเนยโทส', category: 'ขนมปังแผ่นทั่วไป', multiQty: 50, plusQty: 0, overrideQty: -50, price: -1500, unitPrice: 30, delDate: '02/03/2026', selected: true },

  // 1020 ขนมปังโฮลวีต
  { id: 'p-7', code: '8850123110412', name: 'โฮลวีต250ก', category: 'ขนมปังโฮลวีต', multiQty: 1834, plusQty: 0, overrideQty: -1834, price: -44016, unitPrice: 24, delDate: '02/03/2026', selected: true },
  { id: 'p-8', code: '8850123110436', name: 'โฮลวีต500ก', category: 'ขนมปังโฮลวีต', multiQty: 930, plusQty: 950, overrideQty: 20, price: 880, unitPrice: 44, delDate: '02/03/2026', selected: true },
  { id: 'p-9', code: '8850123110443', name: 'ไฟเบอร์โฮลวีต250ก', category: 'ขนมปังโฮลวีต', multiQty: 733, plusQty: 0, overrideQty: -733, price: -17592, unitPrice: 24, delDate: '02/03/2026', selected: true },

  // 1060 เดลี่แซนวิช
  { id: 'p-10', code: '8850123110801', name: 'เดลี่หมูหยอง', category: 'เดลี่แซนวิช', multiQty: 150, plusQty: 160, overrideQty: 10, price: 120, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-11', code: '8850123110818', name: 'เดลี่ทูน่า', category: 'เดลี่แซนวิช', multiQty: 140, plusQty: 140, overrideQty: 0, price: 0, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-12', code: '8850123110849', name: 'เดลี่ปูอัด', category: 'เดลี่แซนวิช', multiQty: 130, plusQty: 0, overrideQty: -130, price: -1560, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-13', code: '8850123110856', name: 'เดลี่ไก่หยอง', category: 'เดลี่แซนวิช', multiQty: 120, plusQty: 130, overrideQty: 10, price: 120, unitPrice: 12, delDate: '02/03/2026', selected: true },

  // 1030 ขนมปังแถวพรีเมียม
  { id: 'p-14', code: '8850123111006', name: 'รอยัลเบรด', category: 'ขนมปังแถวพรีเมียม', multiQty: 70, plusQty: 80, overrideQty: 10, price: 360, unitPrice: 36, delDate: '02/03/2026', selected: true },
  { id: 'p-15', code: '8850123111105', name: 'รอยัลโฮลวีต', category: 'ขนมปังแถวพรีเมียม', multiQty: 463, plusQty: 0, overrideQty: -463, price: -18520, unitPrice: 40, delDate: '02/03/2026', selected: true },
  { id: 'p-16', code: '8850123111204', name: 'รอยัล 12 เกรน', category: 'ขนมปังแถวพรีเมียม', multiQty: 55, plusQty: 60, overrideQty: 5, price: 220, unitPrice: 44, delDate: '02/03/2026', selected: true },
  { id: 'p-17', code: '8850123111211', name: 'รอยัลข้าวกล้อง', category: 'ขนมปังแถวพรีเมียม', multiQty: 6, plusQty: 456, overrideQty: 450, price: 22500, unitPrice: 50, delDate: '02/03/2026', selected: true },

  // 1062 แซนวิชสอดไส้
  { id: 'p-18', code: '8850123111303', name: 'แซนวิชหมูหยอง', category: 'แซนวิชสอดไส้', multiQty: 250, plusQty: 270, overrideQty: 20, price: 280, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-19', code: '8850123111310', name: 'แซนวิชทูน่า', category: 'แซนวิชสอดไส้', multiQty: 240, plusQty: 0, overrideQty: -240, price: -3360, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-20', code: '8850123111327', name: 'แซนวิชปูอัด', category: 'แซนวิชสอดไส้', multiQty: 220, plusQty: 230, overrideQty: 10, price: 140, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-21', code: '8850123111334', name: 'โฮลวีตแฮมไข่', category: 'แซนวิชสอดไส้', multiQty: 210, plusQty: 0, overrideQty: -210, price: -2940, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-22', code: '8850123111358', name: 'โฮลวีตสลัดทูน่า', category: 'แซนวิชสอดไส้', multiQty: 200, plusQty: 210, overrideQty: 10, price: 140, unitPrice: 14, delDate: '02/03/2026', selected: true },

  // 1064 แซนวิชเค้ก
  { id: 'p-23', code: '8850123111402', name: 'สวีทแซนวิชช็อกฯ', category: 'แซนวิชเค้ก', multiQty: 1996, plusQty: 0, overrideQty: -1996, price: -23952, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-24', code: '8850123111419', name: 'สวีทแซนวิชเนย', category: 'แซนวิชเค้ก', multiQty: 1513, plusQty: 0, overrideQty: -1513, price: -18156, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-25', code: '8850123111433', name: 'สวีทสังขยา', category: 'แซนวิชเค้ก', multiQty: 300, plusQty: 320, overrideQty: 20, price: 240, unitPrice: 12, delDate: '02/03/2026', selected: true },

  // 1066 โดนัทเปียก
  { id: 'p-26', code: '8850123111501', name: 'ทูโทนโอวัลตินนม', category: 'โดนัทเปียก', multiQty: 400, plusQty: 0, overrideQty: -400, price: -4800, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-27', code: '8850123111518', name: 'ทูทูแยมเนยสดรถ', category: 'โดนัทเปียก', multiQty: 350, plusQty: 370, overrideQty: 20, price: 240, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-28', code: '8850123111525', name: 'ทูโทนช็อกสตรอ', category: 'โดนัทเปียก', multiQty: 300, plusQty: 0, overrideQty: -300, price: -3600, unitPrice: 12, delDate: '02/03/2026', selected: true },

  // 1068 เดลี่พาย
  { id: 'p-29', code: '8850123111907', name: 'พายไส้สับประรด80', category: 'เดลี่พาย', multiQty: 250, plusQty: 260, overrideQty: 10, price: 170, unitPrice: 17, delDate: '02/03/2026', selected: true },
  { id: 'p-30', code: '8850123111914', name: 'พายไส้เผือก80ก.', category: 'เดลี่พาย', multiQty: 240, plusQty: 0, overrideQty: -240, price: -4080, unitPrice: 17, delDate: '02/03/2026', selected: true },
  { id: 'p-31', code: '8850123111945', name: 'พายช็อกโกแลต', category: 'เดลี่พาย', multiQty: 230, plusQty: 250, overrideQty: 20, price: 340, unitPrice: 17, delDate: '02/03/2026', selected: true },
  { id: 'p-32', code: '8850123111952', name: 'พายมะพร้าวอ่อน', category: 'เดลี่พาย', multiQty: 180, plusQty: 0, overrideQty: -180, price: -3240, unitPrice: 18, delDate: '02/03/2026', selected: true },
  { id: 'p-33', code: '8850123111969', name: 'พายสังขยามะพร้าว', category: 'เดลี่พาย', multiQty: 170, plusQty: 190, overrideQty: 20, price: 360, unitPrice: 18, delDate: '02/03/2026', selected: true },

  // 1045 ขนมปังแถวมีไส้
  { id: 'p-34', code: '8850123112102', name: 'บัตเตอร์เกรด100g', category: 'ขนมปังแถวมีไส้', multiQty: 160, plusQty: 0, overrideQty: -160, price: -2720, unitPrice: 17, delDate: '02/03/2026', selected: true },
  { id: 'p-35', code: '8850123112119', name: 'บึงลูกเกด100g', category: 'ขนมปังแถวมีไส้', multiQty: 150, plusQty: 160, overrideQty: 10, price: 170, unitPrice: 17, delDate: '02/03/2026', selected: true },
  { id: 'p-36', code: '8850123112126', name: 'บัตเตอร์ใบเตย', category: 'ขนมปังแถวมีไส้', multiQty: 140, plusQty: 0, overrideQty: -140, price: -2380, unitPrice: 17, delDate: '02/03/2026', selected: true },
  { id: 'p-37', code: '8850123112133', name: 'บึงข้าวกล้อง100g.', category: 'ขนมปังแถวมีไส้', multiQty: 130, plusQty: 140, overrideQty: 10, price: 190, unitPrice: 19, delDate: '02/03/2026', selected: true },

  // 1074 เบเกอรี่ช็อกโกแลต
  { id: 'p-38', code: '8850123120336', name: 'ดูโอ้สตรอช็อก', category: 'เบเกอรี่ช็อกโกแลต', multiQty: 120, plusQty: 130, overrideQty: 10, price: 120, unitPrice: 12, delDate: '02/03/2026', selected: true },

  // 1072 ขนมปังไส้หวาน
  { id: 'p-39', code: '8850123120510', name: 'ไส้ถั่วแดง80ก', category: 'ขนมปังไส้หวาน', multiQty: 210, plusQty: 220, overrideQty: 10, price: 100, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-40', code: '8850123120527', name: 'ไส้เผือก80ก', category: 'ขนมปังไส้หวาน', multiQty: 200, plusQty: 0, overrideQty: -200, price: -2000, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-41', code: '8850123120541', name: 'ไส้บัวถั่วแดง70', category: 'ขนมปังไส้หวาน', multiQty: 190, plusQty: 200, overrideQty: 10, price: 100, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-42', code: '8850123120558', name: 'ไส้เผือกมะพร้าว70', category: 'ขนมปังไส้หวาน', multiQty: 180, plusQty: 0, overrideQty: -180, price: -1800, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-43', code: '8850123120565', name: 'ไส้สังขยามะพร้าว', category: 'ขนมปังไส้หวาน', multiQty: 170, plusQty: 180, overrideQty: 10, price: 100, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-44', code: '8850123120770', name: 'ไส้ถั่วดำ80ก', category: 'ขนมปังไส้หวาน', multiQty: 160, plusQty: 0, overrideQty: -160, price: -1600, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-45', code: '8850123122811', name: 'ไส้สังขยา80ก', category: 'ขนมปังไส้หวาน', multiQty: 150, plusQty: 160, overrideQty: 10, price: 100, unitPrice: 10, delDate: '02/03/2026', selected: true },

  // 1071 ขนมปังจิ๋วสอดไส้
  { id: 'p-46', code: '8850123120589', name: 'ไส้สังขยาใบเตย50ก', category: 'ขนมปังจิ๋วสอดไส้', multiQty: 300, plusQty: 320, overrideQty: 20, price: 120, unitPrice: 6, delDate: '02/03/2026', selected: true },
  { id: 'p-47', code: '8850123120640', name: 'ไส้ถั่วแดง50ก', category: 'ขนมปังจิ๋วสอดไส้', multiQty: 290, plusQty: 0, overrideQty: -290, price: -1740, unitPrice: 6, delDate: '02/03/2026', selected: true },
  { id: 'p-48', code: '8850123120657', name: 'ไส้เผือก50ก', category: 'ขนมปังจิ๋วสอดไส้', multiQty: 280, plusQty: 300, overrideQty: 20, price: 120, unitPrice: 6, delDate: '02/03/2026', selected: true },
  { id: 'p-49', code: '8850123120664', name: 'ไส้สังขยา50ก', category: 'ขนมปังจิ๋วสอดไส้', multiQty: 270, plusQty: 0, overrideQty: -270, price: -1620, unitPrice: 6, delDate: '02/03/2026', selected: true },
  { id: 'p-50', code: '8850123120671', name: 'ไส้เนยน้ำตาล', category: 'ขนมปังจิ๋วสอดไส้', multiQty: 260, plusQty: 280, overrideQty: 20, price: 120, unitPrice: 6, delDate: '02/03/2026', selected: true },
  { id: 'p-51', code: '8850123120701', name: 'ไส่ชอกโกแลต50ก', category: 'ขนมปังจิ๋วสอดไส้', multiQty: 250, plusQty: 0, overrideQty: -250, price: -1500, unitPrice: 6, delDate: '02/03/2026', selected: true },
  { id: 'p-52', code: '8850123120718', name: 'ไส้คัสตาร์ต50ก', category: 'ขนมปังจิ๋วสอดไส้', multiQty: 245, plusQty: 265, overrideQty: 20, price: 120, unitPrice: 6, delDate: '02/03/2026', selected: true },

  // 1080 ฮอตด็อกสอดไส้
  { id: 'p-53', code: '8850123123245', name: 'ฮอตดอกครีมช็อกฯ', category: 'ฮอตด็อกสอดไส้', multiQty: 180, plusQty: 190, overrideQty: 10, price: 70, unitPrice: 7, delDate: '02/03/2026', selected: true },
  { id: 'p-54', code: '8850123123283', name: 'ฮอตดอกสับปะรด', category: 'ฮอตด็อกสอดไส้', multiQty: 170, plusQty: 0, overrideQty: -170, price: -1190, unitPrice: 7, delDate: '02/03/2026', selected: true },
  { id: 'p-55', code: '8850123123290', name: 'ฮอตดอกครีมสตรอฯ', category: 'ฮอตด็อกสอดไส้', multiQty: 160, plusQty: 170, overrideQty: 10, price: 70, unitPrice: 7, delDate: '02/03/2026', selected: true },
  { id: 'p-56', code: '8850123123313', name: 'ฮอตดอกครีมกาแฟ', category: 'ฮอตด็อกสอดไส้', multiQty: 150, plusQty: 0, overrideQty: -150, price: -1050, unitPrice: 7, delDate: '02/03/2026', selected: true },
  { id: 'p-57', code: '8850123123337', name: 'ฮอตดอกกาแฟอัลดัดฯ', category: 'ฮอตด็อกสอดไส้', multiQty: 140, plusQty: 150, overrideQty: 10, price: 130, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-58', code: '8850123123368', name: 'ฮอตดอกสตรออุเกะ', category: 'ฮอตด็อกสอดไส้', multiQty: 130, plusQty: 0, overrideQty: -130, price: -1690, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-59', code: '8850123123436', name: 'ฮอตดอกนมจัมบ้อ', category: 'ฮอตด็อกสอดไส้', multiQty: 120, plusQty: 130, overrideQty: 10, price: 130, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-60', code: '8850123123443', name: 'ฮอตดอกครีมนมฮอก', category: 'ฮอตด็อกสอดไส้', multiQty: 110, plusQty: 0, overrideQty: -110, price: -770, unitPrice: 7, delDate: '02/03/2026', selected: true },
  { id: 'p-61', code: '8850123123511', name: 'ฮอตดอกโอวัลติน', category: 'ฮอตด็อกสอดไส้', multiQty: 100, plusQty: 110, overrideQty: 10, price: 140, unitPrice: 14, delDate: '02/03/2026', selected: true },

  // 1081 ฮอตด็อกไส้เค็ม
  { id: 'p-62', code: '8850123123726', name: 'ฮอตดอกซอสสไปซี่', category: 'ฮอตด็อกไส้เค็ม', multiQty: 90, plusQty: 100, overrideQty: 10, price: 160, unitPrice: 16, delDate: '02/03/2026', selected: true },
  { id: 'p-63', code: '8850123123733', name: 'ฮอตดอกทูน่าสลัด', category: 'ฮอตด็อกไส้เค็ม', multiQty: 80, plusQty: 0, overrideQty: -80, price: -1280, unitPrice: 16, delDate: '02/03/2026', selected: true },
  { id: 'p-64', code: '8850123123740', name: 'ฮอตดอกหมูหยอง80', category: 'ฮอตด็อกไส้เค็ม', multiQty: 70, plusQty: 80, overrideQty: 10, price: 160, unitPrice: 16, delDate: '02/03/2026', selected: true },

  // 1082 ขนมปังแพ
  { id: 'p-65', code: '8850123130410', name: 'แพเนยสด130ก', category: 'ขนมปังแพ', multiQty: 160, plusQty: 170, overrideQty: 10, price: 170, unitPrice: 17, delDate: '02/03/2026', selected: true },
  { id: 'p-66', code: '8850123130427', name: 'แพเผือก130ก', category: 'ขนมปังแพ', multiQty: 150, plusQty: 0, overrideQty: -150, price: -2550, unitPrice: 17, delDate: '02/03/2026', selected: true },
  { id: 'p-67', code: '8850123130489', name: 'แพใบเตย130ก', category: 'ขนมปังแพ', multiQty: 140, plusQty: 150, overrideQty: 10, price: 170, unitPrice: 17, delDate: '02/03/2026', selected: true },
  { id: 'p-68', code: '8850123130496', name: 'แพโกโก้130ก', category: 'ขนมปังแพ', multiQty: 130, plusQty: 0, overrideQty: -130, price: -2210, unitPrice: 17, delDate: '02/03/2026', selected: true },

  // 1135 โดนัทเค้ก
  { id: 'p-69', code: '8850123150500', name: 'โดนัทเค้กวานิลา', category: 'โดนัทเค้ก', multiQty: 120, plusQty: 130, overrideQty: 10, price: 140, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-70', code: '8850123150517', name: 'โดนัทเค้กช็อกโก', category: 'โดนัทเค้ก', multiQty: 110, plusQty: 0, overrideQty: -110, price: -1540, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-71', code: '8850123150524', name: 'โดนัทเค้กสังขยา', category: 'โดนัทเค้ก', multiQty: 100, plusQty: 115, overrideQty: 15, price: 210, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-72', code: '8850123150609', name: 'โดนัทบาวิลลา', category: 'โดนัทเค้ก', multiQty: 90, plusQty: 0, overrideQty: -90, price: -1260, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-73', code: '8850123150616', name: 'โดนัทช็อคสตรอ', category: 'โดนัทเค้ก', multiQty: 80, plusQty: 95, overrideQty: 15, price: 210, unitPrice: 14, delDate: '02/03/2026', selected: true },

  // 2010 ข้าวกล้องพร้อมทาน
  { id: 'p-74', code: '8850123170102', name: 'เกลือซาวครีมพิเศษ', category: 'ข้าวกล้องพร้อมทาน', multiQty: 15, plusQty: 20, overrideQty: 5, price: 150, unitPrice: 30, delDate: '02/03/2026', selected: true },
  { id: 'p-75', code: '8850123170126', name: 'ธรรมดา1000ก', category: 'ข้าวกล้องพร้อมทาน', multiQty: 10, plusQty: 0, overrideQty: -10, price: -1000, unitPrice: 100, delDate: '02/03/2026', selected: true },
  { id: 'p-76', code: '8850123170140', name: 'ขาวพิเศษ1000ก', category: 'ข้าวกล้องพร้อมทาน', multiQty: 25, plusQty: 30, overrideQty: 5, price: 640, unitPrice: 128, delDate: '02/03/2026', selected: true },
  { id: 'p-77', code: '8850123170157', name: 'ขาวพิเศษ200กX12', category: 'ข้าวกล้องพร้อมทาน', multiQty: 5, plusQty: 0, overrideQty: -5, price: -1775, unitPrice: 355, delDate: '02/03/2026', selected: true },
  { id: 'p-78', code: '8850123170171', name: 'เกลือขาว(พ)200ก', category: 'ข้าวกล้องพร้อมทาน', multiQty: 2, plusQty: 3, overrideQty: 1, price: 710, unitPrice: 710, delDate: '02/03/2026', selected: true },
  { id: 'p-79', code: '8850123170317', name: 'กรอบพิเศษ1000ก.', category: 'ข้าวกล้องพร้อมทาน', multiQty: 8, plusQty: 0, overrideQty: -8, price: -800, unitPrice: 100, delDate: '02/03/2026', selected: true },
  { id: 'p-80', code: '8850123170362', name: 'พิเศษ1000ก.(B)', category: 'ข้าวกล้องพร้อมทาน', multiQty: 3, plusQty: 4, overrideQty: 1, price: 760, unitPrice: 760, delDate: '02/03/2026', selected: true },
  { id: 'p-81', code: '8850123170409', name: 'ข้าว(ข)200กX12', category: 'ข้าวกล้องพร้อมทาน', multiQty: 4, plusQty: 0, overrideQty: -4, price: -1040, unitPrice: 260, delDate: '02/03/2026', selected: true },
  { id: 'p-82', code: '8850123170416', name: 'กรอบ(พ)1000nx10', category: 'ข้าวกล้องพร้อมทาน', multiQty: 1, plusQty: 2, overrideQty: 1, price: 990, unitPrice: 990, delDate: '02/03/2026', selected: true },

  // 1085 ขนมปังหน้าเนยสด
  { id: 'p-83', code: '8850123180767', name: 'หน้านมเนย', category: 'ขนมปังหน้าเนยสด', multiQty: 220, plusQty: 240, overrideQty: 20, price: 180, unitPrice: 9, delDate: '02/03/2026', selected: true },
  { id: 'p-84', code: '8850123180774', name: 'หน้าสังขยา', category: 'ขนมปังหน้าเนยสด', multiQty: 210, plusQty: 0, overrideQty: -210, price: -1890, unitPrice: 9, delDate: '02/03/2026', selected: true },
  { id: 'p-85', code: '8850123180798', name: 'หน้าช็อกโกแลต', category: 'ขนมปังหน้าเนยสด', multiQty: 200, plusQty: 215, overrideQty: 15, price: 135, unitPrice: 9, delDate: '02/03/2026', selected: true },
  { id: 'p-86', code: '8850123180897', name: 'หน้าหมูหยองไก่หยอง', category: 'ขนมปังหน้าเนยสด', multiQty: 190, plusQty: 0, overrideQty: -190, price: -1710, unitPrice: 9, delDate: '02/03/2026', selected: true },
  { id: 'p-87', code: '8850123180958', name: 'หน้านมส้ม', category: 'ขนมปังหน้าเนยสด', multiQty: 180, plusQty: 190, overrideQty: 10, price: 90, unitPrice: 9, delDate: '02/03/2026', selected: true },

  // 1900 คุกกี้สเปเชียล
  { id: 'p-88', code: '8850123194115', name: 'ขนมปังกรอบเนย', category: 'คุกกี้สเปเชียล', multiQty: 150, plusQty: 0, overrideQty: -150, price: -2250, unitPrice: 15, delDate: '02/03/2026', selected: true },
  { id: 'p-89', code: '8850123194177', name: 'มินิปังกรอบเนย', category: 'คุกกี้สเปเชียล', multiQty: 140, plusQty: 150, overrideQty: 10, price: 80, unitPrice: 8, delDate: '02/03/2026', selected: true },
  { id: 'p-90', code: '8850123392016', name: 'คุกกี้รสผลไม้', category: 'คุกกี้สเปเชียล', multiQty: 130, plusQty: 0, overrideQty: -130, price: -1950, unitPrice: 15, delDate: '02/03/2026', selected: true },
  { id: 'p-91', code: '8850123392030', name: 'คุกกี้รสเนย', category: 'คุกกี้สเปเชียล', multiQty: 120, plusQty: 130, overrideQty: 10, price: 150, unitPrice: 15, delDate: '02/03/2026', selected: true },
  { id: 'p-92', code: '8850123392061', name: 'คุกกี้รสลูกเกด', category: 'คุกกี้สเปเชียล', multiQty: 110, plusQty: 0, overrideQty: -110, price: -1650, unitPrice: 15, delDate: '02/03/2026', selected: true },
  { id: 'p-93', code: '8850123392085', name: 'คุกกี้ช็อกซิพ', category: 'คุกกี้สเปเชียล', multiQty: 100, plusQty: 110, overrideQty: 10, price: 150, unitPrice: 15, delDate: '02/03/2026', selected: true },
  { id: 'p-94', code: '8850123392139', name: 'ฟรุ้ตพายสับปะรด', category: 'คุกกี้สเปเชียล', multiQty: 90, plusQty: 0, overrideQty: -90, price: -1620, unitPrice: 18, delDate: '02/03/2026', selected: true },
  { id: 'p-95', code: '8850123392146', name: 'ฟรุ้ตพายสตรอฯ', category: 'คุกกี้สเปเชียล', multiQty: 80, plusQty: 95, overrideQty: 15, price: 270, unitPrice: 18, delDate: '02/03/2026', selected: true },
  { id: 'p-96', code: '8850123392177', name: 'ฟรุ้ตพายบลูฯ', category: 'คุกกี้สเปเชียล', multiQty: 75, plusQty: 0, overrideQty: -75, price: -1350, unitPrice: 18, delDate: '02/03/2026', selected: true },
  { id: 'p-97', code: '8850123392603', name: 'บัตเตอร์วานิลา', category: 'คุกกี้สเปเชียล', multiQty: 85, plusQty: 100, overrideQty: 15, price: 225, unitPrice: 15, delDate: '02/03/2026', selected: true },
  { id: 'p-98', code: '8850123392610', name: 'บัดเตอร์ช็อกโก้ฯ', category: 'คุกกี้สเปเชียล', multiQty: 70, plusQty: 0, overrideQty: -70, price: -1050, unitPrice: 15, delDate: '02/03/2026', selected: true },
  { id: 'p-99', code: '8850123392627', name: 'บัตเตอร์ส้มฮอกฯ', category: 'คุกกี้สเปเชียล', multiQty: 60, plusQty: 75, overrideQty: 15, price: 225, unitPrice: 15, delDate: '02/03/2026', selected: true },
  { id: 'p-100', code: '8850123392634', name: 'บัตเตอร์บูลเล่ฯ', category: 'คุกกี้สเปเชียล', multiQty: 50, plusQty: 0, overrideQty: -50, price: -750, unitPrice: 15, delDate: '02/03/2026', selected: true },

  // 1091 เค้กโรล
  { id: 'p-101', code: '8850123390029', name: 'เค้กโรลวนิลา60ก', category: 'เค้กโรล', multiQty: 250, plusQty: 270, overrideQty: 20, price: 260, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-102', code: '8850123390036', name: 'เค้กโรลกาแฟ60ก', category: 'เค้กโรล', multiQty: 240, plusQty: 0, overrideQty: -240, price: -3120, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-103', code: '8850123390050', name: 'เค้กโรลใบเตย60ก', category: 'เค้กโรล', multiQty: 230, plusQty: 250, overrideQty: 20, price: 260, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-104', code: '8850123390135', name: 'เค้กโรลส้ม60ก', category: 'เค้กโรล', multiQty: 220, plusQty: 0, overrideQty: -220, price: -2860, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-105', code: '8850123390203', name: 'เค้กโรลนมฮอก60ก', category: 'เค้กโรล', multiQty: 210, plusQty: 225, overrideQty: 15, price: 195, unitPrice: 13, delDate: '02/03/2026', selected: true },

  // 1092 แซนวิชเค้กสด
  { id: 'p-106', code: '8850123395307', name: 'แซนวิชเค้กวนิลา', category: 'แซนวิชเค้กสด', multiQty: 180, plusQty: 195, overrideQty: 15, price: 180, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-107', code: '8850123395314', name: 'แซนวิชเค้กกาแฟ', category: 'แซนวิชเค้กสด', multiQty: 170, plusQty: 0, overrideQty: -170, price: -2040, unitPrice: 12, delDate: '02/03/2026', selected: true },
  { id: 'p-108', code: '8850123395321', name: 'แซนวิชเค้กใบเตย', category: 'แซนวิชเค้กสด', multiQty: 160, plusQty: 170, overrideQty: 10, price: 120, unitPrice: 12, delDate: '02/03/2026', selected: true },

  // 1093 เค้กกล้วยหอม
  { id: 'p-109', code: '8850123395505', name: 'เค้กกล้วยหอม', category: 'เค้กกล้วยหอม', multiQty: 140, plusQty: 0, overrideQty: -140, price: -1400, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-110', code: '8850123395529', name: 'กล้วยหอมอัลมอน', category: 'เค้กกล้วยหอม', multiQty: 130, plusQty: 150, overrideQty: 20, price: 200, unitPrice: 10, delDate: '02/03/2026', selected: true },
  { id: 'p-111', code: '8850123395536', name: 'กล้วยหอมช็อกชิพ', category: 'เค้กกล้วยหอม', multiQty: 120, plusQty: 0, overrideQty: -120, price: -1200, unitPrice: 10, delDate: '02/03/2026', selected: true },

  // 1094 ขนมปังโมจิ
  { id: 'p-112', code: '8850123395604', name: 'โมจิเนยอัลมอยด์', category: 'ขนมปังโมจิ', multiQty: 110, plusQty: 120, overrideQty: 10, price: 140, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-113', code: '8850123395611', name: 'โมจิดับเบิ้ลชอก', category: 'ขนมปังโมจิ', multiQty: 100, plusQty: 0, overrideQty: -100, price: -1400, unitPrice: 14, delDate: '02/03/2026', selected: true },

  // 1130 เค้กโดรายากิ
  { id: 'p-114', code: '8850123396038', name: 'โดราฯคัสตาร์ด60', category: 'เค้กโดรายากิ', multiQty: 150, plusQty: 170, overrideQty: 20, price: 260, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-115', code: '8850123396045', name: 'โดราฯชอกโกแลต60', category: 'เค้กโดรายากิ', multiQty: 140, plusQty: 0, overrideQty: -140, price: -1820, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-116', code: '8850123396069', name: 'โดราฯอัลมอนด์60', category: 'เค้กโดรายากิ', multiQty: 130, plusQty: 145, overrideQty: 15, price: 195, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-117', code: '8850123396083', name: 'โดราฯช็อกชิพ60ก', category: 'เค้กโดรายากิ', multiQty: 120, plusQty: 0, overrideQty: -120, price: -1560, unitPrice: 13, delDate: '02/03/2026', selected: true },
  { id: 'p-118', code: '8850123396151', name: 'โดราโอวัลติน', category: 'เค้กโดรายากิ', multiQty: 110, plusQty: 125, overrideQty: 15, price: 210, unitPrice: 14, delDate: '02/03/2026', selected: true },

  // 1145 บราวนี่
  { id: 'p-119', code: '8850123397004', name: 'บราวนี่อัลมอนด์', category: 'บราวนี่', multiQty: 90, plusQty: 105, overrideQty: 15, price: 210, unitPrice: 14, delDate: '02/03/2026', selected: true },
  { id: 'p-120', code: '8850123397011', name: 'บราวนี่สลี้ททะ', category: 'บราวนี่', multiQty: 80, plusQty: 0, overrideQty: -80, price: -1120, unitPrice: 14, delDate: '02/03/2026', selected: true },

  // 2020 เซ็ตคุกกี้และเค้กเทศกาล
  { id: 'p-121', code: '8850123505171', name: 'คุกกี้เนยสด', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 60, plusQty: 75, overrideQty: 15, price: 330, unitPrice: 22, delDate: '02/03/2026', selected: true },
  { id: 'p-122', code: '8850123505195', name: 'คุกกี้ลูกเกด', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 50, plusQty: 0, overrideQty: -50, price: -1100, unitPrice: 22, delDate: '02/03/2026', selected: true },
  { id: 'p-123', code: '8850123505591', name: 'คุกกี้ช็อกชิพ', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 40, plusQty: 50, overrideQty: 10, price: 220, unitPrice: 22, delDate: '02/03/2026', selected: true },
  { id: 'p-124', code: '8850123513640', name: 'ฟรุ้ตพายสตรอเบอรี่ใหญ่', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 10, plusQty: 0, overrideQty: -10, price: -2400, unitPrice: 240, delDate: '02/03/2026', selected: true },
  { id: 'p-125', code: '8850123513657', name: 'ฟรุ้ตพายสับปะรดใหญ่', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 12, plusQty: 15, overrideQty: 3, price: 660, unitPrice: 220, delDate: '02/03/2026', selected: true },
  { id: 'p-126', code: '8850123515750', name: 'บัตเตอร์พายเนยสด(G)', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 15, plusQty: 0, overrideQty: -15, price: -2700, unitPrice: 180, delDate: '02/03/2026', selected: true },
  { id: 'p-127', code: '8850123515767', name: 'G-คุกกี้กล่อง', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 8, plusQty: 10, overrideQty: 2, price: 360, unitPrice: 180, delDate: '02/03/2026', selected: true },
  { id: 'p-128', code: '8850123515798', name: 'ขาไก่เนย (G)', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 25, plusQty: 0, overrideQty: -25, price: -4500, unitPrice: 180, delDate: '02/03/2026', selected: true },
  { id: 'p-129', code: '8850123515811', name: 'ซีลามอนเนส (G)', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 30, plusQty: 35, overrideQty: 5, price: 900, unitPrice: 180, delDate: '02/03/2026', selected: true },
  { id: 'p-130', code: '8850123515828', name: 'G-ฟรุ้ตพายสับฯ', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 20, plusQty: 0, overrideQty: -20, price: -2800, unitPrice: 140, delDate: '02/03/2026', selected: true },
  { id: 'p-131', code: '8850123515835', name: 'G-ฟรุ้ตพายสตรอฯ', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 18, plusQty: 20, overrideQty: 2, price: 300, unitPrice: 150, delDate: '02/03/2026', selected: true },
  { id: 'p-132', code: '8850123515842', name: 'G-คุกกี้อัลมอนด์', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 10, plusQty: 0, overrideQty: -10, price: -1800, unitPrice: 180, delDate: '02/03/2026', selected: true },
  { id: 'p-133', code: '8850123519277', name: 'บิมิฟรุ้ตสับฯ', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 40, plusQty: 50, overrideQty: 10, price: 850, unitPrice: 85, delDate: '02/03/2026', selected: true },
  { id: 'p-134', code: '885012319284', name: 'มิมิฟรุ้ตสตรอฯ', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 35, plusQty: 0, overrideQty: -35, price: -3500, unitPrice: 100, delDate: '02/03/2026', selected: true },
  { id: 'p-135', code: '8850123520921', name: 'C.ALMOND', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 15, plusQty: 18, overrideQty: 3, price: 405, unitPrice: 135, delDate: '02/03/2026', selected: true },
  { id: 'p-136', code: '8850123520938', name: 'C.SUPERIER', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 20, plusQty: 0, overrideQty: -20, price: -2700, unitPrice: 135, delDate: '02/03/2026', selected: true },
  { id: 'p-137', code: '8850123520945', name: 'C.DOUBLE CHOC', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 12, plusQty: 15, overrideQty: 3, price: 405, unitPrice: 135, delDate: '02/03/2026', selected: true },
  { id: 'p-138', code: '8850123520952', name: 'C.CEREAL', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 10, plusQty: 0, overrideQty: -10, price: -1350, unitPrice: 135, delDate: '02/03/2026', selected: true },
  { id: 'p-139', code: '8850123521966', name: 'C.BERRYMIX 145G', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 25, plusQty: 28, overrideQty: 3, price: 405, unitPrice: 135, delDate: '02/03/2026', selected: true },
  { id: 'p-140', code: '8850123529559', name: 'ซีเรียลคุ้กกี้(G)', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 14, plusQty: 0, overrideQty: -14, price: -2520, unitPrice: 180, delDate: '02/03/2026', selected: true },
  { id: 'p-141', code: '8850123529726', name: 'G-ดับเบิ้ลช็อก', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 8, plusQty: 10, overrideQty: 2, price: 360, unitPrice: 180, delDate: '02/03/2026', selected: true },
  { id: 'p-142', code: '8850123529733', name: 'G-เบอร์รี่มิกซ์', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 10, plusQty: 0, overrideQty: -10, price: -1800, unitPrice: 180, delDate: '02/03/2026', selected: true },
  { id: 'p-143', code: '8850123554391', name: 'มีฟรุ้ตพายสับฯ', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 30, plusQty: 32, overrideQty: 2, price: 200, unitPrice: 100, delDate: '02/03/2026', selected: true },
  { id: 'p-144', code: '8850123554407', name: 'G-ฟรุ้ตพายบลูฯ', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 15, plusQty: 0, overrideQty: -15, price: -2250, unitPrice: 150, delDate: '02/03/2026', selected: true },
  { id: 'p-145', code: '8850123555114', name: 'Set มีฟรุ้ตพาย', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 5, plusQty: 6, overrideQty: 1, price: 270, unitPrice: 270, delDate: '02/03/2026', selected: true },
  { id: 'p-146', code: '8850123555121', name: 'Set ฟรุ้ตพาย G', category: 'เซ็ตคุกกี้และเค้กเทศกาล', multiQty: 4, plusQty: 0, overrideQty: -4, price: -1160, unitPrice: 290, delDate: '02/03/2026', selected: true }
];

export const CATEGORIES = CATEGORY_DEFINITIONS.map(cat => cat.name);

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

export const INITIAL_USERS = [
  { username: 'Admin', pass: '1234', level: 1, roleName: 'Admin', description: 'ดูแลระบบทั้งหมด จัดการ User ทุกคน', department: 'IT' },
  { username: 'M-2', pass: '1234', level: 2, roleName: 'Manager', description: 'อนุมัติสูตร, คำนวณสูตร, บันทึกยอด', department: 'MARKETING' },
  { username: 'S-2', pass: '1234', level: 2, roleName: 'Manager', description: 'อนุมัติสูตร, คำนวณสูตร, บันทึกยอด', department: 'SALE' },
  { username: 'M-3', pass: '1234', level: 3, roleName: 'Staff', description: 'คำนวณสูตร, บันทึกยอด', department: 'MARKETING' },
  { username: 'S-3', pass: '1234', level: 3, roleName: 'Staff', description: 'คำนวณสูตร, บันทึกยอด', department: 'SALE' },
  { username: 'M-4', pass: '1234', level: 4, roleName: 'Viewer', description: 'ดูรายงานอย่างเดียว แก้ไขไม่ได้', department: 'MARKETING' },
  { username: 'S-4', pass: '1234', level: 4, roleName: 'Viewer', description: 'ดูรายงานอย่างเดียว แก้ไขไม่ได้', department: 'SALE' }
];

