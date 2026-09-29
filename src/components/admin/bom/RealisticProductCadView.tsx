import React from 'react';
import { 
  Sparkles, Layers, Box, CheckCircle2, ShieldCheck, 
  ArrowLeftRight, Info, Eye
} from 'lucide-react';
import { CurrencyCode, CurrencyEngine } from '../../../services/currencyEngine';

interface RealisticProductCadViewProps {
  layers: any[];
  designModel: string;
  designBrand: string;
  designDimensions: string;
  totalThickness: number;
  isSymmetrical: boolean;
  activeCurrency: CurrencyCode;
  onSelectAssembly?: (assemblyType: 'top' | 'spring' | 'bottom' | 'border') => void;
}

export const RealisticProductCadView: React.FC<RealisticProductCadViewProps> = ({
  layers,
  designModel,
  designBrand,
  designDimensions,
  totalThickness,
  isSymmetrical,
  activeCurrency,
  onSelectAssembly
}) => {
  // Find spring layer if exists
  const hasSpring = layers.some(l => {
    const mat = (l.material || '').toLowerCase();
    return mat.includes('spring') || mat.includes('سوست') || mat.includes('شاسيه');
  });

  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center py-6 px-4 animate-fade-in select-none">
      
      {/* 3D Realistic Mattress Assembly Cutaway Container */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-blue-500/30 rounded-3xl p-6 shadow-2xl space-y-4 text-white relative overflow-hidden backdrop-blur-md">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-xs opacity-75" />

        {/* Realistic Mattress Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
            <h4 className="font-black text-sm text-slate-100 flex items-center gap-2">
              <span>{designBrand} {designModel}</span>
              <span className="text-[11px] text-blue-400 font-mono">({designDimensions} • {totalThickness} سم)</span>
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {isSymmetrical && (
              <span className="px-2.5 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                <ArrowLeftRight size={11} />
                <span>وجهين متطابقين</span>
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              Photorealistic CAD Assembly
            </span>
          </div>
        </div>

        {/* Visual Assembly Stack */}
        <div className="space-y-2 py-2">
          
          {/* 1. TOP ASSEMBLY (Luxury Knitted Quilting & Comfort Zone) */}
          <div
            onClick={() => onSelectAssembly && onSelectAssembly('top')}
            className="group relative rounded-2xl p-4 bg-gradient-to-r from-slate-100 via-white to-slate-200 text-slate-900 shadow-lg border-2 border-slate-300 hover:border-blue-400 transition-all cursor-pointer overflow-hidden transform hover:-translate-y-0.5"
            style={{
              backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
              backgroundSize: '12px 12px'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs" />
                <span className="font-black text-xs text-[#0B2D5C]">1. المجموعة العلوية (Top Assembly)</span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.2 rounded-md">
                  قماش قطني ناعم + فوم الراحة (Memory/HR)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">
                سمك ~ 6-8 سم
              </span>
            </div>

            {/* Quilt Pattern Lines */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-300/80 pt-1.5 font-medium">
              <span>تطريز هيدروليكي فندقي (High-Loft Quilting Stitch)</span>
              <span className="text-blue-600 font-bold group-hover:underline">عرض التفاصيل &larr;</span>
            </div>
          </div>

          {/* 2. SPRING CORE ASSEMBLY (Pocket Springs + Felt Reinforcement) */}
          <div
            onClick={() => onSelectAssembly && onSelectAssembly('spring')}
            className="group relative rounded-2xl p-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 text-amber-200 border-2 border-amber-600/40 hover:border-amber-400 transition-all cursor-pointer shadow-xl overflow-hidden transform hover:-translate-y-0.5"
          >
            {/* Pocket Spring Visual Texture */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                <span className="font-black text-xs text-amber-300">2. مجموعة شاسيه السوست والعزل (Spring Core Assembly)</span>
                <span className="text-[10px] font-bold bg-amber-900/60 text-amber-300 px-2 py-0.2 rounded-md border border-amber-700/50">
                  {hasSpring ? 'Pocket Spring 2.0mm + لباد تركي معزول' : 'نواة فوم ريبوند عالية الكثافة'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400">
                سمك ~ 15-18 سم
              </span>
            </div>

            {/* Spring Coils Simulation graphic */}
            <div className="mt-3 flex items-center justify-between gap-1.5 bg-black/40 p-2 rounded-xl border border-amber-700/30">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex-1 h-8 rounded-lg bg-gradient-to-b from-amber-400/40 via-amber-200/20 to-amber-500/40 border border-amber-400/30 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-amber-300/40 rotate-12" />
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between text-[10px] text-amber-300/80 font-medium">
              <span>عزل تام للحركة مع نوابض كربونية معالجة حرارياً</span>
              <span className="text-amber-400 font-bold group-hover:underline">عرض التفاصيل &larr;</span>
            </div>
          </div>

          {/* 3. BOTTOM ASSEMBLY (Base Support) */}
          <div
            onClick={() => onSelectAssembly && onSelectAssembly('bottom')}
            className="group relative rounded-2xl p-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 text-emerald-200 border-2 border-emerald-600/40 hover:border-emerald-400 transition-all cursor-pointer shadow-lg overflow-hidden transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                <span className="font-black text-xs text-emerald-300">3. المجموعة السفلية (Bottom Assembly)</span>
                <span className="text-[10px] font-bold bg-emerald-900/60 text-emerald-300 px-2 py-0.2 rounded-md border border-emerald-700/50">
                  {isSymmetrical ? 'طبقة تطريز متماثلة لوجه النوم الثاني' : 'قماش سفلي مانع للانزلاق وقاعدة فوم'}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400">
                سمك ~ 4-6 سم
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[10px] text-emerald-400/80 border-t border-emerald-800/40 pt-1.5 font-medium">
              <span>{isSymmetrical ? 'متطابق 100% مع الوجه العلوي (قابل للقلب والتناوب)' : 'طبقة تثبيت سفلية متينة'}</span>
              <span className="text-emerald-400 font-bold group-hover:underline">عرض التفاصيل &larr;</span>
            </div>
          </div>

          {/* 4. BORDER & PERIMETER ASSEMBLY (Edge Encasement & Ventilation) */}
          <div
            onClick={() => onSelectAssembly && onSelectAssembly('border')}
            className="group relative rounded-2xl p-3.5 bg-gradient-to-r from-purple-950/60 via-slate-900 to-purple-950/60 text-purple-200 border-2 border-purple-600/40 hover:border-purple-400 transition-all cursor-pointer shadow-md overflow-hidden transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-xs" />
                <span className="font-black text-xs text-purple-300">4. مجموعة الإطار والشريط الجانبي (Border Assembly)</span>
                <span className="text-[10px] font-bold bg-purple-900/60 text-purple-300 px-2 py-0.2 rounded-md border border-purple-700/50">
                  Edge Support Foam + 3D Mesh + 4 مقابض
                </span>
              </div>
              <span className="text-purple-400 font-bold text-[10px] group-hover:underline">عرض &larr;</span>
            </div>
          </div>

        </div>

        {/* Visual realism note */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Info size={12} className="text-blue-400" />
            <span>التمثيل الواقعي يجمع الطبقات الفرعية في 4 مجموعات إنتاجية قياسية.</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            100% Certified CAD Visualization
          </span>
        </div>

      </div>

    </div>
  );
};
