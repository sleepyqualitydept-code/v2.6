import React, { useState } from 'react';
import { 
  Building2, Globe, Clock, User, CheckCircle2, Save, Key, ShieldCheck, 
  Upload, Mail, Phone, ExternalLink 
} from 'lucide-react';
import { ErpDatabase } from '../../utils/erpDb';
import { EnterpriseSettings } from '../../types/erp';

export const GeneralSettingsView: React.FC = () => {
  const [settings, setSettings] = useState<EnterpriseSettings>(() => ErpDatabase.getEnterpriseSettings());
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [companyNameAr, setCompanyNameAr] = useState(settings.companyNameAr);
  const [companyNameEn, setCompanyNameEn] = useState(settings.companyNameEn);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [website, setWebsite] = useState(settings.website);
  const [defaultLanguage, setDefaultLanguage] = useState<'ar' | 'en'>(settings.defaultLanguage);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);

  // Profile form
  const [fullName, setFullName] = useState(settings.userProfile.fullName);
  const [title, setTitle] = useState(settings.userProfile.title);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EnterpriseSettings = {
      companyNameAr,
      companyNameEn,
      email,
      phone,
      website,
      defaultLanguage,
      timezone,
      dateFormat,
      userProfile: {
        fullName,
        title
      }
    };
    ErpDatabase.saveEnterpriseSettings(updated);
    setSettings(updated);
    showToast('تم حفظ وتحديث الإعدادات العامة وبيانات المؤسسة بنجاح');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      alert('يرجى إدخال كلمة المرور الحالية');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('كلمة المرور الجديدة غير متطابقة مع التأكيد');
      return;
    }
    ErpDatabase.addAuditLog('Security', 'تم تغيير كلمة المرور لحساب المدير التنفيذي');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('تم تحديث كلمة المرور للحساب بنجاح');
  };

  return (
    <div className="space-y-6 animate-fade-in text-right">
      {/* Toast */}
      {toast && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* 1. بيانات المؤسسة (Organization Info) */}
        <div className="p-5 bg-surface border border-border-main rounded-2xl space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-border-main pb-2">
            <Building2 size={18} className="text-blue-600" />
            <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300">
              بيانات المؤسسة والهوية الرسمية (Organization Parameters)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold block text-slate-700 dark:text-slate-300">اسم المؤسسة (باللغة العربية)</label>
              <input
                type="text"
                required
                value={companyNameAr}
                onChange={(e) => setCompanyNameAr(e.target.value)}
                className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none focus:border-blue-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold block text-slate-700 dark:text-slate-300">اسم المؤسسة (English)</label>
              <input
                type="text"
                required
                value={companyNameEn}
                onChange={(e) => setCompanyNameEn(e.target.value)}
                className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none focus:border-blue-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold block text-slate-700 dark:text-slate-300">البريد الإلكتروني الرسمي</label>
              <div className="relative">
                <Mail size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 pr-9 pl-3 bg-surface border border-border-main rounded-xl outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold block text-slate-700 dark:text-slate-300">رقم الهاتف والخط الساخن</label>
              <div className="relative">
                <Phone size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 pr-9 pl-3 bg-surface border border-border-main rounded-xl outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="font-bold block text-slate-700 dark:text-slate-300">الموقع الإلكتروني الرسمي</label>
              <div className="relative">
                <ExternalLink size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full h-10 pr-9 pl-3 bg-surface border border-border-main rounded-xl outline-none focus:border-blue-600 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. إعدادات اللغة والوقت (Language & Time Settings) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* إعدادات اللغة */}
          <div className="p-5 bg-surface border border-border-main rounded-2xl space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-border-main pb-2">
              <Globe size={18} className="text-blue-600" />
              <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300">
                إعدادات اللغة الافتراضية (Language Preference)
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main cursor-pointer">
                <input
                  type="radio"
                  name="lang"
                  checked={defaultLanguage === 'ar'}
                  onChange={() => setDefaultLanguage('ar')}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-bold">اللغة العربية (Arabic)</div>
                  <div className="text-[11px] text-slate-400">واجهة مستخدم باللغة العربية مع دعم كامل لاتجاه RTL</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border-main cursor-pointer">
                <input
                  type="radio"
                  name="lang"
                  checked={defaultLanguage === 'en'}
                  onChange={() => setDefaultLanguage('en')}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="font-bold">English (الإنجليزية)</div>
                  <div className="text-[11px] text-slate-400">Default English interface with standard LTR layout</div>
                </div>
              </label>
            </div>
          </div>

          {/* إعدادات الوقت والتاريخ */}
          <div className="p-5 bg-surface border border-border-main rounded-2xl space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-border-main pb-2">
              <Clock size={18} className="text-blue-600" />
              <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300">
                إعدادات الوقت والتقويم (Time & Date Formats)
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold block">المنطقة الزمنية (Timezone)</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl font-bold font-mono outline-none"
                >
                  <option value="Africa/Cairo (UTC+02:00)">Africa/Cairo (UTC+02:00) - القاهرة</option>
                  <option value="Asia/Riyadh (UTC+03:00)">Asia/Riyadh (UTC+03:00) - الرياض</option>
                  <option value="Asia/Dubai (UTC+04:00)">Asia/Dubai (UTC+04:00) - دبي</option>
                  <option value="UTC">UTC (Universal Coordinated Time)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold block">صيغة عرض التاريخ (Date Format)</label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                  className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl font-bold font-mono outline-none"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (مثال: 28/09/2026)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (مثال: 2026-09-28)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* 3. إعدادات الحساب والملف الشخصي (Account Settings) */}
        <div className="p-5 bg-surface border border-border-main rounded-2xl space-y-4 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-border-main pb-2">
            <User size={18} className="text-blue-600" />
            <h4 className="font-extrabold text-sm text-[#0B2D5C] dark:text-blue-300">
              إعدادات حساب المدير والملف الشخصي (Admin Profile)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold block text-slate-700 dark:text-slate-300">اسم المستخدم التنفيذي</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none focus:border-blue-600 font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold block text-slate-700 dark:text-slate-300">المسمى الوظيفي والمسؤولية</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none focus:border-blue-600 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all flex items-center gap-2"
          >
            <Save size={15} />
            <span>حفظ وتحديث الإعدادات العامة</span>
          </button>
        </div>
      </form>

      {/* 4. تغيير كلمة المرور (Security Box) */}
      <div className="p-5 bg-surface border border-border-main rounded-2xl space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-border-main pb-2">
          <Key size={18} className="text-amber-600" />
          <h4 className="font-extrabold text-sm text-text-primary">
            تغيير كلمة مرور حساب الإدارة (Security & Authentication)
          </h4>
        </div>

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold block text-slate-500">كلمة المرور الحالية</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold block text-slate-500">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold block text-slate-500">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 bg-surface border border-border-main rounded-xl outline-none"
            />
          </div>

          <div className="md:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <ShieldCheck size={14} />
              <span>تأكيد تغيير كلمة المرور</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
