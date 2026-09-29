import React, { useState, useMemo } from 'react';
import { 
  Database, Search, Filter, Layers, DollarSign, ShieldCheck, 
  Tag, Box, CheckCircle2, ChevronRight, Info, ExternalLink, Factory
} from 'lucide-react';
import { SLEEPEE_MATERIAL_LIBRARY, MaterialIntelligenceItem } from '../services/materialMasterIntelligenceEngine';

export const MaterialMasterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<MaterialIntelligenceItem | null>(null);

  const materials = useMemo(() => {
    return Object.values(SLEEPEE_MATERIAL_LIBRARY);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    materials.forEach(m => set.add(m.materialCategory));
    return ['All', ...Array.from(set)];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchCat = selectedCategory === 'All' || m.materialCategory === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchQuery = !q || 
        m.nameAr.toLowerCase().includes(q) ||
        m.nameEn.toLowerCase().includes(q) ||
        m.materialCode.toLowerCase().includes(q) ||
        m.supplier.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [materials, selectedCategory, searchQuery]);

  return (
    <div className="space-y-5 text-right font-sans">
      
      {/* Header Banner */}
      <div className="bg-surface dark:bg-surface-secondary border border-border-main p-5 rounded-3xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0B2D5C] text-white flex items-center justify-center font-bold shadow-xs">
            <Database size={22} />
          </div>
          <div>
            <h2 className="text-base font-black text-[#0B2D5C] dark:text-blue-300">
              سجل المواد الخام والأصناف (Material Master)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              المصدر الوحيد للحقيقة (Single Source of Truth) لكافة الخامات الصناعية، السوست، طبقات الفوم، الأقمشة ومواصفاتها الفنية.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 size={13} />
            <span>{materials.length} صنف خام معتمد</span>
          </span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface p-4 rounded-2xl border border-border-main">
          <span className="text-[10px] text-slate-400 font-bold block">إجمالي الأصناف المعتمدة:</span>
          <span className="font-mono text-xl font-black text-blue-600">{materials.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Approved Materials</span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border-main">
          <span className="text-[10px] text-slate-400 font-bold block">التصنيفات الصناعية:</span>
          <span className="font-mono text-xl font-black text-emerald-600">{categories.length - 1}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Material Categories</span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border-main">
          <span className="text-[10px] text-slate-400 font-bold block">الموردون الصناعيون المعتمدون:</span>
          <span className="font-mono text-xl font-black text-purple-600">8</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Certified Suppliers</span>
        </div>

        <div className="bg-surface p-4 rounded-2xl border border-border-main">
          <span className="text-[10px] text-slate-400 font-bold block">نسبة المطابقة والفحص الدوري:</span>
          <span className="font-mono text-xl font-black text-amber-600">100%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Quality Compliance</span>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-surface p-4 rounded-2xl border border-border-main flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بكود الخامة، الاسم، المورد..."
            className="w-full h-10 pr-9 pl-3 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs outline-none focus:border-blue-600"
          />
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0B2D5C] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-surface rounded-3xl border border-border-main overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-border-main text-slate-500 font-bold">
              <tr>
                <th className="p-3.5 whitespace-nowrap">كود الخامة (Code)</th>
                <th className="p-3.5 whitespace-nowrap">اسم المادة الخام (Arabic / English)</th>
                <th className="p-3.5 whitespace-nowrap">التصنيف</th>
                <th className="p-3.5 whitespace-nowrap">الكثافة / الصلابة</th>
                <th className="p-3.5 whitespace-nowrap">المورد المعتمد</th>
                <th className="p-3.5 whitespace-nowrap">درجة الجودة</th>
                <th className="p-3.5 whitespace-nowrap">التكلفة المعيارية</th>
                <th className="p-3.5 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMaterials.map(m => (
                <tr key={m.materialCode} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-black text-blue-700 dark:text-blue-400 whitespace-nowrap">
                    {m.materialCode}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">{m.nameAr}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{m.nameEn}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                      {m.materialCategory}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-mono text-slate-600 dark:text-slate-300">
                    {m.density > 0 ? `D${m.density} kg/m³` : 'Core'} • {m.firmness}
                  </td>
                  <td className="p-3.5 max-w-xs truncate text-slate-700 dark:text-slate-300">
                    {m.supplier}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      m.qualityGrade.startsWith('A+') 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {m.qualityGrade}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap font-mono font-bold text-slate-800 dark:text-slate-200">
                    {m.unitCostSar} ر.س / وحدة
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(m)}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg text-[10px] font-bold cursor-pointer transition-all border border-blue-200 dark:border-blue-900"
                    >
                      عرض البطاقة
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-border-main space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border-main pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600 block">{selectedItem.materialCode}</span>
                <h3 className="font-black text-base text-[#0B2D5C] dark:text-blue-300">{selectedItem.nameAr}</h3>
                <span className="font-mono text-xs text-slate-400 block">{selectedItem.nameEn}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">التصنيف:</span>
                <span className="font-bold">{selectedItem.materialCategory}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">الصلابة والقوام:</span>
                <span className="font-bold">{selectedItem.firmness}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">المورد:</span>
                <span className="font-bold">{selectedItem.supplier}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">التكلفة المعيارية:</span>
                <span className="font-mono font-bold text-emerald-600">{selectedItem.unitCostSar} SAR</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl text-xs space-y-1">
              <span className="font-bold text-[#0B2D5C] dark:text-blue-300 block">الملاحظات الهندسية:</span>
              <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {selectedItem.specNotesAr}
              </p>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="w-full py-2.5 bg-[#0B2D5C] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                إغلاق البطاقة الفنية
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
