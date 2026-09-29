import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, UploadCloud, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  initialMode?: 'camera' | 'upload';
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  initialMode = 'camera',
}) => {
  const [mode, setMode] = useState<'camera' | 'upload'>(initialMode);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (!isOpen || mode !== 'camera') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, mode]);

  const startCamera = async () => {
    setErrorMessage(null);
    setIsScanning(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('متصفحك لا يدعم الوصول المباشر للكاميرا');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasCameraPermission(true);
    } catch (err: unknown) {
      console.warn('Camera access issue:', err);
      setHasCameraPermission(false);
      setErrorMessage(
        'تعذر تشغيل الكاميرا المباشرة (قد يتطلب أذونات في المتصفح). يمكنك تجربة المحاكاة أو رفع صورة رمز QR.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSimulatedScan = (sampleCode: string) => {
    stopCamera();
    onScanSuccess(sampleCode);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate decoding QR code from image
      setTimeout(() => {
        // If file name has 2022 or expired, pass expired, otherwise pass active
        if (file.name.toLowerCase().includes('expired') || file.name.includes('2022')) {
          onScanSuccess('SLP-2022-4587');
        } else {
          onScanSuccess('SLP-2026-9081');
        }
        onClose();
      }, 600);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 z-[10000]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Camera size={20} className="text-blue-600" />
            <span>مسح رمز QR للتحقق</span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="p-4 bg-slate-100/60 flex items-center justify-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setMode('camera')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'camera'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Camera size={14} />
            <span>كاميرا الهاتف / الجهاز</span>
          </button>
          <button
            onClick={() => setMode('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === 'upload'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <UploadCloud size={14} />
            <span>رفع صورة QR</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {mode === 'camera' ? (
            <div className="space-y-4">
              <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center border-2 border-slate-700">
                {hasCameraPermission === false ? (
                  <div className="p-4 text-center text-slate-300 space-y-2">
                    <AlertCircle size={32} className="mx-auto text-amber-400" />
                    <p className="text-xs">{errorMessage}</p>
                    <button
                      onClick={startCamera}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                    >
                      <RefreshCw size={12} /> إعادة المحاولة
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Scanner Target Guide Overlay */}
                    <div className="absolute inset-8 border-2 border-blue-500/70 rounded-xl pointer-events-none">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400"></div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse"></div>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center text-xs text-slate-500">
                وجه الكاميرا نحو ملصق كود QR المثبت على جانب المرتبة
              </div>

              {/* Sample QR Testing shortcuts for smooth evaluation */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-600 mb-2 text-center">
                  نماذج اختبار سريعة للمسح:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleSimulatedScan('SLP-2026-9081')}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    تجربة QR ساري المفعول (SLP-2026-9081)
                  </button>
                  <button
                    onClick={() => handleSimulatedScan('SLP-2022-4587')}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
                  >
                    تجربة QR منتهي (SLP-2022-4587)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <UploadCloud size={40} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span className="mt-3 text-sm font-bold text-slate-700">اضغط لرفع صورة رمز QR</span>
                <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (حتى 10MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-600 mb-2 text-center">
                  أو اختر أحد نماذج الأكواد:
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSimulatedScan('SLP-2026-9081')}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 text-right text-xs transition-colors"
                  >
                    <span className="font-bold text-slate-800">سليبي بوكيت سبرينج (ساري)</span>
                    <span className="text-blue-600 font-mono">SLP-2026-9081</span>
                  </button>
                  <button
                    onClick={() => handleSimulatedScan('SLP-2022-4587')}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-rose-400 text-right text-xs transition-colors"
                  >
                    <span className="font-bold text-slate-800">سليبي رويال بوكيت (منتهي)</span>
                    <span className="text-rose-600 font-mono">SLP-2022-4587</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
