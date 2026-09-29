import React, { useState, useMemo } from 'react';
import { 
  Search, X, Package, Layers, Tag, Hash, ShieldCheck, User, 
  ClipboardList, BookOpen, UserCheck, Printer, ArrowRight, Activity
} from 'lucide-react';
import { ErpDatabase } from '../utils/erpDb';
import { useTranslationService } from '../i18n';
import { getLocalizedName } from '../utils/bilingual';

export type SearchEntityType = 
  | 'Product' 
  | 'Model' 
  | 'Brand' 
  | 'Serial' 
  | 'Warranty' 
  | 'Customer' 
  | 'Production Order' 
  | 'BOM' 
  | 'User'
  | 'Audit Log'
  | 'Print Template';

export interface EnterpriseSearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle: string;
  meta: string;
  targetSection: 'admin_system' | 'production' | 'warehouse' | 'sales' | 'customer_service' | 'reports';
  targetTab?: string;
  rawItem: any;
}

interface EnterpriseSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  onNavigate: (section: 'admin_system' | 'production' | 'warehouse' | 'sales' | 'customer_service' | 'reports', tab?: string, item?: any) => void;
}

export const EnterpriseSearchOverlay: React.FC<EnterpriseSearchOverlayProps> = ({
  isOpen,
  onClose,
  language,
  onNavigate
}) => {
  const { isAr } = useTranslationService(language);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  if (!isOpen) return null;

  // Search execution across all entities
  const searchResults = useMemo<EnterpriseSearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const list: EnterpriseSearchResult[] = [];

    // 1. Products
    const products = ErpDatabase.getProducts();
    products.filter(p => 
      p.modelName?.toLowerCase().includes(q) || 
      p.internalProductCode?.toLowerCase().includes(q) ||
      (p.sapMaterialCode && p.sapMaterialCode.toLowerCase().includes(q))
    ).slice(0, 5).forEach(p => {
      list.push({
        id: `prod-${p.id}`,
        type: 'Product',
        title: p.modelName,
        subtitle: `${p.internalProductCode} • ${p.width}×${p.length}×${p.height} cm`,
        meta: p.status === 'active' ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Inactive'),
        targetSection: 'production',
        targetTab: 'structure',
        rawItem: p
      });
    });

    // 2. Models
    const models = ErpDatabase.getModels();
    models.filter(m => 
      m.name?.toLowerCase().includes(q) || 
      m.id?.toLowerCase().includes(q)
    ).slice(0, 5).forEach(m => {
      list.push({
        id: `mod-${m.id}`,
        type: 'Model',
        title: m.name,
        subtitle: `${m.id} • ${m.manufacturingSystem || 'Standard'}`,
        meta: m.brandId,
        targetSection: 'production',
        targetTab: 'structure',
        rawItem: m
      });
    });

    // 3. Serial Numbers
    const serials = ErpDatabase.getSerialNumbers();
    serials.filter(s => 
      s.serialNumber.toLowerCase().includes(q) || 
      s.warrantyNumber.toLowerCase().includes(q)
    ).slice(0, 5).forEach(s => {
      list.push({
        id: `ser-${s.serialNumber}`,
        type: 'Serial',
        title: s.serialNumber,
        subtitle: `${s.warrantyNumber} • ${s.batchNumber}`,
        meta: s.status,
        targetSection: 'production',
        targetTab: 'serials',
        rawItem: s
      });
    });

    // 4. Warranty Certificates
    const certs = ErpDatabase.getWarrantyCertificates();
    certs.filter(c => 
      c.warrantyNumber.toLowerCase().includes(q) || 
      c.serialNumber.toLowerCase().includes(q) ||
      (c.customerName && c.customerName.toLowerCase().includes(q))
    ).slice(0, 5).forEach((c, idx) => {
      list.push({
        id: `cert-${idx}`,
        type: 'Warranty',
        title: `${isAr ? 'شهادة ضمان:' : 'Warranty:'} ${c.warrantyNumber}`,
        subtitle: `${c.customerName || 'N/A'} • ${c.serialNumber}`,
        meta: c.status,
        targetSection: 'customer_service',
        rawItem: c
      });
    });

    // 5. Customers
    const customers = ErpDatabase.getCustomers();
    customers.filter(cust => 
      cust.name.toLowerCase().includes(q) || 
      cust.mobileNumber.includes(q) ||
      (cust.nationalId && cust.nationalId.includes(q))
    ).slice(0, 5).forEach(cust => {
      list.push({
        id: `cust-${cust.id}`,
        type: 'Customer',
        title: cust.name,
        subtitle: `${cust.mobileNumber} • ${cust.governorate} - ${cust.city}`,
        meta: cust.customerType || 'Retail',
        targetSection: 'customer_service',
        rawItem: cust
      });
    });

    // 6. Production Orders
    const orders = ErpDatabase.getProductionOrders();
    orders.filter(o => 
      o.productionOrderNumber.toLowerCase().includes(q) || 
      o.batchNumber.toLowerCase().includes(q)
    ).slice(0, 5).forEach(o => {
      list.push({
        id: `ord-${o.id}`,
        type: 'Production Order',
        title: o.productionOrderNumber,
        subtitle: `Batch: ${o.batchNumber} • Qty: ${o.quantity}`,
        meta: o.status,
        targetSection: 'production',
        targetTab: 'orders',
        rawItem: o
      });
    });

    // 7. BOMs
    const boms = ErpDatabase.getBOMs();
    boms.filter(b => 
      b.bomNumber.toLowerCase().includes(q) || 
      b.bomName.toLowerCase().includes(q)
    ).slice(0, 5).forEach(b => {
      list.push({
        id: `bom-${b.id}`,
        type: 'BOM',
        title: b.bomName,
        subtitle: `${b.bomNumber} • v${b.version}`,
        meta: b.status,
        targetSection: 'production',
        targetTab: 'bom',
        rawItem: b
      });
    });

    // 8. Users
    const users = ErpDatabase.getUsers();
    users.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q)
    ).slice(0, 5).forEach(u => {
      list.push({
        id: `usr-${u.id}`,
        type: 'User',
        title: u.name,
        subtitle: `${u.email} • ${u.role}`,
        meta: u.department,
        targetSection: 'admin_system',
        targetTab: 'users_roles',
        rawItem: u
      });
    });

    // 9. Audit Logs
    const logs = ErpDatabase.getAuditLogs();
    logs.filter(l => 
      l.action.toLowerCase().includes(q) || 
      l.details.toLowerCase().includes(q) ||
      l.operator.toLowerCase().includes(q)
    ).slice(0, 5).forEach(l => {
      list.push({
        id: `log-${l.id}`,
        type: 'Audit Log',
        title: l.action,
        subtitle: l.details,
        meta: l.operator,
        targetSection: 'admin_system',
        targetTab: 'audit_monitoring',
        rawItem: l
      });
    });

    // 10. Print Templates
    const templates = ErpDatabase.getPrintTemplates();
    templates.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.code.toLowerCase().includes(q)
    ).slice(0, 5).forEach(t => {
      list.push({
        id: `tpl-${t.id}`,
        type: 'Print Template',
        title: t.name,
        subtitle: `${t.code} • ${t.widthMm}×${t.heightMm} mm`,
        meta: t.format,
        targetSection: 'admin_system',
        targetTab: 'print_settings',
        rawItem: t
      });
    });

    return list;
  }, [query, isAr]);

  const filteredResults = useMemo(() => {
    if (filterType === 'All') return searchResults;
    return searchResults.filter(r => r.type === filterType);
  }, [searchResults, filterType]);

  const entityTypesCount = useMemo(() => {
    const counts: Record<string, number> = { All: searchResults.length };
    searchResults.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [searchResults]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-3xl bg-surface dark:bg-surface-secondary border border-border-main rounded-3xl shadow-2xl overflow-hidden z-[10000] flex flex-col max-h-[80vh]">
        
        {/* Header / Search Input */}
        <div className="p-4 sm:p-5 border-b border-border-main flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50">
          <Search size={22} className="text-blue-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAr ? 'البحث الشامل في المنظومة (أدخل حرفين على الأقل)...' : 'Enterprise Search (enter at least 2 characters)...'}
            className="w-full bg-transparent text-sm sm:text-base font-bold text-text-primary outline-none placeholder:text-slate-400"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-text-primary transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>

        {/* Filter Pills */}
        {searchResults.length > 0 && (
          <div className="px-5 py-3 border-b border-border-main flex items-center gap-2 overflow-x-auto no-scrollbar bg-surface text-xs font-bold">
            <span className="text-slate-400 shrink-0">{isAr ? 'تصفية النتائج:' : 'Filter:'}</span>
            {['All', 'Product', 'Model', 'Serial', 'Warranty', 'Customer', 'Production Order', 'BOM', 'User', 'Audit Log', 'Print Template'].map(type => {
              const count = entityTypesCount[type] || 0;
              if (type !== 'All' && count === 0) return null;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    filterType === type 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{type}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px] font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {query.trim().length < 2 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <Search size={40} className="mx-auto text-slate-300 dark:text-slate-700 animate-pulse" />
              <p className="text-sm font-bold">{isAr ? 'ابدأ الكتابة للبحث في كافة وحدات وعمليات المنظومة' : 'Start typing to search across all enterprise modules'}</p>
              <p className="text-xs text-slate-400">{isAr ? 'يدعم البحث: المنتجات، السيريالات، الضمان، العملاء، المستخدمين، الأوامر، الوصفات، والسجلات' : 'Supports Products, Serials, Warranties, Customers, Users, Orders, BOMs & Audit Logs'}</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <p className="text-sm font-bold">{isAr ? 'لا توجد نتائج مطابقة لبحثك' : 'No matching records found'}</p>
              <p className="text-xs text-slate-400">{isAr ? 'تحقق من صحة الكود أو النص المدخل' : 'Check your query and try again'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredResults.map(res => (
                <div
                  key={res.id}
                  onClick={() => {
                    onNavigate(res.targetSection, res.targetTab, res.rawItem);
                    onClose();
                  }}
                  className="p-3.5 bg-slate-50 hover:bg-blue-50/50 dark:bg-slate-900/40 dark:hover:bg-blue-950/20 border border-border-main rounded-2xl flex items-center justify-between gap-4 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {res.type === 'Product' && <Package size={18} />}
                      {res.type === 'Model' && <Layers size={18} />}
                      {res.type === 'Serial' && <Hash size={18} />}
                      {res.type === 'Warranty' && <ShieldCheck size={18} />}
                      {res.type === 'Customer' && <User size={18} />}
                      {res.type === 'Production Order' && <ClipboardList size={18} />}
                      {res.type === 'BOM' && <BookOpen size={18} />}
                      {res.type === 'User' && <UserCheck size={18} />}
                      {res.type === 'Audit Log' && <Activity size={18} />}
                      {res.type === 'Print Template' && <Printer size={18} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{res.type}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs font-mono text-slate-500">{res.meta}</span>
                      </div>
                      <h4 className="text-sm font-black text-text-primary mt-0.5">{res.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{res.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
                    <span className="text-xs font-bold hidden sm:inline">{isAr ? 'الانتقال للوحدة' : 'Navigate'}</span>
                    <ArrowRight size={16} className="rtl:rotate-180" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-border-main text-center text-xs text-slate-400 font-mono">
          {isAr ? `إجمالي النتائج المطابقة: ${filteredResults.length}` : `Total matching results: ${filteredResults.length}`}
        </div>

      </div>
    </div>
  );
};
