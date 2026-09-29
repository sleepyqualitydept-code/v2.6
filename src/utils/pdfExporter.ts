import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { WarrantyProduct } from '../types/warranty';
import { getWarrantyNumber } from './masking';

/**
 * Preloads external images (like QR code API) and converts them to Data URLs
 * to ensure html2canvas captures them cleanly without CORS or network failure.
 */
async function convertImagesToDataUrls(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      if (!img.src || img.src.startsWith('data:')) return;
      try {
        const response = await fetch(img.src, { mode: 'cors' });
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        img.src = dataUrl;
      } catch (err) {
        console.warn('Could not convert image src to data URL, proceeding with original src:', img.src, err);
      }
    })
  );
}

/**
 * Generates an official Enterprise Sleepee Warranty Certificate PDF and triggers direct download.
 *
 * Filename format required: Warranty-Certificate-WAR-[WAR_NUMBER].pdf
 */
export async function exportWarrantyCertificateToPDF(product: WarrantyProduct): Promise<void> {
  const warNumber = getWarrantyNumber(product);
  const cleanWar = warNumber !== 'غير متوفر' ? warNumber : product.serialNumber;
  const fileName = `Warranty-Certificate-WAR-${cleanWar}.pdf`;

  // Wait for Google Fonts to be fully ready before rendering to canvas
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // Proceed if font API fails
    }
  }

  const tempContainer = document.createElement('div');
  tempContainer.id = `temp-pdf-export-${Date.now()}`;
  tempContainer.style.position = 'fixed';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.width = '794px'; // Exactly A4 width at 96 DPI
  tempContainer.style.backgroundColor = '#ffffff';
  tempContainer.style.zIndex = '-9999';
  tempContainer.style.direction = 'rtl';
  tempContainer.style.boxSizing = 'border-box';
  tempContainer.style.fontFamily = "'Cairo', 'IBM Plex Sans Arabic', 'Alexandria', 'Segoe UI', Tahoma, sans-serif";
  
  const qrUrl = product.qrVerificationUrl ||
    (warNumber !== 'غير متوفر'
      ? `https://sleepee.com/warranty/${encodeURIComponent(warNumber)}`
      : `https://sleepee.com/warranty/${encodeURIComponent(product.serialNumber)}`);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}`;

  const status = product.status || 'active';
  let statusBg = '#ecfdf5';
  let statusTextColor = '#065f46';
  let statusBorderColor = '#10b981';
  let statusText = '✔ ساري ومفعل';

  if (status === 'expired') {
    statusBg = '#fff1f2';
    statusTextColor = '#9f1239';
    statusBorderColor = '#f43f5e';
    statusText = '✖ انتهت فترة الضمان';
  } else if (status === 'replaced') {
    statusBg = '#eff6ff';
    statusTextColor = '#1e40af';
    statusBorderColor = '#3b82f6';
    statusText = '🔄 تم الاستبدال';
  } else if (status === 'revoked' || status === 'cancelled' || status === 'void') {
    statusBg = '#f1f5f9';
    statusTextColor = '#334155';
    statusBorderColor = '#64748b';
    statusText = '🚫 تم إسقاط الضمان';
  } else if (status === 'archived' || status === 'suspended') {
    statusBg = '#e0e7ff';
    statusTextColor = '#3730a3';
    statusBorderColor = '#6366f1';
    statusText = '📁 مؤرشفة';
  } else if (status === 'unactivated') {
    statusBg = '#fffbeb';
    statusTextColor = '#92400e';
    statusBorderColor = '#f59e0b';
    statusText = '⏳ بانتظار التفعيل';
  }

  const issueDate = product.purchaseDate || product.warrantyStartDate || '18 - 01 - 2026';
  const startDate = product.warrantyStartDate || product.purchaseDate || '18 - 01 - 2026';
  const endDate = product.warrantyEndDate || '18 - 01 - 2036';

  tempContainer.innerHTML = `
    <div style="position:relative; width:794px; min-height:1120px; background:#ffffff; padding:32px; font-family: 'Cairo', 'IBM Plex Sans Arabic', sans-serif; color:#0f172a; border:6px double #0B2D5C; direction:rtl; box-sizing:border-box;">
      
      <!-- Institutional Watermark Background -->
      <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; pointer-events:none; opacity:0.035; z-index:0;">
        <span style="font-size:120px; font-weight:900; color:#0B2D5C; transform:rotate(-45deg); letter-spacing:8px; text-transform:uppercase;">
          SLEEPEE
        </span>
      </div>

      <!-- Main Document Content -->
      <div style="position:relative; z-index:10; display:flex; flex-direction:column; justify-content:space-between; min-height:1050px;">
        
        <div>
          <!-- HEADER -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #0B2D5C; padding-bottom:18px; margin-bottom:18px;">
            <div>
              <h1 style="font-size:28px; font-weight:900; color:#0B2D5C; margin:0; line-height:1.2; font-family:'Cairo', sans-serif;">سليبي · SLEEPEE</h1>
              <p style="font-size:12px; font-weight:700; color:#334155; margin:4px 0 0 0;">الشركة العربية لصناعة مراتب السوست والإسفنج</p>
              <p style="font-size:10px; color:#64748b; margin:2px 0 0 0;">منظومة توثيق واعتماد الضمان الرقمي</p>
            </div>

            <!-- QR Code Section (Top Left) -->
            <div style="display:flex; align-items:center; gap:12px; background:#f8fafc; padding:8px 12px; border-radius:10px; border:1px solid #cbd5e1;">
              <img src="${qrApiUrl}" alt="QR Verification" style="width:76px; height:76px; object-fit:contain;" />
              <div style="font-size:9px; color:#334155; max-width:130px; line-height:1.3;">
                <p style="font-weight:800; color:#0B2D5C; margin:0 0 2px 0;">امسح للتحقق من أصالة الشهادة</p>
                <p style="margin:0; font-size:8px; color:#64748b; font-weight:600;">Scan To Verify Authenticity</p>
              </div>
            </div>
          </div>

          <!-- CERTIFICATE TITLE -->
          <div style="text-align:center; margin:16px 0 10px 0;">
            <h2 style="font-size:22px; font-weight:900; color:#0B2D5C; margin:0; letter-spacing:0.5px; font-family:'Cairo', sans-serif;">
              شهادة الضمان الإلكترونية المعتمدة
            </h2>
            <p style="font-size:11px; font-weight:700; color:#64748b; margin:4px 0 0 0; text-transform:uppercase; font-family:monospace; letter-spacing:2px;">
              Certified Warranty Certificate
            </p>
          </div>

          <!-- STATUS BADGE -->
          <div style="text-align:center; margin:12px 0;">
            <div style="display:inline-block; padding:6px 20px; border-radius:30px; font-weight:900; font-size:13px; background:${statusBg}; color:${statusTextColor}; border:2px solid ${statusBorderColor};">
              ${statusText}
            </div>
          </div>

          <!-- CERTIFICATE IDENTITY (WAR & SERIAL) -->
          <div style="background:#eff6ff; border:2px solid #bfdbfe; border-radius:12px; padding:14px; margin:18px 0; display:flex; justify-content:space-around; align-items:center; text-align:center;">
            <div>
              <span style="font-size:12px; font-weight:800; color:#475569; display:block; margin-bottom:4px;">رقم شهادة الضمان (WAR)</span>
              <span style="font-family:monospace; font-weight:900; font-size:22px; color:#0066ff; background:#ffffff; padding:4px 16px; border-radius:8px; border:1px solid #bfdbfe; display:inline-block;">
                ${warNumber}
              </span>
            </div>
            <div style="height:36px; width:2px; background:#bfdbfe;"></div>
            <div>
              <span style="font-size:12px; font-weight:700; color:#64748b; display:block; margin-bottom:4px;">الرقم التسلسلي (S/N)</span>
              <span style="font-family:monospace; font-weight:700; font-size:15px; color:#1e293b; background:#ffffff; padding:4px 12px; border-radius:8px; border:1px solid #cbd5e1; display:inline-block;">
                ${product.serialNumber}
              </span>
            </div>
          </div>

          <!-- WARRANTY DATES TABLE -->
          <div style="margin-bottom:18px; border:1px solid #cbd5e1; border-radius:8px; overflow:hidden; font-size:11px;">
            <div style="background:#0B2D5C; color:#ffffff; padding:6px 12px; font-weight:800; font-size:11px;">
              تاريخ وبيانات التوثيق الرسمي
            </div>
            <table style="width:100%; border-collapse:collapse; text-align:right;">
              <tbody>
                <tr style="border-bottom:1px solid #e2e8f0; background:#f8fafc;">
                  <td style="padding:8px 12px; font-weight:700; color:#475569; border-left:1px solid #e2e8f0; width:25%;">تاريخ إصدار الشهادة:</td>
                  <td style="padding:8px 12px; font-family:monospace; font-weight:700; color:#0f172a; width:25%;">${issueDate}</td>
                  <td style="padding:8px 12px; font-weight:700; color:#475569; border-left:1px solid #e2e8f0; width:25%;">مدة الضمان الرسمية:</td>
                  <td style="padding:8px 12px; font-weight:800; color:#0066ff; width:25%;">${product.warrantyPeriod || '10 سنوات'}</td>
                </tr>
                <tr style="background:#ffffff;">
                  <td style="padding:8px 12px; font-weight:700; color:#475569; border-left:1px solid #e2e8f0;">بداية سريان الضمان:</td>
                  <td style="padding:8px 12px; font-family:monospace; font-weight:700; color:#047857;">${startDate}</td>
                  <td style="padding:8px 12px; font-weight:700; color:#475569; border-left:1px solid #e2e8f0;">انتهاء صلاحية الضمان:</td>
                  <td style="padding:8px 12px; font-family:monospace; font-weight:700; color:#0B2D5C;">${endDate}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- SPECS & CUSTOMER OFFICIAL TABLES -->
          <div style="display:flex; gap:16px; margin-bottom:18px;">
            
            <!-- Product Info Official Table -->
            <div style="flex:1; border:1px solid #cbd5e1; border-radius:8px; overflow:hidden; font-size:11px;">
              <div style="background:#f1f5f9; color:#0B2D5C; padding:6px 12px; font-weight:800; font-size:11px; border-bottom:1px solid #cbd5e1;">
                مواصفات وبيانات المنتج
              </div>
              <table style="width:100%; border-collapse:collapse; text-align:right;">
                <tbody>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0; width:35%;">اسم المنتج:</td>
                    <td style="padding:6px 10px; font-weight:700; color:#0f172a;">مراتب سليبي الأصلية</td>
                  </tr>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0;">الموديل:</td>
                    <td style="padding:6px 10px; font-weight:600; color:#1e293b;">${product.modelName}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0;">الأبعاد والمقاس:</td>
                    <td style="padding:6px 10px; font-family:monospace; color:#1e293b;">${product.dimensions}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0;">تاريخ الإنتاج:</td>
                    <td style="padding:6px 10px; font-family:monospace; color:#1e293b;">${product.productionDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0;">الرقم التسلسلي:</td>
                    <td style="padding:6px 10px; font-family:monospace; font-weight:700; color:#0f172a;">${product.serialNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Customer Info Official Table -->
            <div style="flex:1; border:1px solid #cbd5e1; border-radius:8px; overflow:hidden; font-size:11px;">
              <div style="background:#f1f5f9; color:#0B2D5C; padding:6px 12px; font-weight:800; font-size:11px; border-bottom:1px solid #cbd5e1;">
                بيانات الفاتورة والعميل
              </div>
              <table style="width:100%; border-collapse:collapse; text-align:right;">
                <tbody>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0; width:35%;">اسم العميل:</td>
                    <td style="padding:6px 10px; font-weight:700; color:#0f172a;">${product.customerName || 'أحمد محمد علي'}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0;">رقم الهاتف:</td>
                    <td style="padding:6px 10px; font-family:monospace; color:#1e293b;">${product.customerPhone || '01012345678'}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0;">رقم الفاتورة:</td>
                    <td style="padding:6px 10px; font-family:monospace; font-weight:700; color:#0f172a;">${product.invoiceNumber || 'INV-2026-00125'}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #e2e8f0;">
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0;">المحافظة والمدينة:</td>
                    <td style="padding:6px 10px; font-weight:500; color:#1e293b;">${product.governorate || 'القاهرة'} - ${product.city || 'مدينة نصر'}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 10px; font-weight:700; color:#475569; background:#f8fafc; border-left:1px solid #e2e8f0;">تاريخ الشراء:</td>
                    <td style="padding:6px 10px; font-family:monospace; color:#1e293b;">${product.purchaseDate || '18 - 01 - 2026'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <!-- WARRANTY TERMS ORDERED LIST -->
          <div style="border:1px solid #cbd5e1; border-radius:8px; padding:12px 16px; margin-bottom:18px; background:#ffffff;">
            <h3 style="font-size:12px; font-weight:800; color:#0B2D5C; border-bottom:1px solid #e2e8f0; padding-bottom:6px; margin:0 0 8px 0;">
              الشروط والأحكام الرسمية للضمان (صادرة من المصنع)
            </h3>
            <ol style="font-size:10.5px; color:#334155; margin:0; padding-right:18px; line-height:1.7; font-weight:500;">
              <li>يشمل الضمان عيوب الصناعة في السوست والشاسيه والهيكل الداخلي الفولاذي.</li>
              <li>يبدأ سريان الضمان اعتباراً من تاريخ الشراء المدون بالفاتورة الرسمية المعتمدة.</li>
              <li>الضمان لا يغطي الأضرار الناتجة عن سوء الاستخدام أو البلل أو التمزق الخارجي للسطح.</li>
              <li>يجب استخدام المرتبة على ملة خشبية مستوية ومتقاربة وفق تعليمات التشغيل.</li>
              <li>لطلب الصيانة أو الدعم المباشر، التواصل عبر الخط الساخن الموحد (19707).</li>
            </ol>
          </div>

        </div>

        <!-- FOOTER & INSTITUTIONAL SEAL -->
        <div style="padding-top:14px; border-top:2px solid #0B2D5C; display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#475569;">
          <div>
            <p style="font-weight:900; color:#0B2D5C; margin:0; font-size:11px;">الشركة العربية لصناعة مراتب السوست والإسفنج</p>
            <p style="color:#334155; margin:3px 0 0 0; font-weight:600;">الخط الساخن: 19707 · الموقع الرسمي: www.sleepee.com</p>
            <p style="color:#64748b; margin:2px 0 0 0; font-size:9px;">إدارة الجودة والاعتماد الرقمي المعتمد</p>
          </div>

          <div style="display:flex; align-items:center; gap:20px;">
            <span style="font-family:monospace; font-size:9px; color:#94a3b8; font-weight:700;">Page 1 of 1</span>
            
            <!-- Professional Circular Seal -->
            <div style="text-align:center;">
              <div style="width:72px; height:76px; border:2px dashed #0B2D5C; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2px; font-size:7.5px; font-weight:900; color:#0B2D5C; background:#eff6ff; text-align:center; line-height:1.1; margin:0 auto;">
                <span style="font-size:8px;">SLEEPEE</span>
                <span style="font-size:6.5px; font-weight:700; color:#1d4ed8; margin:2px 0;">WARRANTY VERIFIED</span>
                <span style="font-size:6px; font-weight:800; color:#334155;">QUALITY ASSURANCE</span>
              </div>
              <span style="font-weight:800; font-size:8.5px; color:#0B2D5C; display:block; margin-top:2px;">ختم الجودة والاعتماد</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(tempContainer);

  try {
    // Convert external images to Data URLs
    await convertImagesToDataUrls(tempContainer);

    // Wait briefly for rendering
    await new Promise((res) => setTimeout(res, 200));

    // Render to canvas with onclone sanitizing oklch colors from external style tags
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      onclone: (clonedDoc) => {
        const styleTags = Array.from(clonedDoc.querySelectorAll('style'));
        styleTags.forEach((st) => {
          if (st.textContent && st.textContent.includes('oklch')) {
            st.textContent = st.textContent.replace(/oklch\([^)]+\)/g, '#0b2d5c');
          }
        });
      },
    });

    const imgData = canvas.toDataURL('image/png');

    // Create A4 PDF
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pdfHeight));

    // Trigger download
    pdf.save(fileName);
  } catch (error) {
    console.error('Error in PDF export:', error);
    throw new Error('فشل إنشاء شهادة الضمان بصيغة PDF. يرجى المحاولة مرة أخرى.');
  } finally {
    if (tempContainer && tempContainer.parentNode) {
      tempContainer.parentNode.removeChild(tempContainer);
    }
  }
}
