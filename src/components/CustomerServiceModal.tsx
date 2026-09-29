import React, { useState } from 'react';
import { X, Phone, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Language, t } from '../utils/i18n';

interface CustomerServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
}

export const CustomerServiceModal: React.FC<CustomerServiceModalProps> = ({
  isOpen,
  onClose,
  language = 'ar',
}) => {
  const [ticketType, setTicketType] = useState<'inquiry' | 'complaint' | 'maintenance'>('inquiry');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serialOrInvoice, setSerialOrInvoice] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const isAr = language === 'ar';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName('');
    setPhoneNumber('');
    setSerialOrInvoice('');
    setMessage('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-service-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
    >
      <div className={`bg-surface rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-border-main animate-in fade-in zoom-in-95 duration-200 z-[10000] ${isAr ? 'text-right' : 'text-left'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b border-border-main bg-slate-50 dark:bg-surface-secondary/60 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className={`flex items-center gap-2.5 ${isAr ? 'flex-row' : 'flex-row-reverse text-left'}`}>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div>
              <h2 id="customer-service-title" className="text-base font-bold text-text-primary">
                {isAr ? 'خدمة عملاء سليبي' : 'Sleepee Customer Care'}
              </h2>
              <p className="text-xs text-text-secondary">
                {isAr ? 'نحن هنا للإجابة على استفساراتكم ومتابعة طلباتكم' : 'We are here to assist with inquiries and service requests'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق' : 'Close'}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-secondary dark:hover:bg-surface transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                {isAr ? 'تم استلام طلبكم بنجاح' : 'Request Received Successfully'}
              </h3>
              <p className="text-sm text-text-secondary max-w-sm mx-auto">
                {isAr ? 'رقم التذكرة:' : 'Ticket ID:'}{' '}
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  TK-{Math.floor(100000 + Math.random() * 900000)}
                </span>
                <br />
                {isAr
                  ? 'سيقوم فريق الدعم الفني وخدمة العملاء بالتواصل معكم عبر الهاتف خلال 24 ساعة عمل.'
                  : 'Our support team will contact you via phone within 24 business hours.'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Quick Contact Channels */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:19707"
                  className="flex items-center gap-3 p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300 flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                      {isAr ? 'الخط الساخن المباشر' : 'Direct Hotline'}
                    </div>
                    <div className="text-base font-black text-red-700 dark:text-red-300 tabular-nums">19707</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {isAr ? 'خدمة الواتساب' : 'WhatsApp Support'}
                    </div>
                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">01012345678</div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    {isAr ? 'نوع الطلب' : 'Request Type'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setTicketType('inquiry')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        ticketType === 'inquiry'
                          ? 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-700 dark:text-blue-300'
                          : 'border-border-main text-text-secondary'
                      }`}
                    >
                      {isAr ? 'استفسار عام' : 'Inquiry'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTicketType('maintenance')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        ticketType === 'maintenance'
                          ? 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-700 dark:text-blue-300'
                          : 'border-border-main text-text-secondary'
                      }`}
                    >
                      {isAr ? 'طلب صيانة' : 'Maintenance'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTicketType('complaint')}
                      className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        ticketType === 'complaint'
                          ? 'bg-blue-50 dark:bg-blue-950 border-blue-600 text-blue-700 dark:text-blue-300'
                          : 'border-border-main text-text-secondary'
                      }`}
                    >
                      {isAr ? 'شكوى أو مقترح' : 'Complaint'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    {t('customerName', language)} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isAr ? 'أدخل اسمك بالكامل' : 'Enter your full name'}
                    className="w-full h-10 px-3 bg-input-bg border border-input-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    {t('customerPhone', language)} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="01012345678"
                    className="w-full h-10 px-3 bg-input-bg border border-input-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all tabular-nums text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    {isAr ? 'الرقم التسلسلي أو رقم الفاتورة (إن وجد)' : 'Serial Number or Invoice (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={serialOrInvoice}
                    onChange={(e) => setSerialOrInvoice(e.target.value)}
                    placeholder="SLP-2026-XXXX أو INV-XXXX"
                    className="w-full h-10 px-3 bg-input-bg border border-input-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono tabular-nums text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    {isAr ? 'تفاصيل الاستفسار أو المشكلة' : 'Details of inquiry or issue'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isAr ? 'يرجى كتابة تفاصيل استفساركم لمساعدتكم بشكل أسرع...' : 'Please describe your request...'}
                    className="w-full p-3 bg-input-bg border border-input-border rounded-xl text-xs sm:text-sm font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-text-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Send size={16} />
                  <span>{isAr ? 'إرسال الطلب' : 'Submit Ticket'}</span>
                </button>
              </form>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
