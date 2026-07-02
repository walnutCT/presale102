/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Product } from '../types';
import { Users, Shield, Trash2, Plus, Key, CheckCircle, Info, Search, FileText, BarChart2, Calendar } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser: (newUser: User) => void;
  onDeleteUser: (username: string) => void;
  onUpdateUserPass: (username: string, newPass: string) => void;
  finalizedProducts: Product[] | null;
  onDeleteFinalizedProduct: (rIdx: number) => void;
  onClearAllFinalizedProducts: () => void;
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function UserManagement({
  users,
  onAddUser,
  onDeleteUser,
  onUpdateUserPass,
  finalizedProducts,
  onDeleteFinalizedProduct,
  onClearAllFinalizedProducts,
  triggerConfirm
}: UserManagementProps) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('1234');
  const [newLevel, setNewLevel] = useState<number>(3); // Default to Staff (Level 3)
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editPassValue, setEditPassValue] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // States for Admin Work Summary Panel
  const [summaryTab, setSummaryTab] = useState<'grouped' | 'raw_logs'>('grouped');
  const [summarySearch, setSummarySearch] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'data_summary'>('users');

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
      description: duties
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
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2 sticky top-24">
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
              <div className="font-extrabold text-[12px]">จัดการสิทธิ์ผู้ใช้งาน</div>
              <div className="text-[9.5px] opacity-70 font-bold">เพิ่ม/ลบ สิทธิ์และรหัสผ่าน ({users.length})</div>
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
              <div className="font-extrabold text-[12px]">สรุปผลงาน & ข้อมูลดิบ</div>
              <div className="text-[9.5px] opacity-70 font-bold">ยอดสุทธิ & มูลค่าบาทสะสม</div>
            </div>
          </button>
        </div>

        {/* RIGHT CONTENT DISPLAY WINDOW (Span 9) */}
        <div className="lg:col-span-9 space-y-6">
          
          {activeAdminTab === 'users' ? (
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
                    <label className="text-[10px] font-extrabold text-slate-400 block uppercase tracking-wider">
                      ชื่อผู้ใช้ (Username)
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      placeholder="เช่น M-5, S-5, Viewer-2"
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
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <h3 className="text-slate-800 font-black text-sm uppercase tracking-wide flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#ba191a]" />
                      รายชื่อผู้ใช้งานและรหัสผ่านทดลองในระบบ
                    </h3>
                    <span className="text-[10px] bg-slate-100 text-slate-500 font-extrabold px-2 py-0.5 rounded-full">
                      ทั้งหมด {users.length} บัญชี
                    </span>
                  </div>

                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse table-fixed text-xs font-sans">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[20%] border-r border-slate-200">ลำดับขั้น</th>
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[35%] border-r border-slate-200">User (ชื่อผู้ใช้งาน)</th>
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[30%] border-r border-slate-200">PASS (รหัสผ่าน)</th>
                          <th className="px-4 py-2 text-center font-black text-[10px] w-[15%]">การดำเนินงาน</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {users.map((user, idx) => {
                          const colors = getLevelColorClasses(user.level);
                          return (
                            <tr key={user.username} className="hover:bg-slate-50/50 transition-colors">
                              
                              {/* Level with Color */}
                              <td className={`px-4 py-3 text-center border-r border-slate-200 font-black font-mono ${colors.bg} ${colors.text}`}>
                                {user.level}
                              </td>
                              
                              {/* Username Row with Role color badge */}
                              <td className="px-4 py-3 border-r border-slate-200 font-black text-slate-800 text-center flex items-center justify-center gap-2 h-full">
                                <span className="truncate">{user.username}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold font-mono uppercase ${colors.badge}`}>
                                  {user.roleName}
                                </span>
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

                {/* PRIVILEGES DEFINITION DIALOG */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="text-slate-800 font-black text-sm uppercase tracking-wide flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      ตารางข้อมูลสรุปลำดับขั้นสิทธิ์และหน้าที่ผู้ใช้ประจำวัน (User Level Duties Matrix)
                    </h3>
                  </div>

                  <div className="overflow-hidden border border-slate-200 rounded-xl">
                    <table className="w-full text-left border-collapse table-fixed text-xs font-sans">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                          <th className="px-4 py-2.5 text-center font-black text-[10px] w-[15%] border-r border-slate-200">ระดับ</th>
                          <th className="px-4 py-2.5 text-center font-black text-[10px] w-[25%] border-r border-slate-200">ชื่อระดับสิทธิ์</th>
                          <th className="px-4 py-2.5 text-left font-black text-[10px] w-[60%]">หน้าที่รับผิดชอบขอบเขตระบบ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {/* Row 1: Admin */}
                        <tr className="bg-[#fff2cc]/20 hover:bg-[#fff2cc]/40 transition-colors">
                          <td className="px-4 py-3.5 text-center font-black font-mono text-[#7f6000] border-r border-slate-200 bg-[#fff2cc]">1</td>
                          <td className="px-4 py-3.5 text-center font-black text-[#7f6000] border-r border-slate-200 bg-[#fff2cc]">Admin</td>
                          <td className="px-4 py-3.5 text-left font-extrabold text-slate-700">ดูแลระบบทั้งหมด จัดการ User ทุกคน</td>
                        </tr>
                        
                        {/* Row 2: Manager */}
                        <tr className="bg-[#cfe2f3]/20 hover:bg-[#cfe2f3]/40 transition-colors">
                          <td className="px-4 py-3.5 text-center font-black font-mono text-[#0b5394] border-r border-slate-200 bg-[#cfe2f3]">2</td>
                          <td className="px-4 py-3.5 text-center font-black text-[#0b5394] border-r border-slate-200 bg-[#cfe2f3]">Manager</td>
                          <td className="px-4 py-3.5 text-left font-extrabold text-slate-700">อนุมัติสูตร, คำนวณสูตร, บันทึกยอด</td>
                        </tr>

                        {/* Row 3: Staff */}
                        <tr className="bg-[#d9ead3]/20 hover:bg-[#d9ead3]/40 transition-colors">
                          <td className="px-4 py-3.5 text-center font-black font-mono text-[#274e13] border-r border-slate-200 bg-[#d9ead3]">3</td>
                          <td className="px-4 py-3.5 text-center font-black text-[#274e13] border-r border-slate-200 bg-[#d9ead3]">Staff</td>
                          <td className="px-4 py-3.5 text-left font-extrabold text-slate-700">คำนวณสูตร, บันทึกยอด</td>
                        </tr>

                        {/* Row 4: Viewer */}
                        <tr className="bg-[#fce5cd]/20 hover:bg-[#fce5cd]/40 transition-colors">
                          <td className="px-4 py-3.5 text-center font-black font-mono text-[#783f04] border-r border-slate-200 bg-[#fce5cd]">4</td>
                          <td className="px-4 py-3.5 text-center font-black text-[#783f04] border-r border-slate-200 bg-[#fce5cd]">Viewer</td>
                          <td className="px-4 py-3.5 text-left font-extrabold text-slate-700">ดูรายงานอย่างเดียว แก้ไขไม่ได้</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            /* DETAILED WORK SUMMARY SECTION FOR ADMIN (Rendered when activeAdminTab === 'data_summary') */
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in">
              <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
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

                {/* Sub Tab Switches */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 shrink-0 self-start md:self-auto text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSummaryTab('grouped');
                      setSummarySearch('');
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
                      setSummarySearch('');
                    }}
                    className={`px-3 py-1.5 rounded-lg font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                      summaryTab === 'raw_logs' 
                        ? 'bg-white text-rose-700 shadow-sm border border-slate-200/50' 
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>รายการบันทึกดิบละเอียด ({(finalizedProducts || []).length})</span>
                  </button>
                </div>
              </div>

              {/* Controls (Search + Clear All Data Actions) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs w-full max-w-md">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={summarySearch}
                    onChange={(e) => setSummarySearch(e.target.value)}
                    placeholder={
                      summaryTab === 'grouped'
                        ? "ค้นหาชื่อผู้ใช้งาน..."
                        : "ค้นหาผู้บันทึก, รหัสสินค้า, ชื่อสินค้า..."
                    }
                    className="bg-transparent border-none outline-none w-full font-bold text-slate-700"
                  />
                  {summarySearch && (
                    <button
                      type="button"
                      onClick={() => setSummarySearch('')}
                      className="text-slate-400 hover:text-slate-600 font-extrabold text-[10px]"
                    >
                      ล้าง
                    </button>
                  )}
                </div>

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
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>ล้างข้อมูลบันทึกของทุกคน ({finalizedProducts.length} รายการ)</span>
                  </button>
                )}
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

                const filteredGroupedData = processedGroupedData.filter(item => 
                  item.username.toLowerCase().includes(summarySearch.trim().toLowerCase())
                );

                return (
                  <div className="overflow-hidden border border-rose-100 rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-rose-50/70 text-rose-800 border-b border-rose-100 font-bold">
                          <th className="px-4 py-3 text-left font-black">👤 ผู้บันทึกงาน / สิทธิ์</th>
                          <th className="px-4 py-3 text-center font-black">จำนวนรายการที่ทำ</th>
                          <th className="px-4 py-3 text-right font-black">ลบสะสม (Multi)</th>
                          <th className="px-4 py-3 text-right font-black">บวกสะสม (Plus)</th>
                          <th className="px-4 py-3 text-right font-black">สุทธิรวม (ชิ้น)</th>
                          <th className="px-4 py-3 text-right font-black">มูลค่ารวม (บาท)</th>
                          <th className="px-4 py-3 text-center font-black">เวลาบันทึกล่าสุด</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {filteredGroupedData.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-10 text-center text-slate-400 font-bold italic">
                              ไม่พบประวัติผลงานการบันทึกข้อมูล
                            </td>
                          </tr>
                        ) : (
                          filteredGroupedData.map((item) => {
                            const colors = getLevelColorClasses(item.level);
                            return (
                              <tr key={item.username} className="hover:bg-rose-50/10 transition-colors">
                                <td className="px-4 py-3 align-middle font-black text-slate-850">
                                  <div className="flex items-center gap-2">
                                    <span>👤 {item.username}</span>
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold font-mono uppercase ${colors.badge}`}>
                                      {item.roleName}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center font-bold font-mono text-slate-750">
                                  {item.totalRecords.toLocaleString()} รายการ
                                </td>
                                <td className="px-4 py-3 text-right font-bold font-mono text-rose-600">
                                  {item.totalMulti !== 0 ? `-${item.totalMulti.toLocaleString()}` : '0'}
                                </td>
                                <td className="px-4 py-3 text-right font-bold font-mono text-emerald-600">
                                  {item.totalPlus !== 0 ? `+${item.totalPlus.toLocaleString()}` : '0'}
                                </td>
                                <td className={`px-4 py-3 text-right font-bold font-mono ${item.totalNet < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                  {item.totalNet > 0 ? `+${item.totalNet.toLocaleString()}` : item.totalNet.toLocaleString()}
                                </td>
                                <td className={`px-4 py-3 text-right font-bold font-mono ${item.totalPrice < 0 ? 'text-rose-600' : item.totalPrice > 0 ? 'text-emerald-600' : 'text-slate-550'}`}>
                                  {item.totalPrice.toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-center font-bold font-mono text-slate-500 text-[11px]">
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
                const filteredRawLogs = rawLogsData.filter(log => {
                  const q = summarySearch.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    (log.addedBy || '').toLowerCase().includes(q) ||
                    (log.code || '').toLowerCase().includes(q) ||
                    (log.name || '').toLowerCase().includes(q)
                  );
                });

                return (
                  <div className="overflow-hidden border border-rose-100 rounded-2xl shadow-sm">
                    <div className="max-h-[450px] overflow-y-auto no-scrollbar">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead>
                          <tr className="bg-rose-50/70 text-rose-800 border-b border-rose-100 font-bold sticky top-0 z-10">
                            <th className="px-4 py-3 text-left font-black">สินค้า (Product Code/Name)</th>
                            <th className="px-4 py-3 text-center font-black">👤 ผู้บันทึก / เวลา</th>
                            <th className="px-4 py-3 text-right font-black">ลบ (Multi)</th>
                            <th className="px-4 py-3 text-right font-black">บวก (Plus)</th>
                            <th className="px-4 py-3 text-right font-black">สุทธิ(ชิ้น)</th>
                            <th className="px-4 py-3 text-right font-black">บาท</th>
                            <th className="px-4 py-3 text-center font-black">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {filteredRawLogs.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-4 py-10 text-center text-slate-400 font-bold italic">
                                ไม่พบประวัติผลงานการบันทึกข้อมูลรายสินค้า
                              </td>
                            </tr>
                          ) : (
                            filteredRawLogs.map((r, rIdx) => (
                              <tr key={r.id || rIdx} className="hover:bg-rose-50/10 transition-colors">
                                <td className="px-4 py-3 align-middle">
                                  <div className="font-bold text-slate-900 font-mono text-[11px]">{r.code}</div>
                                  <div className="font-extrabold text-slate-600 text-[11px] truncate max-w-xs">{r.name}</div>
                                </td>
                                <td className="px-4 py-3 align-middle text-center">
                                  <div className="font-black text-slate-850">👤 {r.addedBy || 'ไม่ระบุชื่อ'}</div>
                                  <div className="text-[10px] text-slate-500 font-mono font-bold">{r.addedAt}</div>
                                </td>
                                <td className="px-4 py-3 text-right text-rose-600 font-bold font-mono align-middle">
                                  {r.multiQty !== 0 ? `-${r.multiQty.toLocaleString()}` : '0'}
                                </td>
                                <td className="px-4 py-3 text-right text-emerald-600 font-bold font-mono align-middle">
                                  {r.plusQty !== 0 ? `+${r.plusQty.toLocaleString()}` : '0'}
                                </td>
                                <td className={`px-4 py-3 text-right font-bold font-mono align-middle ${r.overrideQty < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                  {r.overrideQty > 0 ? `+${r.overrideQty.toLocaleString()}` : r.overrideQty.toLocaleString()}
                                </td>
                                <td className={`px-4 py-3 text-right font-bold font-mono align-middle ${r.price < 0 ? 'text-rose-600' : r.price > 0 ? 'text-emerald-600' : 'text-slate-550'}`}>
                                  {r.price.toLocaleString()}
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
                                    className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                    title="ลบบันทึกรายการนี้"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mx-auto" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
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
