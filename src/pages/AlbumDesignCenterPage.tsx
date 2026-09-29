import React, { useState } from 'react';
import { 
  BookOpen, Layers, Image as ImageIcon, Sparkles, FileText, Download, 
  Search, Grid, Layout, CheckCircle2, ChevronRight, Eye, Printer, Share2, Box, Tag
} from 'lucide-react';
import { ErpDatabase } from '../utils/erpDb';
import { DimensionMasterRepository } from '../utils/dimensionRepository';
import { AlbumMaster, AlbumPage } from '../types/erp';

export const AlbumDesignCenterPage: React.FC = () => {
  const brands = ErpDatabase.getBrands();
  const families = ErpDatabase.getFamilies();
  const models = ErpDatabase.getModels();
  const products = ErpDatabase.getProducts();
  const stdDimensions = DimensionMasterRepository.getAllStandardDimensions();

  const [activeTab, setActiveTab] = useState<'catalog' | 'marketing' | 'dealer' | 'warranty'>('catalog');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('All');
  const [selectedModelId, setSelectedModelId] = useState<string>(models[0]?.id || '');

  // Default seed album templates
  const [albums] = useState<AlbumMaster[]>([
    {
      id: 'ALB-2026-CATALOG',
      code: 'ALB-CAT-2026',
      titleAr: 'كتالوج سليبي المصنعي الشامل 2026',
      titleEn: 'Sleepee Master Factory Catalog 2026',
      albumType: 'catalog',
      version: 'v2.6',
      status: 'active',
      createdDate: '2026-01-10T10:00:00Z',
      updatedDate: '2026-01-10T10:00:00Z'
    },
    {
      id: 'ALB-2026-DEALER',
      code: 'ALB-[#0B2D5C]-DEALER',
      titleAr: 'ألبوم الوكلاء والتجار المعتمدين',
      titleEn: 'Authorized Dealers Showcase Album',
      albumType: 'dealer',
      version: 'v1.4',
      status: 'active',
      createdDate: '2026-02-01T10:00:00Z',
      updatedDate: '2026-02-01T10:00:00Z'
    },
    {
      id: 'ALB-2026-WARRANTY',
      code: 'ALB-WAR-2026',
      titleAr: 'ألبوم شهادات وسياسات الضمان والاشتراطات الفنية',
      titleEn: 'Warranty Certificates & Policy Album',
      albumType: 'warranty',
      version: 'v3.0',
      status: 'active',
      createdDate: '2026-01-15T10:00:00Z',
      updatedDate: '2026-01-15T10:00:00Z'
    }
  ]);

  const activeModel = models.find(m => m.id === selectedModelId) || models[0];
  const activeBrand = brands.find(b => b.id === activeModel?.brandId);
  const activeFamily = families.find(f => f.id === activeModel?.familyId);
  const modelProducts = products.filter(p => p.modelId === activeModel?.id && p.productType !== 'custom');

  const handlePrintAlbum = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-right font-sans animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border-main pb-4">
        <div>
          <h2 className="text-lg font-black text-[#0B2D5C] dark:text-text-primary flex items-center gap-2">
            <BookOpen size={22} className="text-blue-600" />
            <span>مركز تصميم ألبومات وكتالوجات المنتجات (Album Design Center)</span>
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            المصدر الوحيد لتوليد كتالوجات التسويق، ألبومات الوكلاء، وكتيبات الضمان تلقائياً من الماستر داتا دون إعادة إدخال.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintAlbum}
            className="px-4 py-2 bg-gradient-to-r from-[#0B2D5C] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#0B2D5C] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Printer size={16} />
            <span>طباعة وتصدير الألبوم</span>
          </button>
        </div>
      </div>

      {/* Album Type Navigation */}
      <div className="flex border-b border-border-main gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-4 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen size={15} />
          <span>الكتالوج القياسي المصنعي (Master Catalog)</span>
        </button>
        <button
          onClick={() => setActiveTab('dealer')}
          className={`pb-3 px-4 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'dealer'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Grid size={15} />
          <span>ألبوم الوكلاء والتجار (Dealer Showcase)</span>
        </button>
        <button
          onClick={() => setActiveTab('warranty')}
          className={`pb-3 px-4 text-xs font-bold cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'warranty'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText size={15} />
          <span>كتيب شهادات الضمان (Warranty Album)</span>
        </button>
      </div>

      {/* Interactive Catalog Auto-Generator Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Model & Brand Selector Sidebar */}
        <div className="lg:col-span-1 space-y-4 bg-surface border border-border-main p-4 rounded-2xl">
          <div className="font-extrabold text-xs text-[#0B2D5C] dark:text-blue-300 border-b border-border-main pb-2 flex items-center justify-between">
            <span>اختيار الموديل لمعاينة صفحة الألبوم</span>
            <Sparkles size={14} className="text-amber-500" />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">فلترة بالبراند</label>
            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className="w-full h-9 px-2 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs font-bold"
            >
              <option value="All">كل الماركات (Brands)</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            <label className="block text-xs font-bold mb-1 text-slate-500">الموديلات المعتمدة بالكتالوج ({models.length})</label>
            {models
              .filter(m => selectedBrandFilter === 'All' || m.brandId === selectedBrandFilter)
              .map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`w-full text-right p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between ${
                    selectedModelId === model.id
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Box size={14} />
                    <span>{model.name}</span>
                  </div>
                  <span className="text-[10px] opacity-80 font-mono">
                    {brands.find(b => b.id === model.brandId)?.name}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Live Album Page Preview Canvas */}
        <div className="lg:col-span-3 bg-surface border border-border-main rounded-3xl p-6 space-y-6 shadow-sm min-h-[600px] flex flex-col justify-between">
          
          {/* Printable Album Page Container */}
          <div id="album-page-print" className="space-y-6 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            
            {/* Header branding */}
            <div className="flex items-center justify-between border-b-2 border-[#0B2D5C] pb-4">
              <div>
                <span className="text-2xl font-black tracking-widest text-[#0B2D5C] dark:text-blue-400">SLEEPEE</span>
                <span className="block text-[10px] text-slate-400 font-mono">OFFICIAL CATALOG ALBUM • PAGE PREVIEW</span>
              </div>

              <div className="text-left font-mono text-xs">
                <span className="px-2.5 py-1 bg-[#0B2D5C] text-white font-extrabold rounded-lg">
                  {activeBrand?.name || 'SLEEPEE'}
                </span>
                <span className="block text-[10px] text-slate-400 mt-1">كود الماركة: {activeBrand?.id}</span>
              </div>
            </div>

            {/* Product Hero Spec Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Product Visual Mock Badge */}
              <div className="bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <Box size={64} className="mx-auto text-[#0B2D5C] dark:text-blue-400 opacity-80" />
                <div className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300">
                  مرتبة {activeModel?.name}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {activeFamily?.nameAr || 'مرتبة سوست قياسية'}
                </div>
                <div className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-mono font-bold rounded-full">
                  ارتفاع الموديل: {activeModel?.height || 25} سم
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-1">
                  <div className="text-slate-400 font-bold">اسم الموديل القياسي</div>
                  <div className="text-sm font-black text-[#0B2D5C] dark:text-blue-300">{activeModel?.name}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main">
                    <div className="text-slate-400 font-bold">نظام التصنيع</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{activeModel?.manufacturingSystem || 'American'}</div>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main">
                    <div className="text-slate-400 font-bold">سياسة الضمان المعتمدة</div>
                    <div className="font-bold text-blue-600">ضمان 10 سنوات شامل</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main space-y-1">
                  <div className="text-slate-400 font-bold">عائلة المنتج بالماستر</div>
                  <div className="font-bold text-slate-800 dark:text-slate-200">{activeFamily?.nameAr} ({activeFamily?.nameEn})</div>
                </div>
              </div>
            </div>

            {/* Matrix of Available Factory Standard Dimensions */}
            <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between text-xs font-black text-[#0B2D5C] dark:text-blue-300">
                <span>المقاسات المصنعية المتاحة للموديل (39 بعداً مصنعياً قياسياً)</span>
                <span className="text-[10px] text-slate-400 font-mono">الارتفاع المصنعي: {activeModel?.height || 25} سم</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {stdDimensions.slice(0, 18).map(dim => {
                  const isConfigured = modelProducts.some(p => p.width === dim.width && p.length === dim.length);
                  return (
                    <div 
                      key={dim.id} 
                      className={`p-2 rounded-lg text-center border font-mono text-[11px] font-bold ${
                        isConfigured
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <div>{dim.width} × {dim.length}</div>
                      <div className="text-[8px] font-normal">{isConfigured ? 'مكوّد بالكتالوج' : 'بعد قياسي شاغر'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Notes */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
              <div>تم التوليد الآلي من منظومة سليبي الموحدة لإدارة الضمان والكتالوج.</div>
              <div className="font-mono">SLEEPEE-ALBUM-GEN-2026</div>
            </div>
          </div>

          {/* Album Information Note */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 rounded-2xl text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
            <span>
              نواة ألبوم المنتجات تستخرج كافة المواصفات والأبعاد والماركات مباشرة من الماستر داتا بدون إدخال يدوي مكرر.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
