import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Award, RefreshCw, AlertOctagon, Archive } from 'lucide-react';
import { WarrantyProduct } from '../types/warranty';
import { getWarrantyNumber } from '../utils/masking';

interface PrintableCertificateProps {
  product: WarrantyProduct;
}

export const PrintableCertificate: React.FC<PrintableCertificateProps> = ({ product }) => {
  const warNumber = getWarrantyNumber(product);
  const serialNumber = product.serialNumber;
  
  const qrUrl =
    product.qrVerificationUrl ||
    (warNumber !== 'غير متوفر'
      ? `https://sleepee.com/warranty/${encodeURIComponent(warNumber)}`
      : `https://sleepee.com/warranty/${encodeURIComponent(serialNumber)}`);
      
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    qrUrl
  )}`;

  const status = product.status || 'active';

  const renderStatusBadge = () => {
    switch (status) {
      case 'active':
        return (
          <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-emerald-50 text-emerald-800 border-2 border-emerald-500 rounded-full font-black text-sm shadow-2xs">
            <CheckCircle2 size={18} className="text-emerald-600" />
            <span>ساري ومفعل</span>
          </div>
        );
      case 'expired':
        return (
          <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-rose-50 text-rose-800 border-2 border-rose-500 rounded-full font-black text-sm shadow-2xs">
            <XCircle size={18} className="text-rose-600" />
            <span>انتهت فترة الضمان</span>
          </div>
        );
      case 'replaced':
        return (
          <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-blue-50 text-blue-800 border-2 border-blue-500 rounded-full font-black text-sm shadow-2xs">
            <RefreshCw size={18} className="text-blue-600" />
            <span>تم الاستبدال</span>
          </div>
        );
      case 'revoked':
      case 'cancelled':
      case 'void':
        return (
          <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-slate-100 text-slate-800 border-2 border-slate-500 rounded-full font-black text-sm shadow-2xs">
            <AlertOctagon size={18} className="text-slate-600" />
            <span>تم إسقاط الضمان</span>
          </div>
        );
      case 'archived':
      case 'suspended':
        return (
          <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-indigo-50 text-indigo-800 border-2 border-indigo-400 rounded-full font-black text-sm shadow-2xs">
            <Archive size={18} className="text-indigo-600" />
            <span>مؤرشفة</span>
          </div>
        );
      case 'unactivated':
      default:
        return (
          <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-amber-50 text-amber-800 border-2 border-amber-500 rounded-full font-full text-sm shadow-2xs">
            <Clock size={18} className="text-amber-600" />
            <span>بانتظار التفعيل</span>
          </div>
        );
    }
  };

  const issueDate = product.purchaseDate || product.warrantyStartDate || '18 - 01 - 2026';
  const startDate = product.warrantyStartDate || product.purchaseDate || '18 - 01 - 2026';
  const endDate = product.warrantyEndDate || '18 - 01 - 2036';

  return (
    <div className="absolute -left-[9999px] top-0 w-[210mm] pointer-events-none z-[-9999] bg-white print:static print:left-auto print:w-full print:z-auto">
      {/* Official Institutional Document Frame */}
      <div id={`certificate-print-node-${serialNumber}`} className="relative w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-8 text-slate-900 font-sans border-[6px] border-double border-[#0B2D5C] dir-rtl overflow-hidden box-border">
        
        {/* Subtle Institutional Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.035]">
          <span className="text-[120px] font-black tracking-widest text-[#0B2D5C] -rotate-45 font-['Cairo'] uppercase">
            SLEEPEE
          </span>
        </div>

        {/* Content Container (Above Watermark) */}
        <div className="relative z-10 flex flex-col justify-between h-full min-h-[275mm]">
          
          <div>
            {/* HEADER */}
            <div className="flex items-start justify-between border-b-2 border-[#0B2D5C] pb-5 mb-5">
              {/* Brand Header */}
              <div>
                <h1 className="text-3xl font-black text-[#0B2D5C] font-['Cairo'] leading-tight tracking-tight">
                  SLEEPEE
                </h1>
                <p className="text-xs font-bold text-slate-700 mt-1">
                  الشركة العربية لصناعة مراتب السوست والإسفنج
                </p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  منظومة توثيق واعتماد الضمان الرقمي
                </p>
              </div>

              {/* QR Code Section (Top Left) */}
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-300 shadow-2xs">
                <img
                  src={qrApiUrl}
                  alt="QR Code Verification"
                  className="w-20 h-20 object-contain rounded"
                  crossOrigin="anonymous"
                />
                <div className="text-[9.5px] text-slate-700 space-y-0.5 max-w-[130px] leading-tight">
                  <p className="font-extrabold text-[#0B2D5C]">امسح للتحقق من أصالة الشهادة</p>
                  <p className="font-semibold text-slate-500 text-[8.5px]">Scan To Verify Authenticity</p>
                  <p className="text-[8px] font-mono text-slate-400 mt-1">WAR Verified Link</p>
                </div>
              </div>
            </div>

            {/* CERTIFICATE TITLE */}
            <div className="text-center my-4 space-y-1">
              <h2 className="text-2xl font-black text-[#0B2D5C] font-['Cairo'] tracking-wide">
                شهادة الضمان الإلكترونية المعتمدة
              </h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
                Certified Warranty Certificate
              </p>
            </div>

            {/* STATUS BADGE */}
            <div className="text-center my-3">
              {renderStatusBadge()}
            </div>

            {/* CERTIFICATE IDENTITY (WAR & SERIAL) */}
            <div className="bg-blue-50/60 border-2 border-blue-200 rounded-xl p-4 my-5 flex items-center justify-around text-center">
              <div>
                <span className="text-xs font-extrabold text-slate-600 block mb-1">رقم شهادة الضمان (WAR)</span>
                <span className="font-mono font-black text-2xl text-[#0066ff] tracking-wider bg-white px-4 py-1 rounded-lg border border-blue-300 shadow-2xs inline-block">
                  {warNumber}
                </span>
              </div>
              <div className="h-10 w-0.5 bg-blue-200/80"></div>
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">الرقم التسلسلي (S/N)</span>
                <span className="font-mono font-bold text-base text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-300 inline-block">
                  {serialNumber}
                </span>
              </div>
            </div>

            {/* WARRANTY DATES TABLE */}
            <div className="mb-5 border border-slate-300 rounded-lg overflow-hidden text-xs">
              <div className="bg-[#0B2D5C] text-white px-3 py-1.5 font-bold text-xs">
                تاريخ وبيانات التوثيق الرسمي
              </div>
              <table className="w-full text-right border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200 bg-slate-50/60">
                    <td className="p-2.5 font-bold text-slate-600 border-l border-slate-200 w-1/4">تاريخ إصدار الشهادة:</td>
                    <td className="p-2.5 font-mono font-bold text-slate-900 w-1/4">{issueDate}</td>
                    <td className="p-2.5 font-bold text-slate-600 border-l border-slate-200 w-1/4">مدة الضمان الرسمية:</td>
                    <td className="p-2.5 font-bold text-[#0066ff] w-1/4">{product.warrantyPeriod || '10 سنوات'}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold text-slate-600 border-l border-slate-200">بداية سريان الضمان:</td>
                    <td className="p-2.5 font-mono font-bold text-emerald-700">{startDate}</td>
                    <td className="p-2.5 font-bold text-slate-600 border-l border-slate-200">انتهاء صلاحية الضمان:</td>
                    <td className="p-2.5 font-mono font-bold text-[#0B2D5C]">{endDate}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* PRODUCT & CUSTOMER TABLES GRID */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              
              {/* Product Info Official Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-100 text-[#0B2D5C] px-3 py-1.5 font-extrabold text-xs border-b border-slate-300">
                  مواصفات وبيانات المنتج
                </div>
                <table className="w-full text-right border-collapse">
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 w-1/3 border-l border-slate-200">اسم المنتج:</td>
                      <td className="p-2 font-bold text-slate-900">مراتب سليبي الأصلية</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 border-l border-slate-200">الموديل:</td>
                      <td className="p-2 font-semibold text-slate-800">{product.modelName}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 border-l border-slate-200">الأبعاد والمقاس:</td>
                      <td className="p-2 font-mono text-slate-800">{product.dimensions}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 border-l border-slate-200">تاريخ الإنتاج:</td>
                      <td className="p-2 font-mono text-slate-800">{product.productionDate}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 border-l border-slate-200">الرقم التسلسلي:</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{serialNumber}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Customer Info Official Table */}
              <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-100 text-[#0B2D5C] px-3 py-1.5 font-extrabold text-xs border-b border-slate-300">
                  بيانات الفاتورة والعميل
                </div>
                <table className="w-full text-right border-collapse">
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 w-1/3 border-l border-slate-200">اسم العميل:</td>
                      <td className="p-2 font-bold text-slate-900">{product.customerName || 'أحمد محمد علي'}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 border-l border-slate-200">رقم الهاتف:</td>
                      <td className="p-2 font-mono text-slate-800">{product.customerPhone || '01012345678'}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 border-l border-slate-200">رقم الفاتورة:</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{product.invoiceNumber || 'INV-2026-00125'}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 border-l border-slate-200">المحافظة والمدينة:</td>
                      <td className="p-2 font-medium text-slate-800">{product.governorate || 'القاهرة'} - {product.city || 'مدينة نصر'}</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-slate-600 bg-slate-50/50 border-l border-slate-200">تاريخ الشراء:</td>
                      <td className="p-2 font-mono text-slate-800">{product.purchaseDate || '18 - 01 - 2026'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

            {/* WARRANTY TERMS ORDERED LIST */}
            <div className="mb-5 p-3.5 border border-slate-300 rounded-lg bg-slate-50/30">
              <h3 className="text-xs font-bold text-[#0B2D5C] border-b border-slate-200 pb-1.5 mb-2">
                الشروط والأحكام الرسمية للضمان (صادرة من المصنع)
              </h3>
              <ol className="list-decimal list-inside text-[10.5px] text-slate-700 space-y-1 font-medium leading-relaxed">
                <li>يشمل الضمان عيوب الصناعة في السوست والشاسيه والهيكل الداخلي الفولاذي.</li>
                <li>يبدأ سريان الضمان اعتباراً من تاريخ الشراء المدون بالفاتورة الرسمية المعتمدة.</li>
                <li>الضمان لا يغطي الأضرار الناتجة عن سوء الاستخدام أو البلل أو التمزق الخارجي للسطح.</li>
                <li>يجب استخدام المرتبة على ملة خشبية مستوية ومتقاربة وفق تعليمات التشغيل.</li>
                <li>لطلب الصيانة أو الدعم المباشر، التواصل عبر الخط الساخن الموحد (19707).</li>
              </ol>
            </div>

          </div>

          {/* FOOTER & INSTITUTIONAL SEAL */}
          <div className="pt-4 border-t-2 border-[#0B2D5C] flex items-center justify-between text-[10px] text-slate-600 mt-auto">
            <div>
              <p className="font-extrabold text-[#0B2D5C] text-xs">الشركة العربية لصناعة مراتب السوست والإسفنج</p>
              <p className="text-slate-600 font-semibold mt-0.5">الخط الساخن: 19707 · الموقع الرسمي: www.sleepee.com</p>
              <p className="text-slate-400 text-[9px] mt-0.5">إدارة الجودة والاعتماد الرقمي المعتمد</p>
            </div>

            <div className="flex items-center gap-5">
              <span className="font-mono text-[9px] text-slate-400 font-bold">Page 1 of 1</span>
              
              {/* Professional Circular Seal */}
              <div className="text-center">
                <div className="w-20 h-20 border-2 border-[#0B2D5C] rounded-full flex flex-col items-center justify-center p-1 text-[7.5px] font-black text-[#0B2D5C] bg-blue-50/90 uppercase text-center leading-tight shadow-2xs border-dashed">
                  <span className="text-[8px]">SLEEPEE</span>
                  <span className="text-[6.5px] font-bold text-blue-700 my-0.5">WARRANTY VERIFIED</span>
                  <span className="text-[6px] font-extrabold text-slate-700">QUALITY ASSURANCE</span>
                </div>
                <span className="font-extrabold text-[8.5px] text-[#0B2D5C] block mt-1">ختم الجودة والاعتماد</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
