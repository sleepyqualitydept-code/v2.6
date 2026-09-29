import React, { useState, useMemo, useRef } from 'react';
import { 
  Lock, ShieldCheck, Key, AlertCircle, Archive, Search, FileSpreadsheet, 
  Package, Layers, ArrowLeft, Printer, RefreshCw, Activity, Terminal, 
  CheckCircle2, Users, BookOpen, Truck, ShoppingBag, BarChart3, Settings, 
  MapPin, Box, QrCode, Phone, Building2, UserCheck, ShieldAlert, History,
  Shield, Sliders, Globe, Award, FileText, CheckSquare, Filter, ChevronDown, Check,
  X, ArrowRight, LogOut, FolderTree, Hash, ChevronRight, Home, Factory, Sparkles, Clipboard
} from 'lucide-react';
import { ErpDatabase } from '../utils/erpDb';
import { Customer, SerialAllocation, PackUnit, Shipment, SalesRecord, QrRegistry, SerialNumber } from '../types/erp';
import { ProductionPage } from './ProductionPage';
import { ProductMasterPage } from './ProductMasterPage';
import { AiBomDesignCenter } from '../components/admin/AiBomDesignCenter';
import { ProductDigitalPassportModal } from '../components/ProductDigitalPassportModal';
import { UsersGovernanceView } from '../components/admin/UsersGovernanceView';
import { GeneralSettingsView } from '../components/admin/GeneralSettingsView';
import { WarrantyPolicyManagementView } from '../components/admin/WarrantyPolicyManagementView';
import { PrintSettingsView } from '../components/admin/PrintSettingsView';
import { EnterpriseSearchCenter } from '../components/admin/EnterpriseSearchCenter';

interface AdminPageProps {
  onBack: () => void;
  language: 'ar' | 'en';
  activeSection?: string;
  activeSubTab?: string;
}

// 6 OFFICIAL TOP LEVEL NAVIGATION SECTIONS (PROMPT-21)
export type AdminMainSection = 
  | 'product_mgmt'      // 1. إدارة المنتجات (Product Management)
  | 'pep'               // 2. هندسة PEP والتصنيع (PEP Engineering)
  | 'production'        // 3. الإنتاج والتشغيل (Production)
  | 'quality'           // 4. الجودة والرقابة (Quality)
  | 'warranty'          // 5. الضمان والعملاء (Warranty)
  | 'admin_system'      // 6. إدارة النظام (Administration)
  // Legacy aliases for backward compatibility:
  | 'warehouse'
  | 'sales'
  | 'customer_service'
  | 'reports';

// 5 TABS INSIDE "إدارة النظام" (PROMPT-033 PART 1)
type SystemAdminSubTab = 
  | 'audit_monitoring'  // 1. المتابعة والتدقيق (Combined Indicators + Immutable Logs)
  | 'users_roles'       // 2. المستخدمون والصلاحيات
  | 'general_settings'  // 3. الإعدادات العامة
  | 'warranty_policies' // 4. سياسات الضمان
  | 'print_settings';   // 5. إعدادات الطباعة

export const AdminPage: React.FC<AdminPageProps> = ({
  onBack,
  language,
  activeSection: propActiveSection,
  activeSubTab: propActiveSubTab,
}) => {
  const isAr = language === 'ar';
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // 6 Official Top Level Sections
  const [activeSection, setActiveSection] = useState<AdminMainSection>(() => {
    if (propActiveSection === 'warehouse') return 'production';
    if (propActiveSection === 'customer_service' || propActiveSection === 'sales') return 'warranty';
    if (propActiveSection === 'reports') return 'admin_system';
    return (propActiveSection as AdminMainSection) || 'product_mgmt';
  });

  // Section-specific Sub-Tab states
  const [productMgmtSubTab, setProductMgmtSubTab] = useState<'structure' | 'bom'>('structure');
  const [productionSubTab, setProductionSubTab] = useState<'daily_ops' | 'orders' | 'print' | 'warehouse'>('daily_ops');
  const [qualitySubTab, setQualitySubTab] = useState<'inspection' | 'audit'>('inspection');
  const [warrantySubTab, setWarrantySubTab] = useState<'registry' | 'customers' | 'sales'>('registry');

  React.useEffect(() => {
    if (propActiveSection) {
      if (propActiveSection === 'warehouse') {
        setActiveSection('production');
        setProductionSubTab('warehouse');
      } else if (propActiveSection === 'customer_service') {
        setActiveSection('warranty');
        setWarrantySubTab('customers');
      } else if (propActiveSection === 'sales') {
        setActiveSection('warranty');
        setWarrantySubTab('sales');
      } else if (propActiveSection === 'reports') {
        setActiveSection('admin_system');
        setSystemAdminTab('reports' as any);
      } else {
        setActiveSection(propActiveSection as AdminMainSection);
      }
    }
  }, [propActiveSection]);

  // Subtabs inside "إدارة النظام" (5 tabs, NO standalone dashboard)
  const [systemAdminTab, setSystemAdminTab] = useState<SystemAdminSubTab>(
    (propActiveSubTab as SystemAdminSubTab) || 'audit_monitoring'
  );

  React.useEffect(() => {
    if (propActiveSubTab) {
      setSystemAdminTab(propActiveSubTab as SystemAdminSubTab);
    }
  }, [propActiveSubTab]);

  // Audit Logs Search & Filter States (PROMPT-034 PART 2)
  const [auditSearch, setAuditSearch] = useState('');
  const [auditFilterAction, setAuditFilterAction] = useState<string>('All');
  const [auditFilterUser, setAuditFilterUser] = useState<string>('All');

  // Other Search & Filter States
  const [registrySearch, setRegistrySearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [salesSearch, setSalesSearch] = useState('');
  const [passportLookupInput, setPassportLookupInput] = useState('');
  const [selectedPassportSerial, setSelectedPassportSerial] = useState<string | null>(null);

  // Load live data from the ErpDatabase
  const products = ErpDatabase.getProducts();
  const orders = ErpDatabase.getProductionOrders();
  const serials = ErpDatabase.getSerialNumbers();
  const certificates = ErpDatabase.getWarrantyCertificates();
  const logs = ErpDatabase.getAuditLogs();
  const customers = ErpDatabase.getCustomers();
  const allocations = ErpDatabase.getAllocations();
  const packs = ErpDatabase.getPacks();
  const shipments = ErpDatabase.getShipments();
  const sales = ErpDatabase.getSalesRecords();
  const qrs = ErpDatabase.getQrRegistries();
  const boms = ErpDatabase.getBOMs();
  const policies = ErpDatabase.getWarrantyPolicies();
  const users = ErpDatabase.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123') {
      setUnlocked(true);
      setError(false);
      ErpDatabase.addAuditLog('Login', 'تم تسجيل دخول ناجح إلى مركز إدارة الضمان الإلكتروني.');
    } else {
      setError(true);
      ErpDatabase.addAuditLog('Security Alert', 'محاولة تسجيل دخول فاشلة للمركز الإداري.');
    }
  };

  // Filtered Audit Logs (PROMPT-034 PART 2)
  const filteredAuditLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.id.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.operator.toLowerCase().includes(auditSearch.toLowerCase()) ||
        log.details.toLowerCase().includes(auditSearch.toLowerCase());
      const matchesFilterAction = auditFilterAction === 'All' || log.action === auditFilterAction;
      const matchesFilterUser = auditFilterUser === 'All' || log.operator === auditFilterUser;
      return matchesSearch && matchesFilterAction && matchesFilterUser;
    });
  }, [logs, auditSearch, auditFilterAction, auditFilterUser]);

  // Unique actions for the filter dropdown
  const uniqueAuditActions = useMemo(() => {
    const set = new Set<string>();
    logs.forEach(l => set.add(l.action));
    return Array.from(set);
  }, [logs]);

  // Unique operators/users for the filter dropdown
  const uniqueAuditUsers = useMemo(() => {
    const set = new Set<string>();
    logs.forEach(l => {
      if (l.operator) set.add(l.operator);
    });
    return Array.from(set);
  }, [logs]);

  // Export Audit Logs to CSV (PROMPT-033 PART 2)
  const exportAuditLogsCSV = () => {
    const headers = ['Log ID', 'Action Type', 'Operator', 'Timestamp', 'Details'];
    const rows = filteredAuditLogs.map(l => [
      l.id,
      `"${l.action}"`,
      `"${l.operator}"`,
      `"${new Date(l.timestamp).toLocaleString('ar-EG')}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sleepee_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ErpDatabase.addAuditLog('Export', 'تم تصدير سجل التدقيق والمتابعة إلى ملف CSV.');
  };

  // Filtered Certificates for Reports
  const filteredCerts = useMemo(() => {
    return certificates.filter((c) => {
      const p = products.find(prod => prod.id === c.productId);
      const productName = p ? p.modelName : '';
      if (!registrySearch.trim()) return true;
      const q = registrySearch.trim().toLowerCase();
      return (
        c.serialNumber.toLowerCase().includes(q) ||
        c.warrantyNumber.toLowerCase().includes(q) ||
        productName.toLowerCase().includes(q) ||
        (c.customerName && c.customerName.toLowerCase().includes(q)) ||
        (c.customerPhone && c.customerPhone.includes(q))
      );
    });
  }, [certificates, products, registrySearch]);

  const exportRegistryCSV = () => {
    const headers = ['Warranty Certificate', 'Product Serial', 'Product Name', 'Customer Name', 'Customer Phone', 'Status', 'Expiry Date', 'Created Date'];
    const rows = certificates.map((c) => {
      const p = products.find(prod => prod.id === c.productId);
      return [
        c.warrantyNumber,
        c.serialNumber,
        p ? p.modelName : 'N/A',
        c.customerName || 'N/A',
        c.customerPhone || 'N/A',
        c.status,
        c.expiryDate,
        c.createdDate
      ];
    });
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sleepee_warranty_registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ErpDatabase.addAuditLog('Export', 'تم تصدير سجل مستودع شهادات الضمان بالكامل إلى ملف CSV.');
  };

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (!customerSearch.trim()) return true;
      const q = customerSearch.trim().toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.mobileNumber.toLowerCase().includes(q) ||
        (c.alternativeNumber && c.alternativeNumber.toLowerCase().includes(q)) ||
        c.governorate.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        (c.nationalId && c.nationalId.toLowerCase().includes(q))
      );
    });
  }, [customers, customerSearch]);

  const exportCustomersCSV = () => {
    const headers = ['Customer ID', 'Customer Name', 'Mobile Number', 'Alternative Number', 'Governorate', 'City', 'Address', 'National ID', 'Created Date', 'Status'];
    const rows = customers.map((c) => [
      c.id,
      c.name,
      c.mobileNumber,
      c.alternativeNumber || 'N/A',
      c.governorate,
      c.city,
      c.address,
      c.nationalId || 'N/A',
      c.createdDate,
      c.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sleepee_customer_registry_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ErpDatabase.addAuditLog('Export', 'تم تصدير سجل قاعدة بيانات العملاء الموحد بالكامل إلى ملف CSV.');
  };

  // Cleanup unused state from previous versions
  const [productionTab, setProductionTab] = useState<'structure' | 'orders' | 'serials' | 'print' | 'bom' | 'audit'>('structure');
  const [inlineSearchQuery, setInlineSearchQuery] = useState('');
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const centers = [
    { 
      id: 'product_mgmt', 
      ar: 'إدارة المنتجات', 
      en: 'Product Management', 
      icon: FolderTree,
      subItems: [
        { id: 'structure', ar: 'هيكل المنتجات', en: 'Product Structure' },
        { id: 'bom', ar: 'حزمة الهندسة والتصنيع (PEP)', en: 'Product Engineering Package (PEP)' }
      ]
    },
    { 
      id: 'pep', 
      ar: 'هندسة PEP', 
      en: 'PEP Engineering', 
      icon: Sparkles, 
      subItems: [] 
    },
    { 
      id: 'production', 
      ar: 'الإنتاج والتشغيل', 
      en: 'Production', 
      icon: Factory,
      subItems: [
        { id: 'daily_ops', ar: 'التشغيل اليومي', en: 'Daily Operations' },
        { id: 'orders', ar: 'أوامر الإنتاج والدفعات', en: 'Production Orders' },
        { id: 'print', ar: 'مركز الطباعة والتكويد', en: 'Printing Center' }
      ]
    },
    { 
      id: 'quality', 
      ar: 'الجودة والرقابة', 
      en: 'Quality', 
      icon: ShieldCheck,
      subItems: [
        { id: 'inspection', ar: 'بوابات فحص الجودة', en: 'Quality Inspection Gates' },
        { id: 'audit', ar: 'سجل التدقيق والمطابقة', en: 'Audit & Compliance Log' }
      ]
    },
    { 
      id: 'warranty', 
      ar: 'الضمان والعملاء', 
      en: 'Warranty', 
      icon: Award,
      subItems: [
        { id: 'registry', ar: 'مستودع الشهادات', en: 'Warranty Registry' },
        { id: 'customers', ar: 'قاعدة بيانات العملاء', en: 'Customer Database' },
        { id: 'sales', ar: 'سجل المبيعات ونقاط البيع', en: 'Sales Records' }
      ]
    },
    { 
      id: 'admin_system', 
      ar: 'إدارة النظام', 
      en: 'Administration', 
      icon: Settings,
      subItems: [
        { id: 'audit_monitoring', ar: 'المتابعة والتدقيق', en: 'Audit & Monitoring' },
        { id: 'users_roles', ar: 'المستخدمون والصلاحيات', en: 'Users & Roles' },
        { id: 'general_settings', ar: 'الإعدادات العامة', en: 'General Settings' },
        { id: 'warranty_policies', ar: 'سياسات الضمان', en: 'Warranty Policies' },
        { id: 'print_settings', ar: 'إعدادات الطباعة', en: 'Print Settings' },
        { id: 'reports', ar: 'التقارير الشاملة', en: 'Comprehensive Reports' }
      ]
    }
  ];

  const inlineSearchResults = useMemo(() => {
    const q = inlineSearchQuery.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    const list: any[] = [];
    
    // Products
    ErpDatabase.getProducts().filter(p => p.modelName?.toLowerCase().includes(q) || p.internalProductCode?.toLowerCase().includes(q)).slice(0, 4).forEach(p => {
      list.push({
        id: `prod-${p.id}`,
        type: 'Product',
        title: p.modelName,
        subtitle: `${p.internalProductCode} • ${p.width}×${p.length}×${p.height} cm`,
        meta: p.status,
        targetSection: 'product_mgmt',
        targetTab: 'structure'
      });
    });
    // Serials
    ErpDatabase.getSerialNumbers().filter(s => s.serialNumber.toLowerCase().includes(q)).slice(0, 4).forEach(s => {
      list.push({
        id: `ser-${s.serialNumber}`,
        type: 'Serial',
        title: s.serialNumber,
        subtitle: s.warrantyNumber,
        meta: s.status,
        targetSection: 'production',
        targetTab: 'serials'
      });
    });
    // Customers
    ErpDatabase.getCustomers().filter(c => c.name.toLowerCase().includes(q) || c.mobileNumber.includes(q)).slice(0, 4).forEach(c => {
      list.push({
        id: `cust-${c.id}`,
        type: 'Customer',
        title: c.name,
        subtitle: `${c.mobileNumber} • ${c.governorate}`,
        meta: c.customerType || 'Retail',
        targetSection: 'warranty'
      });
    });
    // Users
    ErpDatabase.getUsers().filter(u => u.name.toLowerCase().includes(q)).slice(0, 4).forEach(u => {
      list.push({
        id: `usr-${u.id}`,
        type: 'User',
        title: u.name,
        subtitle: `${u.email} • ${u.role}`,
        meta: u.department,
        targetSection: 'admin_system',
        targetTab: 'users_roles'
      });
    });
    // Warranty
    ErpDatabase.getWarrantyCertificates().filter(w => w.warrantyNumber.toLowerCase().includes(q)).slice(0, 4).forEach((w, idx) => {
      list.push({
        id: `cert-${idx}`,
        type: 'Warranty',
        title: w.warrantyNumber,
        subtitle: `${w.customerName || 'N/A'} • ${w.serialNumber}`,
        meta: w.status,
        targetSection: 'warranty'
      });
    });
    return list;
  }, [inlineSearchQuery]);

  const getBreadcrumbData = () => {
    const centerObj = centers.find(c => c.id === activeSection);
    const centerName = isAr ? centerObj?.ar : centerObj?.en;
    const CenterIcon = centerObj?.icon || Settings;

    let subName = '';
    let SubIcon = CenterIcon;

    if (activeSection === 'product_mgmt') {
      subName = productMgmtSubTab === 'structure' 
        ? (isAr ? 'هيكل المنتجات' : 'Product Structure') 
        : (isAr ? 'حزمة الهندسة والتصنيع (PEP)' : 'Product Engineering Package (PEP)');
      SubIcon = productMgmtSubTab === 'structure' ? FolderTree : Layers;
    } else if (activeSection === 'pep') {
      subName = isAr ? 'حزمة الهندسة والتصنيع (PEP v1.0)' : 'Product Engineering Package (PEP v1.0)';
      SubIcon = Sparkles;
    } else if (activeSection === 'production') {
      subName = isAr ? 'أوامر الإنتاج والتشغيل اليومي' : 'Production Orders & Operations';
      SubIcon = Factory;
    } else if (activeSection === 'quality') {
      subName = qualitySubTab === 'inspection'
        ? (isAr ? 'بوابات فحص الجودة الفنية' : 'Quality Inspection Gates')
        : (isAr ? 'سجل التدقيق والمطابقة' : 'Audit & Compliance Log');
      SubIcon = ShieldCheck;
    } else if (activeSection === 'warranty') {
      subName = warrantySubTab === 'registry'
        ? (isAr ? 'مستودع شهادات الضمان' : 'Warranty Registry')
        : warrantySubTab === 'customers'
        ? (isAr ? 'قاعدة بيانات وسجل العملاء' : 'Customer Database')
        : (isAr ? 'سجل المبيعات ونقاط البيع' : 'Sales Records & POS');
      SubIcon = Award;
    } else if (activeSection === 'admin_system') {
      const subMap: Record<string, { ar: string; en: string; icon: any }> = {
        audit_monitoring: { ar: 'المتابعة والتدقيق', en: 'Audit & Monitoring', icon: Activity },
        users_roles: { ar: 'المستخدمون والصلاحيات', en: 'Users & Roles', icon: Users },
        general_settings: { ar: 'الإعدادات العامة', en: 'General Settings', icon: Sliders },
        warranty_policies: { ar: 'سياسات الضمان', en: 'Warranty Policies', icon: Shield },
        print_settings: { ar: 'إعدادات الطباعة', en: 'Print Settings', icon: Printer },
        reports: { ar: 'التقارير الشاملة', en: 'Comprehensive Reports', icon: Archive }
      };
      const found = subMap[systemAdminTab];
      if (found) {
        subName = isAr ? found.ar : found.en;
        SubIcon = found.icon;
      }
    }

    return {
      centerName: centerName || (isAr ? 'الإدارة' : 'Administration'),
      CenterIcon,
      subName,
      SubIcon
    };
  };

  const breadcrumb = getBreadcrumbData();

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900 min-h-[85vh] py-6 px-4 sm:px-6 text-start font-sans transition-colors overflow-visible">
      <div className="max-w-[1360px] mx-auto bg-surface dark:bg-surface-secondary rounded-3xl border border-border-main shadow-sm overflow-visible flex flex-col">
        
        {/* LAYOUT-NORMALIZATION Toolbar (Target Height: 72px) */}
        <div className="flex items-center px-6 h-[72px] border-b border-border-main bg-slate-100/50 dark:bg-surface shrink-0 gap-4 overflow-visible z-100 relative">
          
          {/* 1. Platform Identity (Far Right in RTL) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600 border border-blue-100/50 shadow-xs">
              <ShieldCheck size={24} style={{ color: '#2563EB' }} />
            </div>
            <h1 className="text-sm font-black text-[#0B2D5C] dark:text-blue-300 whitespace-nowrap tracking-tight">
              {isAr ? 'منظومة إدارة وتشغيل الضمان الإلكتروني' : 'Sleepee Enterprise Warranty Platform'}
            </h1>
          </div>

          <div className="w-6 shrink-0" />

          {/* 2. Horizontal Navigation (6 Official Top Level Centers) - No Dropdowns */}
          <nav className="flex items-center gap-1.5 overflow-visible">
            {centers.map((center) => {
              const Icon = center.icon;
              const isActive = activeSection === center.id;

              return (
                <button
                  key={center.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(center.id as any);
                    if (center.id === 'admin_system') setSystemAdminTab('audit_monitoring');
                    if (center.id === 'product_mgmt') setProductMgmtSubTab('structure');
                    if (center.id === 'production') setProductionSubTab('daily_ops');
                    if (center.id === 'quality') setQualitySubTab('inspection');
                    if (center.id === 'warranty') setWarrantySubTab('registry');
                  }}
                  className={`h-10 px-3.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-2 border shadow-xs ${
                    isActive 
                      ? 'bg-[#0B2D5C] text-white border-[#0B2D5C] shadow-sm ring-2 ring-[#0B2D5C]/20' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0B2D5C]/40 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : 'text-[#0B2D5C] dark:text-blue-400'} />
                  <span className="whitespace-nowrap">{isAr ? center.ar : center.en}</span>
                </button>
              );
            })}
          </nav>

          {/* Flexible Spacer */}
          <div className="flex-1" />

          {/* 3. Search & Exit Tools (Normalized 40px Height) */}
          <div className="flex items-center gap-2 shrink-0 overflow-visible relative">
            
            {/* Compact Search Trigger */}
            <div className="relative overflow-visible">
              <button
                type="button"
                onClick={() => setIsSearchPopoverOpen(!isSearchPopoverOpen)}
                className={`h-10 px-3 flex items-center gap-2 rounded-xl transition-all cursor-pointer border shadow-xs ${
                  isSearchPopoverOpen 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                    : 'bg-white dark:bg-slate-800 text-blue-600 border-slate-200 dark:border-slate-700 hover:border-blue-600'
                }`}
              >
                <Search size={18} />
                <span className="text-[11px] font-bold hidden sm:inline">{isAr ? 'بحث سريع' : 'Quick Search'}</span>
              </button>

              {/* Search Popover Overlay */}
              {isSearchPopoverOpen && (
                <>
                  <div className="fixed inset-0 z-[500]" onClick={() => setIsSearchPopoverOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-[420px] z-[501] animate-fade-in shadow-2xl">
                    <div className="bg-surface dark:bg-surface-secondary border border-border-main rounded-2xl p-3 space-y-3 backdrop-blur-md">
                      <div className="relative">
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none" />
                        <input
                          autoFocus
                          type="text"
                          value={inlineSearchQuery}
                          onChange={(e) => setInlineSearchQuery(e.target.value)}
                          placeholder={isAr ? 'بحث فوري متعدد الوحدات...' : 'Instant multi-unit search...'}
                          className="w-full h-11 pr-10 pl-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-text-primary focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                        />
                      </div>

                      {/* Results area */}
                      <div className="max-h-[320px] overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                        {inlineSearchQuery.trim().length >= 2 ? (
                          inlineSearchResults.length > 0 ? (
                            inlineSearchResults.map((res) => (
                              <div
                                key={res.id}
                                onClick={() => {
                                  setActiveSection(res.targetSection);
                                  if (res.targetSection === 'admin_system' && res.targetTab) {
                                    setSystemAdminTab(res.targetTab as any);
                                  }
                                  setInlineSearchQuery('');
                                  setIsSearchPopoverOpen(false);
                                }}
                                className="p-2.5 bg-white dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all"
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 dark:bg-blue-900/50 px-1.5 py-0.5 rounded-md">{res.type}</span>
                                    <span className="text-slate-300 text-[10px]">•</span>
                                    <span className="text-[9px] font-mono text-slate-500">{res.meta}</span>
                                  </div>
                                  <div className="text-[11px] font-black text-text-primary mt-0.5">{res.title}</div>
                                </div>
                                <ArrowRight size={14} className="text-slate-300 rtl:rotate-180" />
                              </div>
                            ))
                          ) : (
                            <div className="py-6 text-center">
                              <p className="text-[11px] font-bold text-slate-400">{isAr ? 'لا توجد نتائج مطابقة' : 'No results found'}</p>
                            </div>
                          )
                        ) : (
                          <div className="py-4 text-center text-slate-400 text-[10px] font-medium">
                            {isAr ? 'اكتب حرفين للبحث...' : 'Type 2 chars to search...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Back Button (Normalized 40px) */}
            <button
              onClick={onBack}
              title={isAr ? 'خروج للبحث العام' : 'Exit to Portal'}
              className="h-10 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl text-[11px] font-black flex items-center gap-2 transition-all cursor-pointer border border-rose-100 dark:border-rose-900 shadow-xs"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{isAr ? 'خروج للبحث العام' : 'Exit to Portal'}</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 flex-1">
          {!unlocked ? (
            <div className="max-w-md mx-auto py-12">
              <form onSubmit={handleLogin} className="space-y-4 bg-slate-50 dark:bg-surface border border-border-main p-6 rounded-2xl shadow-2xs">
                <div className="text-center space-y-2 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Key size={24} />
                  </div>
                  <h3 className="font-bold text-sm text-[#0B2D5C] dark:text-text-primary">
                    {isAr ? 'تسجيل الدخول للمنظومة الإدارية' : 'System Administration Login'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'أدخل كلمة المرور المصرح بها للمتابعة (الافتراضية: 123)' : 'Enter authorized password to proceed (Default: 123)'}
                  </p>
                </div>

                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isAr ? 'كلمة المرور...' : 'Password...'}
                    className="w-full h-11 px-3 bg-surface border border-border-main rounded-xl text-center text-sm tracking-widest outline-none focus:border-blue-600 font-mono"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0 text-rose-600" />
                    <span>{isAr ? 'كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.' : 'Incorrect password. Please try again.'}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer transition-all"
                >
                  {isAr ? 'دخول' : 'Sign In'}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Universal Breadcrumb Standard (PROMPT-21) */}
              {/* Standard Format: Home > Product Management > Product Family > Model > PEP v1.0 */}
              <div className="bg-surface border border-border-main px-4 py-2.5 rounded-xl shadow-2xs flex items-center justify-between gap-3 text-xs font-bold">
                <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
                  {/* Step 1: Home */}
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors cursor-pointer font-bold text-xs"
                    title={isAr ? 'العودة للبوابة الرئيسية' : 'Return to Home'}
                  >
                    <Home size={13} className="text-slate-500" />
                    <span>{isAr ? 'الرئيسية (Home)' : 'Home'}</span>
                  </button>

                  <ChevronRight size={13} className="rtl:rotate-180 text-slate-400 shrink-0" />

                  {/* Level 2: Section or Product Management */}
                  {(activeSection === 'pep' || activeSection === 'product_mgmt') ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection('product_mgmt');
                          setProductMgmtSubTab('structure');
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors font-black text-xs ${
                          activeSection === 'product_mgmt' && productMgmtSubTab === 'structure'
                            ? 'bg-[#0B2D5C] text-white'
                            : 'bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-100 cursor-pointer'
                        }`}
                      >
                        <FolderTree size={13} />
                        <span>{isAr ? 'إدارة المنتجات (Product Management)' : 'Product Management'}</span>
                      </button>

                      <ChevronRight size={13} className="rtl:rotate-180 text-slate-400 shrink-0" />

                      <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-bold">
                        <span>{isAr ? 'عائلة المراتب (Spring Mattress)' : 'Spring Mattress'}</span>
                      </div>

                      <ChevronRight size={13} className="rtl:rotate-180 text-slate-400 shrink-0" />

                      <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md text-[11px] font-black">
                        <span>{isAr ? 'موديل سيلفر (Silver 25cm)' : 'Silver 25cm'}</span>
                      </div>

                      <ChevronRight size={13} className="rtl:rotate-180 text-slate-400 shrink-0" />

                      <button
                        type="button"
                        onClick={() => {
                          setActiveSection('pep');
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black cursor-pointer transition-all ${
                          activeSection === 'pep' || (activeSection === 'product_mgmt' && productMgmtSubTab === 'bom')
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                        }`}
                      >
                        <Sparkles size={12} />
                        <span>PEP v1.0</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg font-black text-xs">
                        <breadcrumb.CenterIcon size={13} />
                        <span>{breadcrumb.centerName}</span>
                      </div>

                      {breadcrumb.subName && (
                        <>
                          <ChevronRight size={13} className="rtl:rotate-180 text-slate-400 shrink-0" />
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg font-black text-xs">
                            <breadcrumb.SubIcon size={13} className="text-[#0B2D5C] dark:text-blue-400 shrink-0" />
                            <span>{breadcrumb.subName}</span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="text-[11px] text-slate-400 font-bold hidden md:block">
                  {isAr ? 'مركز الهندسة والتصنيع الموحد (PEP Single Source of Truth)' : 'PEP Single Source of Truth'}
                </div>
              </div>

              {/* ============================================================ */}
              {/* 1. إدارة النظام (PROMPT-033 PART 1: 5 Subtabs Only)             */}
              {/* ├─ 1. المتابعة والتدقيق                                        */}
              {/* ├─ 2. المستخدمون والصلاحيات                                    */}
              {/* ├─ 3. الإعدادات العامة                                          */}
              {/* ├─ 4. سياسات الضمان                                            */}
              {/* └─ 5. إعدادات الطباعة                                          */}
              {/* ============================================================ */}
              {activeSection === 'admin_system' && (
                <div className="space-y-5 animate-fade-in">

                  {/* ============================================================ */}
                  {/* 1.1 المتابعة والتدقيق (PROMPT-033 PART 2: 2 SECTIONS ONLY)    */}
                  {/* SECTION A: مؤشرات النظام                                      */}
                  {/* SECTION B: سجل التدقيق                                       */}
                  {/* ============================================================ */}
                  {systemAdminTab === 'audit_monitoring' && (
                    <div className="space-y-6 animate-fade-in">
                      
                      {/* SECTION A: مؤشرات النظام (SYSTEM INDICATORS) */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-border-main pb-2">
                          <Activity size={16} className="text-blue-600" />
                          <h3 className="font-extrabold text-xs text-[#0B2D5C] dark:text-blue-300">
                            {isAr ? 'القسم (أ): مؤشرات النظام الرئيسية (System Key Indicators)' : 'Section (A): System Key Indicators'}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                          <div className="bg-surface p-4 rounded-2xl border border-border-main space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'عدد المنتجات' : 'Products'}</span>
                            <span className="font-mono text-xl font-black text-blue-600">
                              {products.length}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-semibold">{isAr ? 'Total Products' : 'إجمالي المنتجات'}</span>
                          </div>

                          <div className="bg-surface p-4 rounded-2xl border border-border-main space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'عدد أوامر الإنتاج' : 'Orders'}</span>
                            <span className="font-mono text-xl font-black text-[#0B2D5C] dark:text-blue-300">
                              {orders.length}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-semibold">{isAr ? 'Production Orders' : 'أوامر الإنتاج'}</span>
                          </div>

                          <div className="bg-surface p-4 rounded-2xl border border-border-main space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'عدد التسلسلات' : 'Serials'}</span>
                            <span className="font-mono text-xl font-black text-emerald-600">
                              {serials.length}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-semibold">{isAr ? 'Tracked Serials' : 'التسلسلات الموثقة'}</span>
                          </div>

                          <div className="bg-surface p-4 rounded-2xl border border-border-main space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'عدد شهادات الضمان' : 'Certificates'}</span>
                            <span className="font-mono text-xl font-black text-teal-600">
                              {certificates.length}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-semibold">{isAr ? 'Warranty Certs' : 'شهادات الضمان'}</span>
                          </div>

                          <div className="bg-surface p-4 rounded-2xl border border-border-main space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'إجمالي المستخدمين' : 'Users'}</span>
                            <span className="font-mono text-xl font-black text-purple-600">
                              {users.length}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-semibold">{isAr ? 'Authorized Users' : 'المستخدمون المعتمدون'}</span>
                          </div>

                          <div className="bg-surface p-4 rounded-2xl border border-border-main space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold block">{isAr ? 'إجمالي سياسات الضمان' : 'Policies'}</span>
                            <span className="font-mono text-xl font-black text-amber-600">
                              {policies.length}
                            </span>
                            <span className="text-[9px] text-slate-400 block font-semibold">{isAr ? 'Warranty Policies' : 'سياسات الضمان'}</span>
                          </div>
                        </div>
                      </div>

                      {/* SECTION B: سجل التدقيق (AUDIT LOGS) */}
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-border-main pb-2">
                          <div className="flex items-center gap-2">
                            <Terminal size={16} className="text-blue-600" />
                            <h3 className="font-extrabold text-xs text-[#0B2D5C] dark:text-blue-300">
                              {isAr ? 'القسم (ب): سجل التدقيق والمتابعة (Immutable Audit Log)' : 'Section (B): Immutable Audit Log'}
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold">
                              {filteredAuditLogs.length} {isAr ? 'حدث' : 'events'}
                            </span>
                          </div>

                          {/* Search, Filter & Export Toolbar (PROMPT-034 PART 2) */}
                          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-56">
                              <input
                                type="text"
                                value={auditSearch}
                                onChange={(e) => setAuditSearch(e.target.value)}
                                placeholder={isAr ? 'بحث في السجل والعمليات...' : 'Search logs and operations...'}
                                className="w-full h-9 rtl:pr-8 rtl:pl-3 ltr:pl-8 ltr:pr-3 bg-surface border border-border-main rounded-xl text-xs outline-none focus:border-blue-600 font-sans"
                              />
                              <Search size={14} className="absolute rtl:right-2.5 ltr:left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>

                            <select
                              value={auditFilterAction}
                              onChange={(e) => setAuditFilterAction(e.target.value)}
                              className="h-9 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
                            >
                              <option value="All">{isAr ? `جميع العمليات (${logs.length})` : `All Actions (${logs.length})`}</option>
                              {uniqueAuditActions.map(action => (
                                <option key={action} value={action}>{action}</option>
                              ))}
                            </select>

                            <select
                              value={auditFilterUser}
                              onChange={(e) => setAuditFilterUser(e.target.value)}
                              className="h-9 px-3 bg-surface border border-border-main rounded-xl text-xs font-bold outline-none cursor-pointer"
                            >
                              <option value="All">{isAr ? 'جميع المستخدمين' : 'All Users'}</option>
                              {uniqueAuditUsers.map(u => (
                                <option key={u} value={u}>{u}</option>
                              ))}
                            </select>

                            <button
                              type="button"
                              onClick={exportAuditLogsCSV}
                              className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                            >
                              <FileSpreadsheet size={14} />
                              <span>{isAr ? 'تصدير CSV' : 'Export CSV'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Audit Table */}
                        <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface shadow-2xs">
                          <table className="w-full text-start text-xs">
                            <thead className="bg-slate-100/70 dark:bg-surface text-text-secondary font-bold border-b border-border-main">
                              <tr>
                                <th className="p-3.5 whitespace-nowrap">Log ID</th>
                                <th className="p-3.5 whitespace-nowrap">{isAr ? 'نوع العملية' : 'Action Type'}</th>
                                <th className="p-3.5 whitespace-nowrap">{isAr ? 'المستخدم' : 'Operator'}</th>
                                <th className="p-3.5 whitespace-nowrap">{isAr ? 'التاريخ والوقت' : 'Date & Time'}</th>
                                <th className="p-3.5">{isAr ? 'تفاصيل العملية' : 'Action Details'}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-border-main text-text-primary">
                              {filteredAuditLogs.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                                    {isAr ? 'لا توجد سجلات تدقيق تطابق محددات البحث الحالية.' : 'No audit logs match current search criteria.'}
                                  </td>
                                </tr>
                              ) : (
                                filteredAuditLogs.map((log) => (
                                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="p-3.5 font-mono font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                                      {log.id}
                                    </td>
                                    <td className="p-3.5 whitespace-nowrap">
                                      <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-[#0B2D5C] dark:text-blue-300 font-bold text-[11px]">
                                        {log.action}
                                      </span>
                                    </td>
                                    <td className="p-3.5 font-semibold whitespace-nowrap">
                                      {log.operator}
                                    </td>
                                    <td className="p-3.5 text-slate-400 font-mono text-[10px] whitespace-nowrap">
                                      {new Date(log.timestamp).toLocaleString('ar-EG')}
                                    </td>
                                    <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-md">
                                      {log.details}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* 1.2 USERS & ROLES TAB (PROMPT-034 PART 3) */}
                  {systemAdminTab === 'users_roles' && (
                    <UsersGovernanceView />
                  )}

                  {/* 1.3 GENERAL SETTINGS TAB (PROMPT-034 PART 4) */}
                  {systemAdminTab === 'general_settings' && (
                    <GeneralSettingsView />
                  )}

                  {/* 1.4 WARRANTY POLICIES TAB (PROMPT-034 PART 5) */}
                  {systemAdminTab === 'warranty_policies' && (
                    <WarrantyPolicyManagementView />
                  )}

                  {/* 1.5 PRINT SETTINGS TAB (PROMPT-034 PART 6) */}
                  {systemAdminTab === 'print_settings' && (
                    <PrintSettingsView />
                  )}

                </div>
              )}

              {/* ============================================================ */}
              {/* 1. إدارة المنتجات (PRODUCT MANAGEMENT & MASTER)                 */}
              {/* IF ONLY PEP MODULE IS ACTIVE: Simplified to Structure | PEP  */}
              {/* ============================================================ */}
              {activeSection === 'product_mgmt' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Simplified Top Sub-bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100/70 dark:bg-slate-900/50 p-2 rounded-2xl border border-border-main">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setProductMgmtSubTab('structure')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                          productMgmtSubTab === 'structure'
                            ? 'bg-[#0B2D5C] text-white border-[#0B2D5C] shadow-xs'
                            : 'bg-surface text-slate-700 dark:text-slate-300 border-border-main hover:bg-slate-50'
                        }`}
                      >
                        <FolderTree size={15} />
                        <span>{isAr ? 'هيكل المنتجات' : 'Product Structure'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProductMgmtSubTab('bom')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                          productMgmtSubTab === 'bom'
                            ? 'bg-[#0B2D5C] text-white border-[#0B2D5C] shadow-xs'
                            : 'bg-surface text-slate-700 dark:text-slate-300 border-border-main hover:bg-slate-50'
                        }`}
                      >
                        <Layers size={15} />
                        <span>{isAr ? 'حزمة الهندسة والتصنيع (PEP)' : 'Product Engineering Package (PEP)'}</span>
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 font-bold px-3">
                      {isAr ? 'هندسة وإدارة المنتجات الصناعية الموحدة' : 'Unified Product Engineering & Master'}
                    </div>
                  </div>

                  {productMgmtSubTab === 'structure' && (
                    <div className="animate-fade-in">
                      <ProductMasterPage />
                    </div>
                  )}

                  {productMgmtSubTab === 'bom' && (
                    <div className="animate-fade-in">
                      <AiBomDesignCenter />
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* 2. هندسة PEP والتصنيع (PEP ENGINEERING WORKBENCH)             */}
              {/* ============================================================ */}
              {activeSection === 'pep' && (
                <div className="animate-fade-in">
                  <AiBomDesignCenter />
                </div>
              )}

              {/* ============================================================ */}
              {/* 3. الإنتاج (CONSOLIDATED PRODUCTION CENTER)                    */}
              {/* ============================================================ */}
              {activeSection === 'production' && (
                <div className="animate-fade-in">
                  <ProductionPage activeTab={productionTab} onTabChange={setProductionTab} initialMainTab="daily_ops" />
                </div>
              )}

              {/* ============================================================ */}
              {/* 4. الجودة والرقابة (QUALITY & COMPLIANCE INSPECTION GATES)     */}
              {/* ============================================================ */}
              {activeSection === 'quality' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Quality Sub-tabs */}
                  <div className="flex items-center gap-2 bg-slate-100/70 dark:bg-slate-900/50 p-2 rounded-2xl border border-border-main">
                    <button
                      type="button"
                      onClick={() => setQualitySubTab('inspection')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                        qualitySubTab === 'inspection'
                          ? 'bg-[#0B2D5C] text-white border-[#0B2D5C] shadow-xs'
                          : 'bg-surface text-slate-700 dark:text-slate-300 border-border-main hover:bg-slate-50'
                      }`}
                    >
                      <ShieldCheck size={15} />
                      <span>{isAr ? 'بوابات فحص الجودة الفنية (Inspection Gates)' : 'Quality Inspection Gates'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQualitySubTab('audit')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                        qualitySubTab === 'audit'
                          ? 'bg-[#0B2D5C] text-white border-[#0B2D5C] shadow-xs'
                          : 'bg-surface text-slate-700 dark:text-slate-300 border-border-main hover:bg-slate-50'
                      }`}
                    >
                      <Terminal size={15} />
                      <span>{isAr ? 'سجل التدقيق والمطابقة الشامل' : 'Compliance & Audit Log'}</span>
                    </button>
                  </div>

                  {qualitySubTab === 'inspection' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-surface rounded-2xl border border-border-main space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold block">إجمالي محطات الفحص الفني</span>
                          <span className="font-mono text-2xl font-black text-[#0B2D5C] dark:text-blue-300">5 Gates</span>
                          <span className="text-[10px] text-emerald-600 font-bold block">معتمدة ومطابقة لمواصفة ISO 9001</span>
                        </div>
                        <div className="p-4 bg-surface rounded-2xl border border-border-main space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold block">معدل اجتياز الجودة من أول مرة (FTQ)</span>
                          <span className="font-mono text-2xl font-black text-emerald-600">98.4%</span>
                          <span className="text-[10px] text-slate-400 font-bold block">First Time Quality Yield</span>
                        </div>
                        <div className="p-4 bg-surface rounded-2xl border border-border-main space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold block">حالات الحيود المعلقة (Deviations)</span>
                          <span className="font-mono text-2xl font-black text-amber-600">0</span>
                          <span className="text-[10px] text-emerald-600 font-bold block">صفر انحرافات حرجة</span>
                        </div>
                      </div>

                      {/* 5 Quality Gates Table */}
                      <div className="bg-surface rounded-2xl border border-border-main overflow-hidden shadow-xs">
                        <div className="p-4 border-b border-border-main bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                          <div className="font-bold text-xs text-[#0B2D5C] dark:text-blue-300">
                            بوابات الفحص الإلزامي لخطوط إنتاج مراتب سليبي
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            نشطة وآلية 100%
                          </span>
                        </div>
                        <div className="divide-y divide-border-main text-xs">
                          {[
                            { gate: 'Gate 01', nameAr: 'فحص كثافة وأبعاد طبقات الإسفنج', tolerance: '±2mm / ±0.5kg/m³', station: 'FOAM-CUT-01' },
                            { gate: 'Gate 02', nameAr: 'فحص عزم وصلابة نوابض البوكت سبرنج', tolerance: 'معيار ASTM F1566', station: 'SPRING-ASSY-01' },
                            { gate: 'Gate 03', nameAr: 'فحص انتظام كبتنة وتطريز القماش العلوي', tolerance: 'خلو كامل من تفويت الغرز', station: 'QUILT-LINE-01' },
                            { gate: 'Gate 04', nameAr: 'فحص حياكة الشريط المداري الداير Tape Edge', tolerance: 'إحكام الشد وسلامة العوارض', station: 'TAPE-EDGE-01' },
                            { gate: 'Gate 05', nameAr: 'الفحص النهائي للأبعاد والتغليف بالفاكيوم', tolerance: 'الوزن والارتفاع والتفريغ', station: 'QC-PACK-01' },
                          ].map((g, idx) => (
                            <div key={idx} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/50">
                              <div className="flex items-center gap-3">
                                <span className="font-mono font-bold text-blue-600 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 rounded-lg">{g.gate}</span>
                                <div>
                                  <div className="font-bold text-slate-800 dark:text-slate-200">{g.nameAr}</div>
                                  <div className="text-[10px] text-slate-400">محطة التشغيل: {g.station} • حدود التفاوت: {g.tolerance}</div>
                                </div>
                              </div>
                              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                ✓ معتمد ومطابق
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {qualitySubTab === 'audit' && (
                    <div className="space-y-4">
                      <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
                        <table className="w-full text-right text-xs">
                          <thead className="bg-slate-50 dark:bg-surface text-slate-500 font-bold border-b border-border-main">
                            <tr>
                              <th className="p-3">التوقيت</th>
                              <th className="p-3">نوع الحدث</th>
                              <th className="p-3">المستخدم</th>
                              <th className="p-3">التفاصيل</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-main">
                            {filteredAuditLogs.slice(0, 15).map(log => (
                              <tr key={log.id} className="hover:bg-slate-50/60">
                                <td className="p-3 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                                <td className="p-3 font-bold text-blue-600">{log.action}</td>
                                <td className="p-3 font-mono text-[11px]">{log.operator}</td>
                                <td className="p-3 text-slate-700 dark:text-slate-300">{log.details}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ============================================================ */}
              {/* 3. المخازن (WAREHOUSE & INVENTORY REGISTRY)                   */}
              {/* ============================================================ */}
              {activeSection === 'warehouse' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface border border-border-main p-4 rounded-2xl">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0B2D5C] dark:text-text-primary flex items-center gap-2">
                        <Truck size={18} className="text-blue-600" />
                        <span>سجل إدارة المخازن والتخصيصات (Warehouse & Inventory)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        حصر مواقع السيريالات، الطرود المشحونة، وحركة المستودعات.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        value={warehouseSearch}
                        onChange={(e) => setWarehouseSearch(e.target.value)}
                        placeholder="بحث برقم السيريال أو اسم الموقع..."
                        className="w-full h-10 pr-9 pl-3 bg-surface border border-border-main rounded-xl text-xs outline-none"
                      />
                      <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 dark:bg-surface text-slate-500 font-bold border-b border-border-main">
                        <tr>
                          <th className="p-3.5">كود التخصيص</th>
                          <th className="p-3.5">الرقم التسلسلي</th>
                          <th className="p-3.5">نوع الموقع</th>
                          <th className="p-3.5">اسم المخزن / الجهة</th>
                          <th className="p-3.5">تاريخ التخصيص</th>
                          <th className="p-3.5 text-center">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {allocations
                          .filter(a => !warehouseSearch || a.serialNumber.toLowerCase().includes(warehouseSearch.toLowerCase()) || a.allocationName.toLowerCase().includes(warehouseSearch.toLowerCase()))
                          .map(alloc => (
                            <tr key={alloc.allocationId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                              <td className="p-3.5 font-mono font-bold text-blue-700 dark:text-blue-400">{alloc.allocationId}</td>
                              <td className="p-3.5 font-mono font-bold">{alloc.serialNumber}</td>
                              <td className="p-3.5 font-bold text-purple-600">{alloc.allocationType}</td>
                              <td className="p-3.5">{alloc.allocationName}</td>
                              <td className="p-3.5 font-mono text-slate-500">{new Date(alloc.allocationDate).toLocaleDateString('ar-EG')}</td>
                              <td className="p-3.5 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  alloc.status === 'Allocated' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {alloc.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* 5. الضمان والعملاء (WARRANTY & CUSTOMER OPERATIONS)          */}
              {/* ============================================================ */}
              {activeSection === 'warranty' && (
                <div className="flex flex-wrap items-center gap-2 bg-slate-100/70 dark:bg-slate-900/50 p-2 rounded-2xl border border-border-main mb-4">
                  <button
                    type="button"
                    onClick={() => setWarrantySubTab('registry')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                      warrantySubTab === 'registry'
                        ? 'bg-[#0B2D5C] text-white border-[#0B2D5C] shadow-xs'
                        : 'bg-surface text-slate-700 dark:text-slate-300 border-border-main hover:bg-slate-50'
                    }`}
                  >
                    <Award size={15} />
                    <span>{isAr ? 'مستودع شهادات الضمان' : 'Warranty Registry'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWarrantySubTab('customers')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                      warrantySubTab === 'customers'
                        ? 'bg-[#0B2D5C] text-white border-[#0B2D5C] shadow-xs'
                        : 'bg-surface text-slate-700 dark:text-slate-300 border-border-main hover:bg-slate-50'
                    }`}
                  >
                    <Users size={15} />
                    <span>{isAr ? 'قاعدة بيانات وسجل العملاء' : 'Customer Database'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWarrantySubTab('sales')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                      warrantySubTab === 'sales'
                        ? 'bg-[#0B2D5C] text-white border-[#0B2D5C] shadow-xs'
                        : 'bg-surface text-slate-700 dark:text-slate-300 border-border-main hover:bg-slate-50'
                    }`}
                  >
                    <ShoppingBag size={15} />
                    <span>{isAr ? 'سجل المبيعات ونقاط البيع' : 'Sales Records & POS'}</span>
                  </button>
                </div>
              )}

              {/* SALES SECTION (Unified inside Warranty or Legacy Direct) */}
              {((activeSection === 'warranty' && warrantySubTab === 'sales') || activeSection === 'sales') && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface border border-border-main p-4 rounded-2xl">
                    <div>
                      <h3 className="font-extrabold text-sm text-[#0B2D5C] dark:text-text-primary flex items-center gap-2">
                        <ShoppingBag size={18} className="text-emerald-600" />
                        <span>سجل المبيعات ونقاط التوزيع (Sales & Distribution Registry)</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        ربط فواتير البيع بالسيريالات الرسمية قبل تفعيل الضمان.
                      </p>
                    </div>

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        value={salesSearch}
                        onChange={(e) => setSalesSearch(e.target.value)}
                        placeholder="بحث برقم الفاتورة أو العميل..."
                        className="w-full h-10 pr-9 pl-3 bg-surface border border-border-main rounded-xl text-xs outline-none"
                      />
                      <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 dark:bg-surface text-slate-500 font-bold border-b border-border-main">
                        <tr>
                          <th className="p-3.5">رقم الفاتورة</th>
                          <th className="p-3.5">الرقم التسلسلي</th>
                          <th className="p-3.5">اسم المشتري</th>
                          <th className="p-3.5">رقم الهاتف</th>
                          <th className="p-3.5">المعرض / الموزع</th>
                          <th className="p-3.5">تاريخ الفاتورة</th>
                          <th className="p-3.5 text-center">حالة الضمان</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {sales
                          .filter(s => !salesSearch || s.invoiceNumber.toLowerCase().includes(salesSearch.toLowerCase()) || s.customerName.toLowerCase().includes(salesSearch.toLowerCase()))
                          .map(sale => (
                            <tr key={sale.salesId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                              <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">{sale.invoiceNumber}</td>
                              <td className="p-3.5 font-mono font-bold">{sale.serialNumber}</td>
                              <td className="p-3.5 font-bold">{sale.customerName}</td>
                              <td className="p-3.5 font-mono text-slate-500">{sale.customerMobile}</td>
                              <td className="p-3.5">{sale.dealerName}</td>
                              <td className="p-3.5 font-mono text-slate-500">{sale.invoiceDate}</td>
                              <td className="p-3.5 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                  sale.status === 'Activated' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {sale.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CUSTOMERS SECTION (Unified inside Warranty or Legacy Direct) */}
              {((activeSection === 'warranty' && warrantySubTab === 'customers') || activeSection === 'customer_service') && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                      <input
                        type="text"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder="بحث باسم العميل، الهاتف، المحافظة، الرقم القومي..."
                        className="w-full h-11 pr-10 pl-3 border border-border-main bg-surface rounded-xl text-xs focus:border-blue-600 outline-none text-text-primary"
                      />
                      <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>

                    <button
                      type="button"
                      onClick={exportCustomersCSV}
                      className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto shadow-sm"
                    >
                      <FileSpreadsheet size={16} />
                      <span>تصدير سجل العملاء (CSV)</span>
                    </button>
                  </div>

                  <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 dark:bg-surface text-text-secondary font-bold border-b border-border-main">
                        <tr>
                          <th className="p-4 whitespace-nowrap">كود العميل (ID)</th>
                          <th className="p-4 whitespace-nowrap">اسم العميل الكامل</th>
                          <th className="p-4 whitespace-nowrap">رقم الهاتف الأساسي</th>
                          <th className="p-4 whitespace-nowrap">الهاتف البديل</th>
                          <th className="p-4 whitespace-nowrap">المنطقة والمحافظة</th>
                          <th className="p-4 whitespace-nowrap">العنوان التفصيلي</th>
                          <th className="p-4 whitespace-nowrap">الرقم القومي</th>
                          <th className="p-4 whitespace-nowrap text-center">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-border-main font-medium text-text-primary">
                        {filteredCustomers.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">
                              لا يوجد عملاء مسجلون حالياً يطابقون معايير البحث.
                            </td>
                          </tr>
                        ) : (
                          filteredCustomers.map((cust, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="p-4 font-mono font-bold text-blue-700 dark:text-blue-400">{cust.id}</td>
                              <td className="p-4 font-bold text-slate-900 dark:text-text-primary">{cust.name}</td>
                              <td className="p-4 font-mono font-semibold">{cust.mobileNumber}</td>
                              <td className="p-4 font-mono text-slate-500">{cust.alternativeNumber || '—'}</td>
                              <td className="p-4">
                                <span className="font-bold">{cust.governorate}</span>
                                <span className="text-slate-400 mx-1">/</span>
                                <span>{cust.city}</span>
                              </td>
                              <td className="p-4 max-w-xs truncate" title={cust.address}>{cust.address}</td>
                              <td className="p-4 font-mono text-slate-500">{cust.nationalId || '—'}</td>
                              <td className="p-4 text-center">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  نشط
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CERTIFICATE REGISTRY SECTION (Unified inside Warranty or Legacy Direct) */}
              {((activeSection === 'warranty' && warrantySubTab === 'registry') || activeSection === 'reports') && (
                <div className="space-y-5 animate-fade-in">
                  {/* Passport Quick Lookup Box */}
                  <div className="bg-slate-50 dark:bg-slate-900/70 border border-border-main p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={20} className="text-blue-600" />
                      <div>
                        <h4 className="font-extrabold text-xs text-[#0B2D5C] dark:text-blue-300">
                          استعلام جواز السفر الرقمي (Digital Passport Quick Access)
                        </h4>
                        <p className="text-[11px] text-slate-400">أدخل رقم السيريال أو رقم شهادة الضمان لفتح ملف الجواز الرقمي 360°</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        value={passportLookupInput}
                        onChange={(e) => setPassportLookupInput(e.target.value)}
                        placeholder="مثال: SLP-2026-000001..."
                        className="h-10 px-3 bg-surface border border-border-main rounded-xl text-xs font-mono font-bold outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!passportLookupInput.trim()) return;
                          setSelectedPassportSerial(passportLookupInput.trim().toUpperCase());
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-xs cursor-pointer"
                      >
                        فتح الجواز
                      </button>
                    </div>
                  </div>

                  {/* Certificate Registry Table */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="relative w-full sm:w-80">
                        <input
                          type="text"
                          value={registrySearch}
                          onChange={(e) => setRegistrySearch(e.target.value)}
                          placeholder="بحث برقم WAR، الرقم التسلسلي، أو العميل..."
                          className="w-full h-11 pr-10 pl-3 border border-border-main bg-surface rounded-xl text-xs focus:border-blue-600 outline-none text-text-primary"
                        />
                        <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>

                      <button
                        type="button"
                        onClick={exportRegistryCSV}
                        className="h-11 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto shadow-sm"
                      >
                        <FileSpreadsheet size={16} />
                        <span>تصدير مستودع الشهادات (CSV)</span>
                      </button>
                    </div>

                    <div className="border border-border-main rounded-2xl overflow-hidden overflow-x-auto bg-surface">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 dark:bg-surface text-text-secondary font-bold border-b border-border-main">
                          <tr>
                            <th className="p-4 whitespace-nowrap">رقم الشهادة WAR</th>
                            <th className="p-4 whitespace-nowrap">السيريال Serial</th>
                            <th className="p-4 whitespace-nowrap">اسم المنتج والموديل</th>
                            <th className="p-4 whitespace-nowrap">اسم العميل ورقم هاتفه</th>
                            <th className="p-4 whitespace-nowrap">تاريخ انتهاء الضمان</th>
                            <th className="p-4 whitespace-nowrap text-center">الحالة</th>
                            <th className="p-4 whitespace-nowrap text-center">الجواز الرقمي</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-border-main font-medium text-text-primary">
                          {filteredCerts.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-slate-400 font-bold">
                                لا توجد شهادات ضمان مسجلة تطابق معايير البحث.
                              </td>
                            </tr>
                          ) : (
                            filteredCerts.map((c, idx) => {
                              const p = products.find(prod => prod.id === c.productId);
                              return (
                                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                  <td className="p-4 font-mono font-bold text-blue-700 dark:text-blue-400">
                                    {c.warrantyNumber}
                                  </td>
                                  <td className="p-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                                    {c.serialNumber}
                                  </td>
                                  <td className="p-4 font-bold">{p ? p.modelName : '—'}</td>
                                  <td className="p-4">
                                    {c.customerName ? (
                                      <div>
                                        <div className="font-bold">{c.customerName}</div>
                                        <div className="text-[10px] text-slate-400">{c.customerPhone}</div>
                                      </div>
                                    ) : (
                                      <span className="text-slate-400 text-[11px]">بانتظار تفعيل العميل</span>
                                    )}
                                  </td>
                                  <td className="p-4 font-mono text-slate-500">{c.expiryDate}</td>
                                  <td className="p-4 text-center">
                                    {c.status === 'active' ? (
                                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                        ضمان مفعل
                                      </span>
                                    ) : (
                                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                                        بانتظار التفعيل
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-4 text-center">
                                    <button
                                      onClick={() => setSelectedPassportSerial(c.serialNumber)}
                                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 rounded-lg text-[10px] font-bold cursor-pointer transition-all border border-blue-200"
                                    >
                                      عرض الجواز
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* Digital Passport Modal */}
      {selectedPassportSerial && (
        <ProductDigitalPassportModal
          serialNumberOrCode={selectedPassportSerial}
          onClose={() => setSelectedPassportSerial(null)}
        />
      )}

    </div>
  );
};
