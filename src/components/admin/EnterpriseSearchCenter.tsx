import React, { useState, useMemo } from 'react';
import { 
  Search, Package, Layers, Tag, Hash, ShieldCheck, User, 
  ClipboardList, BookOpen, UserCheck, ArrowRight, ArrowLeft, ExternalLink, X 
} from 'lucide-react';
import { ErpDatabase } from '../../utils/erpDb';
import { useTranslationService } from '../../i18n';
import { getLocalizedName } from '../../utils/bilingual';

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

interface EnterpriseSearchCenterProps {
  language: 'ar' | 'en';
  onNavigateToModule: (section: 'admin_system' | 'production' | 'warehouse' | 'sales' | 'customer_service' | 'reports', tab?: string, itemData?: any) => void;
}

export const EnterpriseSearchCenter: React.FC<EnterpriseSearchCenterProps> = ({
  language,
  onNavigateToModule
}) => {
  const { t: dict, isAr } = useTranslationService(language);
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');

  // Search execution across all 9 entities
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
    ).slice(0, 4).forEach(p => {
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
    ).slice(0, 4).forEach(m => {
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

    // 3. Brands
    const brands = ErpDatabase.getBrands();
    brands.filter(b => 
      b.name?.toLowerCase().includes(q) || 
      b.id?.toLowerCase().includes(q)
    ).forEach(b => {
      list.push({
        id: `brd-${b.id}`,
        type: 'Brand',
        title: getLocalizedName(b, language),
        subtitle: `${b.id} • Prefix: ${b.serialPrefix}`,
        meta: isAr ? 'علامة تجارية' : 'Brand Master',
        targetSection: 'production',
        targetTab: 'structure',
        rawItem: b
      });
    });

    // 4. Serials
    const serials = ErpDatabase.getSerialNumbers();
    serials.filter(s => 
      s.serialNumber?.toLowerCase().includes(q) || 
      s.batchNumber?.toLowerCase().includes(q)
    ).slice(0, 4).forEach(s => {
      list.push({
        id: `ser-${s.serialNumber}`,
        type: 'Serial',
        title: s.serialNumber,
        subtitle: `${s.batchNumber} • ${s.status}`,
        meta: s.status,
        targetSection: 'production',
        targetTab: 'serials',
        rawItem: s
      });
    });

    // 5. Warranty Certificates
    const certs = ErpDatabase.getWarrantyCertificates();
    certs.filter(c => 
      c.warrantyNumber?.toLowerCase().includes(q) || 
      c.serialNumber?.toLowerCase().includes(q) ||
      (c.customerName && c.customerName.toLowerCase().includes(q))
    ).slice(0, 4).forEach(c => {
      list.push({
        id: `cert-${c.warrantyNumber}`,
        type: 'Warranty',
        title: c.warrantyNumber,
        subtitle: `${c.serialNumber} • ${c.customerName || (isAr ? 'بدون اسم' : 'No Name')}`,
        meta: c.status,
        targetSection: 'customer_service',
        rawItem: c
      });
    });

    // 6. Customers
    const customers = ErpDatabase.getCustomers();
    customers.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.mobileNumber?.toLowerCase().includes(q) ||
      (c.nationalId && c.nationalId.toLowerCase().includes(q))
    ).slice(0, 4).forEach(c => {
      list.push({
        id: `cust-${c.id}`,
        type: 'Customer',
        title: c.name,
        subtitle: `${c.mobileNumber} • ${c.city || ''}`,
        meta: c.customerType || 'Retail',
        targetSection: 'customer_service',
        rawItem: c
      });
    });

    // 7. Production Orders
    const orders = ErpDatabase.getProductionOrders();
    orders.filter(o => 
      o.productionOrderNumber?.toLowerCase().includes(q) || 
      o.batchNumber?.toLowerCase().includes(q)
    ).slice(0, 4).forEach(o => {
      list.push({
        id: `ord-${o.id}`,
        type: 'Production Order',
        title: o.productionOrderNumber,
        subtitle: `${o.batchNumber} • ${o.quantity} ${isAr ? 'قطعة' : 'units'}`,
        meta: o.status,
        targetSection: 'production',
        targetTab: 'orders',
        rawItem: o
      });
    });

    // 8. BOM (Bill of Materials)
    const boms = ErpDatabase.getBOMs();
    boms.filter(b => 
      b.bomNumber?.toLowerCase().includes(q) || 
      b.bomName?.toLowerCase().includes(q) ||
      b.version?.toLowerCase().includes(q)
    ).slice(0, 4).forEach(b => {
      list.push({
        id: `bom-${b.id}`,
        type: 'BOM',
        title: b.bomName,
        subtitle: `${b.bomNumber} • ${b.version}`,
        meta: b.status,
        targetSection: 'production',
        targetTab: 'bom',
        rawItem: b
      });
    });

    // 9. Users
    const users = ErpDatabase.getUsers();
    users.filter(u => 
      u.name?.toLowerCase().includes(q) || 
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    ).slice(0, 4).forEach(u => {
      list.push({
        id: `usr-${u.id}`,
        type: 'User',
        title: u.name,
        subtitle: `${u.email} • ${u.department}`,
        meta: u.role,
        targetSection: 'admin_system',
        targetTab: 'users_roles',
        rawItem: u
      });
    });

    // 10. Audit Logs
    const auditLogs = ErpDatabase.getAuditLogs();
    auditLogs.filter(a => 
      a.id?.toLowerCase().includes(q) || 
      a.action?.toLowerCase().includes(q) || 
      a.details?.toLowerCase().includes(q) || 
      a.operator?.toLowerCase().includes(q)
    ).slice(0, 4).forEach(a => {
      list.push({
        id: `aud-${a.id}`,
        type: 'Audit Log',
        title: `${a.action}: ${a.operator}`,
        subtitle: `${a.id} • ${a.details}`,
        meta: new Date(a.timestamp).toLocaleDateString(isAr ? 'ar-EG' : 'en-US'),
        targetSection: 'admin_system',
        targetTab: 'audit_monitoring',
        rawItem: a
      });
    });

    // 11. Print Templates
    const templates = ErpDatabase.getPrintTemplates();
    templates.filter(tpl => 
      tpl.name?.toLowerCase().includes(q) || 
      tpl.code?.toLowerCase().includes(q) || 
      tpl.version?.toLowerCase().includes(q)
    ).slice(0, 4).forEach(tpl => {
      list.push({
        id: `tpl-${tpl.id}`,
        type: 'Print Template',
        title: tpl.name,
        subtitle: `${tpl.code} • ${tpl.widthMm}×${tpl.heightMm} mm (${tpl.format})`,
        meta: tpl.approvalStatus,
        targetSection: 'admin_system',
        targetTab: 'print_settings',
        rawItem: tpl
      });
    });

    if (filterType !== 'All') {
      return list.filter(item => item.type === filterType);
    }

    return list;
  }, [query, filterType, language, isAr]);

  const getEntityIcon = (type: SearchEntityType) => {
    switch (type) {
      case 'Product': return <Package size={15} className="text-blue-600" />;
      case 'Model': return <Layers size={15} className="text-indigo-600" />;
      case 'Brand': return <Tag size={15} className="text-cyan-600" />;
      case 'Serial': return <Hash size={15} className="text-emerald-600" />;
      case 'Warranty': return <ShieldCheck size={15} className="text-teal-600" />;
      case 'Customer': return <User size={15} className="text-amber-600" />;
      case 'Production Order': return <ClipboardList size={15} className="text-purple-600" />;
      case 'BOM': return <BookOpen size={15} className="text-fuchsia-600" />;
      case 'User': return <UserCheck size={15} className="text-rose-600" />;
      case 'Audit Log': return <ShieldCheck size={15} className="text-orange-600" />;
      case 'Print Template': return <ClipboardList size={15} className="text-sky-600" />;
    }
  };

  const getEntityTypeLabel = (type: SearchEntityType) => {
    const t = dict.adminSearch.types;
    switch (type) {
      case 'Product': return t.product;
      case 'Model': return t.model;
      case 'Brand': return t.brand;
      case 'Serial': return t.serial;
      case 'Warranty': return t.warranty;
      case 'Customer': return t.customer;
      case 'Production Order': return t.order;
      case 'BOM': return t.bom;
      case 'User': return t.user;
      case 'Audit Log': return t.audit || (isAr ? 'سجل تدقيق' : 'Audit Log');
      case 'Print Template': return t.template || (isAr ? 'قالب طباعة' : 'Print Template');
    }
  };

  return (
    <div className="bg-surface border border-border-main rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border-main pb-3">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-[#0B2D5C] dark:text-blue-300 flex items-center gap-2">
            <Search size={18} className="text-blue-600 shrink-0" />
            <span>{dict.adminSearch.title}</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            {dict.adminSearch.subtitle}
          </p>
        </div>

        {/* Filter Type Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs max-w-full">
          {['All', 'Product', 'Model', 'Serial', 'Warranty', 'Customer', 'Production Order', 'BOM', 'User', 'Audit Log', 'Print Template'].map((typeKey) => (
            <button
              key={typeKey}
              type="button"
              onClick={() => setFilterType(typeKey)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterType === typeKey
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-text-secondary hover:text-text-primary'
              }`}
            >
              {typeKey === 'All' ? (isAr ? 'الكل' : 'All') : getEntityTypeLabel(typeKey as SearchEntityType)}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Field */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.adminSearch.placeholder}
          className="w-full h-11 pr-10 pl-10 rtl:pr-10 rtl:pl-10 ltr:pl-10 ltr:pr-10 bg-slate-50 dark:bg-slate-900 border border-border-main rounded-xl text-xs sm:text-sm font-sans outline-none focus:border-blue-600 focus:bg-surface transition-all"
        />
        <Search 
          size={18} 
          className="absolute right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute left-3.5 rtl:left-3.5 rtl:right-auto ltr:right-3.5 ltr:left-auto top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Results Box */}
      {query.trim().length >= 2 && (
        <div className="space-y-2 pt-1 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-text-secondary font-bold px-1">
            <span>{dict.adminSearch.results} ({searchResults.length})</span>
            <span className="text-[11px] text-slate-400">
              {isAr ? 'اضغط على النتيجة للانتقال الفوري للوحدة المقابلة' : 'Click to jump directly to corresponding module'}
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-border-main">
              {dict.adminSearch.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto pr-1">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateToModule(item.targetSection, item.targetTab, item.rawItem)}
                  className="p-3 bg-surface hover:bg-blue-50/60 dark:hover:bg-blue-950/20 border border-border-main hover:border-blue-300 dark:hover:border-blue-800 rounded-xl transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {getEntityIcon(item.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-semibold shrink-0">
                          {getEntityTypeLabel(item.type)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-blue-600 text-xs font-bold shrink-0 opacity-80 group-hover:opacity-100">
                    <span className="hidden sm:inline text-[11px]">{dict.adminSearch.openModule}</span>
                    {isAr ? <ArrowLeft size={13} /> : <ArrowRight size={13} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
