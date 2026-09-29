import React from 'react';
import { ShieldCheck, FileCheck, Headset, BookOpen } from 'lucide-react';

interface QuickActionCardsProps {
  onActivateWarranty: () => void;
  onCheckStatus: () => void;
  onContactSupport: () => void;
  onViewPolicy: () => void;
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  onActivateWarranty,
  onCheckStatus,
  onContactSupport,
  onViewPolicy,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8">
      
      {/* Card 1 (Rightmost in RTL): تفعيل الضمان */}
      <button
        type="button"
        onClick={onActivateWarranty}
        className="group bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-emerald-500/10 border border-slate-100/80 hover:border-emerald-200 transition-all text-center flex flex-col items-center cursor-pointer active:scale-98"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <ShieldCheck size={26} />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors leading-normal">
          تفعيل الضمان
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-1 font-normal leading-normal">
          تفعيل ضمان منتج جديد
        </p>
      </button>

      {/* Card 2: حالة الضمان */}
      <button
        type="button"
        onClick={onCheckStatus}
        className="group bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 border border-slate-100/80 hover:border-blue-200 transition-all text-center flex flex-col items-center cursor-pointer active:scale-98"
      >
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <FileCheck size={26} />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-normal">
          حالة الضمان
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-1 font-normal leading-normal">
          التحقق من حالة الضمان
        </p>
      </button>

      {/* Card 3: خدمة العملاء */}
      <button
        type="button"
        onClick={onContactSupport}
        className="group bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-amber-500/10 border border-slate-100/80 hover:border-amber-200 transition-all text-center flex flex-col items-center cursor-pointer active:scale-98"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Headset size={26} />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-amber-700 transition-colors leading-normal">
          خدمة العملاء
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-1 font-normal leading-normal">
          تقديم استفسار أو شكوى
        </p>
      </button>

      {/* Card 4 (Leftmost in RTL): سياسة الضمان */}
      <button
        type="button"
        onClick={onViewPolicy}
        className="group bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-purple-500/10 border border-slate-100/80 hover:border-purple-200 transition-all text-center flex flex-col items-center cursor-pointer active:scale-98"
      >
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <BookOpen size={26} />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-purple-700 transition-colors leading-normal">
          سياسة الضمان
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-1 font-normal leading-normal">
          الاطلاع على سياسة الضمان
        </p>
      </button>

    </div>
  );
};
