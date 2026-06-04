import * as React from 'react';
import { useState } from 'react';
import { User, Lock, AlertCircle, ShieldAlert, X, Phone, Mail, Clock } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (username: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUser = username.trim();

    if (!trimmedUser || !password.trim()) {
      setError('กรุณากรอกผู้ใช้งานและรหัสผ่าน');
      return;
    }

    setIsLoading(true);

    // Simulate small latency for clean user experience feedback
    setTimeout(() => {
      if (trimmedUser === 'admin' && password === '1234') {
        onLoginSuccess(trimmedUser);
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleForgotPassword = () => {
    setShowForgotModal(true);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#ca1a1b] overflow-hidden select-none">
      {/* BACKGROUND ORGANIC GEOMETRIC CURVES (AUTHENTIC REPLICA FROM SCREENSHOT) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-Right and Right swooping warm organic curve */}
          <path
            d="M 533 0 C 680 150, 1150 50, 1140 240 C 1080 500, 1050 600, 1440 900 L 1440 0 Z"
            fill="#feedef"
          />
          
          {/* Another wave layer for depth on the right side */}
          <path
            d="M 1140 240 C 1050 480, 1180 620, 1440 800 L 1440 240 Z"
            fill="#fae3e6"
            opacity="0.6"
          />

          {/* Bottom-Left Concentric Arcs */}
          {/* Large Arc */}
          <circle
            cx="-30"
            cy="930"
            r="440"
            stroke="#feedef"
            strokeWidth="56"
            fill="none"
          />
          {/* Middle Arc */}
          <circle
            cx="-30"
            cy="930"
            r="320"
            stroke="#feedef"
            strokeWidth="44"
            fill="none"
          />
          {/* Inner Arc */}
          <circle
            cx="-30"
            cy="930"
            r="200"
            stroke="#feedef"
            strokeWidth="32"
            fill="none"
          />
          {/* Central fill in the very corner */}
          <circle
            cx="-30"
            cy="930"
            r="80"
            fill="#feedef"
          />
        </svg>
      </div>

      {/* LOGIN CONTENT WINDOW */}
      <div className="relative z-10 w-full max-w-sm px-6 pb-12 flex flex-col items-center">

        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          {/* Username Input Container */}
          <div className="relative flex items-center transition-all">
            <span className="absolute left-4 z-10">
              <User className="w-5 h-5 text-white/90" />
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="USERNAME"
              className="w-full h-13 pl-12 pr-4 bg-[#b51718]/45 border border-white/60 rounded-sm text-white placeholder-white/70 font-sans tracking-widest text-sm uppercase focus:outline-none focus:bg-[#b01718]/60 focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Password Input Container */}
          <div className="relative flex items-center transition-all">
            <span className="absolute left-4 z-10">
              <Lock className="w-5 h-5 text-white/90" />
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              className="w-full h-13 pl-12 pr-4 bg-[#b51718]/45 border border-white/60 rounded-sm text-white placeholder-white/70 font-sans tracking-widest text-sm uppercase focus:outline-none focus:bg-[#b01718]/60 focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {/* Validation/Authentication Error Display Info */}
          {error && (
            <div className="flex items-start gap-2 bg-red-900/60 border border-red-500/50 rounded-sm p-3 text-red-200 text-xs text-center justify-center animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-300 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 bg-white hover:bg-white/95 text-[#ca1a1b] font-black tracking-widest text-sm uppercase rounded-sm cursor-pointer shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-[#ca1a1b]/30 border-t-[#ca1a1b] rounded-full animate-spin" />
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        {/* Forgot Password Trigger */}
        <button
          id="forgot-password-trigger-btn"
          onClick={handleForgotPassword}
          className="mt-6 text-white/80 hover:text-white hover:underline transition-all text-xs font-semibold cursor-pointer tracking-wider"
        >
          ลืมรหัสผ่านใช่หรือไม่? (Forgot Password?)
        </button>

      </div>

      {/* SECURE POPUP / MODAL DIALOG MATCHING BRAND STYLE */}
      {showForgotModal && (
        <div 
          id="forgot-password-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in transition-all"
        >
          <div 
            id="forgot-password-modal-card"
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative transform scale-100 transition-all focus:outline-none"
          >
            {/* Top Red Gradient Header */}
            <div className="bg-gradient-to-r from-[#ba191a] to-[#ca1a1b] p-5 text-white flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide uppercase">ระบบรักษาความปลอดภัยพรีเซล</h3>
                <p className="text-[10px] text-red-100 font-medium">Security Access Control</p>
              </div>
              <button 
                id="close-modal-top-btn"
                onClick={() => setShowForgotModal(false)}
                className="ml-auto text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-all cursor-pointer"
                title="ปิดหน้าต่าง"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h4 className="text-slate-800 font-extrabold text-[15px] leading-tight">
                  กรุณาติดต่อแผนกเทคโนโลยีสารสนเทศ (IT Department)
                </h4>
                <p className="text-slate-500 font-medium text-xs leading-relaxed">
                  เพื่อความปลอดภัยขั้นสูงสุด ในกรณีที่คุณต้องการรีเซ็ตรหัสผ่านพรีเซล ตั้งค่าสิทธิ์การใช้งาน หรือปรับเปลี่ยนผู้ดูแลระบบพรีเซลประจำวัน กรุณาแจ้งเรื่องโดยตรงต่อเจ้าหน้าที่ IT
                </p>
                <p className="text-slate-400 font-normal text-[11px] italic leading-tight">
                  For security compliance, please request credentials changes or password recovery through the Enterprise IT Service Helpdesk.
                </p>
              </div>

              {/* Service Channels Information Box */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2.5">
                <span className="text-[10.5px] font-extrabold text-[#ba191a] tracking-wider block border-b border-slate-200/60 pb-1 uppercase">
                  เจ้าหน้าที่ผู้ดูแลระบบ (System Administrator Contacts)
                </span>
                
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <User className="w-4 h-4 text-[#ba191a] shrink-0" />
                  <div>
                    <span className="font-extrabold">เจ้าหน้าที่ผู้รับผิดชอบ:</span> คุณพินิจนันท์ เปรมปรีดิ์ (ผู้จัดการส่วนเกิน)
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-4 h-4 text-[#ba191a] shrink-0" />
                  <div>
                    <span className="font-extrabold">เบอร์โทรศัพท์ติดต่อภายใน:</span> โทร. 3916
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-4 h-4 text-[#ba191a] shrink-0" />
                  <div>
                    <span className="font-extrabold">อีเมลประสานงานกลาง:</span> <a href="mailto:it-support@presale-farmhouse.co.th" className="text-[#ba191a] hover:underline font-bold">it-support@presale-farmhouse.co.th</a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="w-4 h-4 text-[#ba191a] shrink-0" />
                  <div>
                    <span className="font-extrabold">เวลาปฏิบัติงาน:</span> วันจันทร์ - วันศุกร์ (07:30 น. - 17:00 น.)
                  </div>
                </div>
              </div>

              {/* Secure Tip Alert block */}
              <div className="p-3 bg-red-50/50 rounded-lg flex gap-2.5 text-rose-850 text-[10px] leading-relaxed border border-red-100/40">
                <ShieldAlert className="w-4 h-4 text-[#ba191a] shrink-0" />
                <span>
                  <strong>โปรดระวัง:</strong> ห้ามเปิดเผยข้อมูลผู้ใช้งานหรือรหัสผ่านแก่ผู้แอบอ้างสิทธิ์ภายนอกเด็ดขาด เจ้าหน้าที่ระบบพรีเซลจะไม่มีการร้องขอรหัสผ่านของคุณไม่ว่ากรณีใดๆ
                </span>
              </div>
            </div>

            {/* Footer containing clear Confirm / Close button */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
              <button
                id="close-modal-bottom-btn"
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-5 py-2.5 bg-[#ba191a] hover:bg-[#a01516] text-white font-black text-xs tracking-wider rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>รับทราบและปิดหน้าต่าง</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
