import React, { useRef } from 'react';
import { X, Printer, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { WarrantyProduct } from '../types/warranty';
import { getWarrantyNumber } from '../utils/masking';
import { exportWarrantyCertificateToPDF } from '../utils/pdfExporter';

interface PrintCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: WarrantyProduct;
}

export const PrintCertificateModal: React.FC<PrintCertificateModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const printFrameRef = useRef<HTMLIFrameElement | null>(null);

  if (!isOpen) return null;

  const warNumber = getWarrantyNumber(product);
  const serialNumber = product.serialNumber;
  const qrUrl =
    product.qrVerificationUrl ||
    (warNumber !== 'غير متوفر'
      ? `https://sleepee.com/warranty/${encodeURIComponent(warNumber)}`
      : `https://sleepee.com/warranty/${encodeURIComponent(serialNumber)}`);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}`;

  const issueDate = product.purchaseDate || product.warrantyStartDate || '18 - 01 - 2026';
  const startDate = product.warrantyStartDate || product.purchaseDate || '18 - 01 - 2026';
  const endDate = product.warrantyEndDate || '18 - 01 - 2036';

  const handleTriggerPrint = () => {
    try {
      const popup = window.open('', '_blank', 'width=900,height=1200');
      if (popup) {
        popup.document.write(`
          <!DOCTYPE html>
          <html lang="ar" dir="rtl">
            <head>
              <meta charset="UTF-8" />
              <title>شهادة_ضمان_${warNumber !== 'غير متوفر' ? warNumber : serialNumber}</title>
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
              <style>
                @page { size: A4 portrait; margin: 10mm; }
                body { font-family: 'Cairo', 'IBM Plex Sans Arabic', sans-serif; direction: rtl; background: #fff; color: #0f172a; margin: 0; padding: 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .cert-box { border: 5px double #0B2D5C; padding: 25px; border-radius: 12px; }
                .flex-between { display: flex; justify-content: space-between; align-items: center; }
                .table-grid { width: 100%; border-collapse: collapse; margin-top: 10px; }
                .table-grid td, .table-grid th { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 11px; }
                @media print {
                  .no-print { display: none !important; }
                }
              </style>
            </head>
            <body>
              <div class="no-print" style="margin-bottom: 20px; text-align: left;">
                <button onclick="window.print()" style="padding: 10px 20px; background: #0066ff; color: white; font-weight: bold; border: none; border-radius: 8px; cursor: pointer;">
                  طباعة المستند الآن
                </button>
              </div>
              <div class="cert-box">
                <div class="flex-between" style="border-bottom: 2px solid #0B2D5C; padding-bottom: 12px;">
                  <div>
                    <h1 style="font-size:24px; color:#0B2D5C; margin:0;">سليبي · SLEEPEE</h1>
                    <p style="font-size:12px; color:#334155; margin:2px 0 0 0;">الشركة العربية لصناعة مراتب السوست والإسفنج</p>
                  </div>
                  <img src="${qrApiUrl}" style="width:70px; height:70px;" />
                </div>
                <h2 style="text-align:center; color:#0B2D5C; margin:15px 0 5px 0;">شهادة الضمان الإلكترونية المعتمدة</h2>
                <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:12px; border-radius:8px; margin:15px 0; display:flex; justify-content:space-around;">
                  <div><b>رقم الشهادة WAR:</b> <span style="color:#0066ff; font-family:monospace; font-size:16px;">${warNumber}</span></div>
                  <div><b>الرقم التسلسلي S/N:</b> <span style="font-family:monospace;">${serialNumber}</span></div>
                </div>
                <table class="table-grid">
                  <tr><th colspan="2" style="background:#0B2D5C; color:white;">بيانات التوثيق والمنتج</th></tr>
                  <tr><td><b>اسم المنتج:</b> مراتب سليبي الأصلية</td><td><b>الموديل:</b> ${product.modelName}</td></tr>
                  <tr><td><b>المقاس:</b> ${product.dimensions}</td><td><b>تاريخ الشراء:</b> ${issueDate}</td></tr>
                  <tr><td><b>اسم العميل:</b> ${product.customerName || 'أحمد محمد علي'}</td><td><b>مدة الضمان:</b> ${product.warrantyPeriod || '10 سنوات'}</td></tr>
                </table>
              </div>
            </body>
          </html>
        `);
        popup.document.close();
        popup.focus();
        setTimeout(() => {
          try {
            popup.print();
          } catch (e) {
            console.warn('Popup print auto-trigger blocked', e);
          }
        }, 300);
        return;
      }
    } catch (e) {
      console.warn('Popup window error, falling back to frame:', e);
    }

    // Fallback: trigger print via internal iframe or notify
    alert('إذا لم تفتح نافذة الطباعة التلقائية، يمكنك حفظ الشهادة بصيغة PDF عبر زر "تحميل الشهادة".');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs text-right font-sans dir-rtl">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] z-[10000]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Printer size={20} className="text-[#0B2D5C]" />
            <div>
              <span className="font-extrabold text-[#0B2D5C] text-sm block">نافذة طباعة الشهادة الرسمية</span>
              <span className="text-[10px] text-slate-500 font-mono">WAR Certificate Print Preview</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Document Preview */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-center justify-between">
            <div>
              <p className="font-extrabold text-[#0B2D5C] text-sm">شهادة جاهزة للطباعة</p>
              <p className="text-slate-600 text-xs mt-0.5">
                رقم الشهادة: <span className="font-mono font-bold text-blue-700">{warNumber}</span> | السيريال: <span className="font-mono font-bold text-slate-800">{serialNumber}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTriggerPrint}
                className="px-4 py-2 bg-[#0066ff] hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 transition-all"
              >
                <Printer size={15} />
                <span>فتح نافذة الطباعة</span>
              </button>
            </div>
          </div>

          {/* Certificate Quick Summary Box */}
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50/50 space-y-3">
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">اسم المنتج:</span>
              <span className="font-bold text-slate-900">مراتب سليبي الأصلية</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">الموديل والمقاس:</span>
              <span className="font-semibold text-slate-800">{product.modelName} ({product.dimensions})</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold">بيانات العميل:</span>
              <span className="font-semibold text-slate-800">{product.customerName || 'أحمد محمد علي'} ({product.customerPhone || '01012345678'})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">تاريخ التوثيق والانتهاء:</span>
              <span className="font-mono text-slate-800">{issueDate} إلى {endDate}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <span>
              في حالة قيود المتصفح أو حظر النوافذ المنبثقة، اضغط "فتح نافذة الطباعة" أو استخدم زر "تحميل الشهادة" لتنزيل ملف PDF رسمي بدقة عالية.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => exportWarrantyCertificateToPDF(product)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>تحميل PDF بدلاً من الطباعة</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
