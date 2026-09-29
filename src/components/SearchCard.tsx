import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Barcode,
  QrCode,
  User,
  Camera,
  UploadCloud,
  Mic,
  Info,
} from 'lucide-react';
import { Language } from '../utils/i18n';

type PremiumSearchMode = 'serial' | 'voice' | 'qr' | 'upload' | 'customer';

interface SearchCardProps {
  onSearchSerial: (serial: string) => void;
  onSearchCustomer: (name: string, phone: string) => void;
  onOpenQRScanner: (mode: 'camera' | 'upload') => void;
  isLoading?: boolean;
  language: Language;
}

export const SearchCard: React.FC<SearchCardProps> = ({
  onSearchSerial,
  onSearchCustomer,
  onOpenQRScanner,
  isLoading = false,
  language,
}) => {
  const [activeMode, setActiveMode] = useState<PremiumSearchMode>('serial');
  const [serialInput, setSerialInput] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const isAr = language === 'ar';

  const handleModeChange = (mode: PremiumSearchMode) => {
    setActiveMode(mode);
    setVoiceError(null);
  };

  const handleSearchClick = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (activeMode === 'serial' || activeMode === 'voice') {
      if (serialInput.trim()) onSearchSerial(serialInput.trim());
    } else if (activeMode === 'customer') {
      if (customerName.trim() || customerPhone.trim()) {
        onSearchCustomer(customerName.trim(), customerPhone.trim());
      }
    } else if (activeMode === 'qr') {
      onOpenQRScanner('camera');
    } else if (activeMode === 'upload') {
      onOpenQRScanner('upload');
    }
  };

  const startVoiceInput = async () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI || typeof SpeechRecognitionAPI !== 'function') {
      setVoiceError(isAr ? 'يرجى السماح باستخدام الميكروفون من إعدادات المتصفح' : 'Please allow microphone access in settings');
      return;
    }
    
    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = isAr ? 'ar-EG' : 'en-US';
      setIsListening(true);
      setVoiceError(null);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSerialInput(transcript.trim().replace(/\s+/g, ''));
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        setVoiceError(isAr ? 'حدث خطأ في التعرف على الصوت' : 'Voice recognition error');
      };
      
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setVoiceError(isAr ? 'تعذر تشغيل الميكروفون' : 'Microphone error');
    }
  };

  const getPlaceholder = () => {
    switch (activeMode) {
      case 'serial': return isAr ? 'أدخل الرقم التسلسلي الموجود على ملصق المنتج' : 'Enter the serial number from the label';
      case 'voice': return isAr ? 'اضغط على الميكروفون وابدأ التحدث' : 'Click mic and start speaking';
      case 'qr': return isAr ? 'امسح الرمز بالكاميرا' : 'Scan code with camera';
      case 'upload': return isAr ? 'اختر صورة الملصق' : 'Select label image';
      case 'customer': return isAr ? 'أدخل اسم العميل أو رقم الهاتف' : 'Enter name or phone';
      default: return '';
    }
  };

  const getTooltip = (mode: PremiumSearchMode) => {
    switch (mode) {
      case 'serial': return isAr ? 'البحث بالرقم التسلسلي' : 'Search by serial';
      case 'voice': return isAr ? 'التحدث بالرقم التسلسلي مباشرة' : 'Speak serial directly';
      case 'qr': return isAr ? 'استخدام كاميرا الجهاز لمسح رمز المنتج' : 'Use camera to scan QR';
      case 'upload': return isAr ? 'استخراج الرقم التسلسلي تلقائياً من صورة الملصق' : 'Extract serial from image';
      case 'customer': return isAr ? 'البحث باسم العميل أو رقم الهاتف' : 'Search by customer info';
    }
  };

  return (
    <div
      className="w-full bg-white/70 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/40 transition-all flex flex-col"
    >
      {/* 1. ICON TABS */}
      <div className="flex items-center justify-between mb-6 px-2">
        {(['serial', 'voice', 'qr', 'upload', 'customer'] as PremiumSearchMode[]).map((mode) => {
          const isActive = activeMode === mode;
          const config = {
            serial: { icon: Barcode, label: isAr ? 'الرقم التسلسلي' : 'Serial' },
            voice: { icon: Mic, label: isAr ? 'إدخال صوتي' : 'Voice' },
            qr: { icon: QrCode, label: isAr ? 'مسح QR' : 'Scan QR' },
            upload: { icon: UploadCloud, label: isAr ? 'رفع صورة' : 'Upload' },
            customer: { icon: User, label: isAr ? 'بيانات العميل' : 'Customer' },
          }[mode];
          
          const Icon = config.icon;

          return (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              title={getTooltip(mode)}
              className={`group flex flex-col items-center gap-1.5 transition-all min-w-[70px] sm:min-w-[90px] ${
                isActive ? 'text-[#0F3B82]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-3 rounded-2xl transition-all ${isActive ? 'bg-[#0F3B82]/10' : 'group-hover:bg-slate-100'}`}>
                <Icon size={24} className={isActive ? 'scale-110' : 'opacity-80'} />
              </div>
              <span className={`text-[10px] sm:text-xs font-bold uppercase transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {config.label}
              </span>
              {isActive && <div className="w-6 h-0.5 bg-[#0F3B82] rounded-full mt-1" />}
            </button>
          );
        })}
      </div>

      {/* 2. DYNAMIC SEARCH FIELDS */}
      <div className="flex-1 flex flex-col justify-center">
        {activeMode === 'customer' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <User size={20} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={isAr ? 'اسم العميل' : 'Customer Name'}
                className={`w-full h-14 ${isAr ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0F3B82] outline-none transition-all`}
              />
            </div>
            <div className="relative">
              <Camera size={20} className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-300`} />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder={isAr ? 'رقم الهاتف' : 'Phone Number'}
                className={`w-full h-14 ${isAr ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4 text-left'} bg-slate-50 border border-slate-200 rounded-xl focus:border-[#0F3B82] outline-none transition-all`}
              />
            </div>
          </div>
        ) : activeMode === 'qr' ? (
          <button
            onClick={() => onOpenQRScanner('camera')}
            className="w-full h-16 bg-[#0F3B82]/5 border-2 border-dashed border-[#0F3B82]/20 rounded-2xl flex items-center justify-center gap-3 text-[#0F3B82] font-bold hover:bg-[#0F3B82]/10 transition-all"
          >
            <Camera size={24} />
            <span>{isAr ? 'مسح QR بالكاميرا' : 'Scan QR with Camera'}</span>
          </button>
        ) : activeMode === 'upload' ? (
          <button
            onClick={() => onOpenQRScanner('upload')}
            className="w-full h-16 bg-[#0F3B82]/5 border-2 border-dashed border-[#0F3B82]/20 rounded-2xl flex items-center justify-center gap-3 text-[#0F3B82] font-bold hover:bg-[#0F3B82]/10 transition-all"
          >
            <UploadCloud size={24} />
            <span>{isAr ? 'رفع صورة المنتج أو الملصق' : 'Upload Product or Sticker Image'}</span>
          </button>
        ) : (
          <div className="relative group">
            <Search size={24} className={`absolute ${isAr ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0F3B82] transition-colors`} />
            <input
              type="text"
              value={serialInput}
              onChange={(e) => setSerialInput(e.target.value)}
              placeholder={getPlaceholder()}
              className={`w-full h-16 ${isAr ? 'pr-14 pl-16 text-right' : 'pl-14 pr-16 text-left'} bg-slate-50 border border-slate-100 rounded-[20px] text-lg font-bold text-[#0F3B82] focus:bg-white focus:border-[#0F3B82] focus:ring-4 focus:ring-[#0F3B82]/5 outline-none transition-all placeholder:text-slate-300`}
            />
            {activeMode === 'voice' && (
              <button
                type="button"
                onClick={startVoiceInput}
                className={`absolute ${isAr ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#0F3B82] text-white hover:bg-blue-800 shadow-md'
                }`}
              >
                <Mic size={20} />
              </button>
            )}
          </div>
        )}
        {voiceError && <p className="text-[10px] text-red-500 mt-1 px-4">{voiceError}</p>}
      </div>

      {/* 2.5 PREMIUM BRAND STATEMENT */}
      <div className="flex flex-col items-center text-center mt-[18px] mb-[18px] select-none">
        <h2 
          className="font-['El_Messiri',_serif] font-bold text-2xl sm:text-[28px] lg:text-[34px] tracking-[-0.5px] leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#0B3B8C] to-[#1D4ED8]"
          style={{ 
            textShadow: '0 4px 12px rgba(11,59,140,0.12)',
            WebkitBackgroundClip: 'text'
          }}
        >
          {isAr ? 'راحة تدوم' : 'Lasting Comfort'}
        </h2>
        
        {/* Signature Branding Line */}
        <div className="w-[60px] h-1 bg-blue-300/50 rounded-full mt-3 mb-2" />
        
        <p 
          className="text-sm font-medium text-[#64748B] tracking-[0.3px] leading-tight"
        >
          {isAr ? 'الضمان الرسمي المعتمد لمنتجات سليبي' : 'The official certified warranty for Sleepee products'}
        </p>
      </div>

      {/* 3. PRIMARY ACTION BUTTON */}
      <div className="flex justify-center">
        <button
          onClick={handleSearchClick}
          disabled={isLoading}
          className="w-[260px] h-[60px] bg-gradient-to-r from-[#0F3B82] to-[#1A56B8] hover:from-[#1A56B8] hover:to-[#0F3B82] text-white font-bold text-lg rounded-[18px] transition-all shadow-[0_10px_30px_rgba(15,59,130,0.2)] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck size={24} />
              <span>{isAr ? 'تحقق الآن' : 'Verify Now'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
