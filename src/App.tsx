import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WarrantyVerificationPortal } from './pages/WarrantyVerificationPortal';
import { WarrantyActivePage } from './pages/WarrantyActivePage';
import { WarrantyExpiredPage } from './pages/WarrantyExpiredPage';
import { ProductNotFoundPage } from './pages/ProductNotFoundPage';
import { WarrantyActivationPage } from './pages/WarrantyActivationPage';
import { CustomerServiceModal } from './components/CustomerServiceModal';
import { WarrantyPolicyModal } from './components/WarrantyPolicyModal';
import { TermsOfUseModal } from './components/TermsOfUseModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AccessibilityStatementModal } from './components/AccessibilityStatementModal';
import { EnterpriseSearchOverlay } from './components/EnterpriseSearchOverlay';
import { AdminPage } from './pages/AdminPage';
import { QRScannerModal } from './components/QRScannerModal';
import { SignLanguageWidget } from './components/SignLanguageWidget';
import { LogoConcept } from './components/logos/SleepeeConceptLogos';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { WarrantyProduct } from './types/warranty';
import { Language, t } from './utils/i18n';
import { AccessibilityProvider, useAccessibility } from './context/AccessibilityProvider';
import { ErpDatabase } from './utils/erpDb';
import { setI18nLanguage } from './i18n';

type CurrentView = 'portal' | 'active' | 'expired' | 'not_found' | 'activation' | 'admin';

interface AppContentProps {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
}

function AppContent({ language, setLanguage }: AppContentProps) {
  const [products, setProducts] = useState<WarrantyProduct[]>(() => [
    ...ErpDatabase.getWarrantyProductsMapped(),
    ...INITIAL_PRODUCTS
  ]);
  const [currentView, setCurrentView] = useState<CurrentView>('portal');
  const [activeProduct, setActiveProduct] = useState<WarrantyProduct | null>(null);
  const [searchedQuery, setSearchedQuery] = useState<string>('');
  const [restrictedReason, setRestrictedReason] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { announce, announcePageTitle, speakText } = useAccessibility();

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
    announce(
      nextLang === 'ar' ? 'تم التبديل إلى اللغة العربية' : 'Switched to English language',
      false,
      nextLang
    );
  };

  useEffect(() => {
    setI18nLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('sleepee_language', language);
    } catch {
      // Ignore storage error
    }
    document.title = language === 'ar' ? 'منظومة إدارة وتشغيل الضمان الإلكتروني' : 'Sleepee Enterprise Platform';
  }, [language]);



  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sleepee_theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try {
      localStorage.setItem('sleepee_theme', darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage error
    }
  }, [darkMode]);

  // Modals state
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [qrScannerMode, setQrScannerMode] = useState<'camera' | 'upload'>('camera');

  // Modal open handlers with speech feedback
  const handleOpenAccessibility = () => {
    setIsAccessibilityOpen(true);
    announce(
      language === 'ar'
        ? 'تم فتح مركز أدوات إمكانية الوصول والتيسير الرقمي'
        : 'Opened Accessibility Control Center',
      false,
      language
    );
  };

  const handleOpenCustomerService = () => {
    setIsCustomerServiceOpen(true);
    announce(
      language === 'ar'
        ? 'تم فتح نافذة خدمة العملاء والمساعدة الفنية'
        : 'Opened Customer Service Support dialog',
      false,
      language
    );
  };

  const handleOpenPolicy = () => {
    setIsPolicyOpen(true);
    announce(
      language === 'ar'
        ? 'تم فتح وثيقة سياسة الضمان الرسمية'
        : 'Opened Official Warranty Policy Document',
      false,
      language
    );
  };

  const handleOpenTerms = () => {
    setIsTermsOpen(true);
    announce(
      language === 'ar'
        ? 'تم فتح وثيقة شروط الاستخدام'
        : 'Opened Terms of Use Document',
      false,
      language
    );
  };

  const handleOpenPrivacy = () => {
    setIsPrivacyOpen(true);
    announce(
      language === 'ar'
        ? 'تم فتح وثيقة سياسة الخصوصية وحماية البيانات'
        : 'Opened Privacy and Data Protection Policy',
      false,
      language
    );
  };

  const [adminSection, setAdminSection] = useState<string>('admin_system');
  const [adminSubTab, setAdminSubTab] = useState<string>('audit_monitoring');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState<boolean>(false);

  const handleOpenAdmin = (section: string = 'admin_system', tab: string = 'audit_monitoring') => {
    setAdminSection(section);
    setAdminSubTab(tab);
    setCurrentView('admin');
    announce(
      language === 'ar'
        ? 'تم الانتقال إلى مركز إدارة وتشغيل الضمان الإلكتروني'
        : 'Navigated to Warranty Operations Admin Center',
      false,
      language
    );
  };

  // Selected Logo Concept
  const [selectedLogoConcept, setSelectedLogoConcept] = useState<LogoConcept>(() => {
    try {
      const saved = localStorage.getItem('sleepee_logo_concept') as LogoConcept;
      if (saved && (saved === 'conceptA' || saved === 'conceptB' || saved === 'conceptC')) {
        return saved;
      }
    } catch {
      // Ignore storage error
    }
    return 'official';
  });

  const handleSelectLogoConcept = (concept: LogoConcept) => {
    setSelectedLogoConcept(concept);
    try {
      localStorage.setItem('sleepee_logo_concept', concept);
    } catch {
      // Ignore storage error
    }
  };

  // Search by Serial Number Handler
  const handleSearchSerial = (query: string) => {
    setIsLoading(true);
    setSearchedQuery(query);

    setTimeout(() => {
      setIsLoading(false);
      const cleanQuery = query.trim().toUpperCase();

      if (cleanQuery === 'BLACK' || cleanQuery.includes('BLACK') || cleanQuery === 'SLP-2026-BLACK01') {
        setRestrictedReason(t('restrictedBlacklistMsg', language));
        setActiveProduct(null);
        setCurrentView('not_found');
        return;
      }

      if (cleanQuery === 'REVOKE' || cleanQuery.includes('REV') || cleanQuery === 'SLP-2026-REV001') {
        setRestrictedReason(t('restrictedRevokeMsg', language));
        setActiveProduct(null);
        setCurrentView('not_found');
        return;
      }

      // Read from live DB plus initial static ones
      const allProducts = [...ErpDatabase.getWarrantyProductsMapped(), ...INITIAL_PRODUCTS];

      const found = allProducts.find(
        (p) =>
          p.serialNumber.toUpperCase() === cleanQuery ||
          p.qrCodeId.toUpperCase() === cleanQuery ||
          (p.warrantyNumber && p.warrantyNumber.toUpperCase() === cleanQuery)
      );

      setRestrictedReason(undefined);
      if (!found) {
        setActiveProduct(null);
        setCurrentView('not_found');
      } else {
        setActiveProduct(found);
        if (found.status === 'expired') {
          setCurrentView('expired');
        } else if (found.status === 'unactivated') {
          setCurrentView('activation');
        } else {
          setCurrentView('active');
        }
      }
    }, 400);
  };

  // Search by Customer Phone/Name Handler
  const handleSearchCustomer = (name: string, phone: string) => {
    setIsLoading(true);
    setSearchedQuery(`${name} - ${phone}`);

    setTimeout(() => {
      setIsLoading(false);
      const cleanPhone = phone.trim();
      const cleanName = name.trim().toLowerCase();

      // Read from live DB plus initial static ones
      const allProducts = [...ErpDatabase.getWarrantyProductsMapped(), ...INITIAL_PRODUCTS];

      const found = allProducts.find((p) => {
        const phoneMatch = cleanPhone && p.customerPhone && p.customerPhone.includes(cleanPhone);
        const nameMatch = cleanName && p.customerName && p.customerName.toLowerCase().includes(cleanName);
        return phoneMatch || nameMatch;
      });

      setRestrictedReason(undefined);
      if (!found) {
        setActiveProduct(null);
        setCurrentView('not_found');
      } else {
        setActiveProduct(found);
        if (found.status === 'expired') {
          setCurrentView('expired');
        } else if (found.status === 'unactivated') {
          setCurrentView('activation');
        } else {
          setCurrentView('active');
        }
      }
    }, 400);
  };


  // Open QR Scanner
  const handleOpenQRScanner = (mode: 'camera' | 'upload') => {
    setQrScannerMode(mode);
    setIsQRScannerOpen(true);
    announce(
      language === 'ar'
        ? mode === 'camera'
          ? 'تم فتح ماسح كود QR بالكاميرا'
          : 'تم فتح نافذة رفع صورة كود QR'
        : mode === 'camera'
        ? 'Opened QR camera scanner'
        : 'Opened QR image upload dialog',
      false,
      language
    );
  };

  // Handle successful QR scan or file decode
  const handleScanSuccess = (code: string) => {
    setIsQRScannerOpen(false);
    handleSearchSerial(code);
  };

  // Quick Action 1: Warranty Activation
  const handleActivateWarrantyClick = () => {
    const pendingProduct = products.find((p) => p.status === 'unactivated') || {
      serialNumber: 'SLP-2026-PENDING',
      qrCodeId: 'QR-SLP-2026-PENDING',
      brand: 'Sleepee',
      modelName: 'مرتبة سليبي الممتازة',
      dimensions: '200 × 180 سم',
      productionDate: '10 - 01 - 2026',
      warrantyPeriod: '10 سنوات',
      status: 'unactivated',
      timeline: [
        { title: 'التصنيع', date: '10 - 01 - 2026', completed: true },
        { title: 'الجودة', date: '12 - 01 - 2026', completed: true },
        { title: 'التعبئة', date: '14 - 01 - 2026', completed: true },
        { title: 'الشحن', date: '16 - 01 - 2026', completed: true },
        { title: 'البيع', date: '18 - 01 - 2026', completed: true },
        { title: 'تفعيل الضمان', statusText: 'لم يتم التفعيل', completed: false, isWarning: true },
      ],
    };
    setActiveProduct(pendingProduct);
    setCurrentView('activation');
    announce(
      language === 'ar' ? 'تم الانتقال إلى صفحة تفعيل الضمان' : 'Navigated to warranty activation page',
      false,
      language
    );
  };

  // Warranty Activation Form completion
  const handleActivationComplete = (updatedProduct: WarrantyProduct) => {
    // 1. Create or link the central customer record
    const customer = ErpDatabase.addOrUpdateCustomer({
      name: updatedProduct.customerName || '',
      mobileNumber: updatedProduct.customerPhone || '',
      alternativeNumber: updatedProduct.alternativePhone,
      governorate: updatedProduct.governorate || '',
      city: updatedProduct.city || '',
      address: updatedProduct.address || '',
      nationalId: updatedProduct.nationalId,
    });

    // Assign customerId to updated product
    const finalProduct = {
      ...updatedProduct,
      customerId: customer.id
    };

    // 2. Persist in ErpDatabase
    const certs = ErpDatabase.getWarrantyCertificates();
    const matchesErpCert = certs.find(c => c.serialNumber === finalProduct.serialNumber);
    if (matchesErpCert) {
      const updatedCerts = certs.map(c => 
        c.serialNumber === finalProduct.serialNumber 
          ? { 
              ...c, 
              status: 'active' as const, 
              customerId: customer.id,
              customerName: finalProduct.customerName, 
              customerPhone: finalProduct.customerPhone,
              activationDate: new Date().toISOString().split('T')[0]
            } 
          : c
      );
      ErpDatabase.saveWarrantyCertificates(updatedCerts);
      ErpDatabase.addAuditLog('Warranty Activation', `تم تفعيل شهادة الضمان ${finalProduct.warrantyNumber} وربطها بالعميل ${finalProduct.customerName} (كود العميل: ${customer.id})`);
    }

    setProducts((prev) => [
      ...ErpDatabase.getWarrantyProductsMapped(),
      ...INITIAL_PRODUCTS
    ]);
    
    setActiveProduct(finalProduct);
    setCurrentView('active');
    announce(
      language === 'ar'
        ? `تم تفعيل الضمان بنجاح للمنتج ${updatedProduct.modelName}`
        : `Warranty successfully activated for ${updatedProduct.modelName}`,
      true,
      language
    );
  };


  // Return to Search Portal
  const handleNewSearch = () => {
    setActiveProduct(null);
    setSearchedQuery('');
    setCurrentView('portal');
    announcePageTitle(language);
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
      className="min-h-screen flex flex-col font-sans transition-colors duration-200 bg-surface text-text-primary"
    >
      {/* Skip to Main Content Link for Screen Readers & Keyboard Users (WCAG 2.1 AA) */}
      <a href="#main-content" className="skip-link">
        {t('skipToContent', language)}
      </a>

      {/* 1. PUBLIC LOCKED HEADER */}
      <Header
        onAccessibilityClick={handleOpenAccessibility}
        onAdminClick={handleOpenAdmin}
        onHomeClick={handleNewSearch}
        onGlobalSearchClick={() => setIsGlobalSearchOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        logoConcept={selectedLogoConcept}
        activeSection={adminSection}
        onSelectSection={(sec, tab) => handleOpenAdmin(sec, tab)}
      />

      {/* 2. MAIN WORKSPACE / ROUTED PAGES */}
      <main id="main-content" role="main" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
        {/* Screen Reader Page Heading */}
        <h1 className="sr-only">
          {language === 'ar' ? 'منصة التحقق من الضمان سليبي' : 'Sleepee Warranty Verification Platform'}
        </h1>

        {currentView === 'portal' && (
          <WarrantyVerificationPortal
            onSearchSerial={handleSearchSerial}
            onSearchCustomer={handleSearchCustomer}
            onOpenQRScanner={handleOpenQRScanner}
            onActivateWarrantyClick={handleActivateWarrantyClick}
            onContactSupportClick={handleOpenCustomerService}
            onViewPolicyClick={handleOpenPolicy}
            isLoading={isLoading}
            language={language}
          />
        )}

        {currentView === 'active' && activeProduct && (
          <WarrantyActivePage
            product={activeProduct}
            onNewSearch={handleNewSearch}
            onSearchSerial={handleSearchSerial}
            language={language}
          />
        )}

        {currentView === 'expired' && activeProduct && (
          <WarrantyExpiredPage
            product={activeProduct}
            onNewSearch={handleNewSearch}
            onRequestMaintenance={handleOpenCustomerService}
            onSearchSerial={handleSearchSerial}
            language={language}
          />
        )}

        {currentView === 'not_found' && (
          <ProductNotFoundPage
            searchedQuery={searchedQuery}
            onNewSearch={handleNewSearch}
            onContactSupport={handleOpenCustomerService}
            restrictedReason={restrictedReason}
            language={language}
          />
        )}

        {currentView === 'activation' && activeProduct && (
          <WarrantyActivationPage
            product={activeProduct}
            onNewSearch={handleNewSearch}
            onActivationSuccess={handleActivationComplete}
            onSearchSerial={handleSearchSerial}
            language={language}
            onViewExistingCertificate={(prod) => {
              setActiveProduct(prod);
              setCurrentView('active');
            }}
          />
        )}

        {currentView === 'admin' && (
          <AdminPage
            onBack={handleNewSearch}
            language={language}
            activeSection={adminSection}
            activeSubTab={adminSubTab}
          />
        )}
      </main>

      {/* 3. LOCKED SINGLE-LINE FOOTER WITH 3 DISTINCT LEGAL MODALS */}
      <Footer
        onPolicyClick={handleOpenPolicy}
        onTermsClick={handleOpenTerms}
        onPrivacyClick={handleOpenPrivacy}
        onAdminClick={() => handleOpenAdmin('admin_system', 'audit_monitoring')}
        language={language}
      />

      {/* 4. MODALS & OVERLAYS */}
      <EnterpriseSearchOverlay
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        language={language}
        onNavigate={(sec, tab) => {
          handleOpenAdmin(sec, tab);
        }}
      />
      <CustomerServiceModal
        isOpen={isCustomerServiceOpen}
        onClose={() => setIsCustomerServiceOpen(false)}
        language={language}
      />

      {/* 1. Dedicated Warranty Policy Modal */}
      <WarrantyPolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        language={language}
      />

      {/* 2. Dedicated Terms of Use Modal */}
      <TermsOfUseModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        language={language}
      />

      {/* 3. Dedicated Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        language={language}
      />

      <AccessibilityStatementModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
        language={language}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <QRScannerModal
        isOpen={isQRScannerOpen}
        initialMode={qrScannerMode}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Floating Sign Language Assistant Overlay */}
      <SignLanguageWidget language={language} />

    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sleepee_language') as Language;
      if (saved && (saved === 'ar' || saved === 'en')) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return 'ar'; // Strictly default to Arabic
  });

  return (
    <AccessibilityProvider language={language}>
      <AppContent language={language} setLanguage={setLanguage} />
    </AccessibilityProvider>
  );
}
