import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { ProductMaster, Brand, ManufacturingSystem, WarrantyPolicy, ProductStatus } from '../types/productMaster';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<ProductMaster, 'id' | 'createdAt'>) => void;
  existingProducts: ProductMaster[];
  editProduct?: ProductMaster | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingProducts,
  editProduct,
}) => {
  const [formData, setFormData] = useState<Omit<ProductMaster, 'id' | 'createdAt'>>({
    brand: 'Sleepee',
    model: '',
    productName: '',
    width: 0,
    length: 0,
    height: 0,
    manufacturingSystem: 'American',
    warrantyPolicy: '10 Years',
    sapMaterialCode: '',
    status: 'active',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        brand: editProduct.brand,
        model: editProduct.model,
        productName: editProduct.productName,
        width: editProduct.width,
        length: editProduct.length,
        height: editProduct.height,
        manufacturingSystem: editProduct.manufacturingSystem,
        warrantyPolicy: editProduct.warrantyPolicy,
        sapMaterialCode: editProduct.sapMaterialCode || '',
        status: editProduct.status,
      });
    } else {
      setFormData({
        brand: 'Sleepee',
        model: '',
        productName: '',
        width: 0,
        length: 0,
        height: 0,
        manufacturingSystem: 'American',
        warrantyPolicy: '10 Years',
        sapMaterialCode: '',
        status: 'active',
      });
    }
    setError(null);
  }, [editProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.brand || !formData.model || !formData.productName) {
      setError('يرجى ملء جميع الحقول المطلوبة (*)');
      return;
    }

    // Check for duplicate (Brand + Model + Dimensions)
    const isDuplicate = existingProducts.some(p => 
      p.id !== editProduct?.id &&
      p.brand === formData.brand &&
      p.model === formData.model &&
      p.width === formData.width &&
      p.length === formData.length &&
      p.height === formData.height
    );

    if (isDuplicate) {
      setError('هذا المنتج مسجل مسبقاً.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm text-right">
      <div className="bg-surface dark:bg-surface-secondary rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-border-main animate-in fade-in zoom-in duration-200 z-[10000]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-main bg-slate-50 dark:bg-surface">
          <h2 className="font-bold text-[#0B2D5C] dark:text-text-primary">
            {editProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Data */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-blue-600 mb-4 border-b border-blue-100 pb-2">البيانات الأساسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">البراند (Brand) *</label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value as Brand })}
                  className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
                >
                  <option value="Sleepee">Sleepee</option>
                  <option value="SH">SH</option>
                  <option value="Rich House">Rich House</option>
                  <option value="Comfort">Comfort</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">الموديل (Model) *</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="مثال: Silver"
                  className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1.5">اسم المنتج (Product Name) *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="مثال: Silver 160×195×25"
                  className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Specifications */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-blue-600 mb-4 border-b border-blue-100 pb-2">المواصفات</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">العرض (cm)</label>
                <input
                  type="number"
                  value={formData.width || ''}
                  onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                  className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">الطول (cm)</label>
                <input
                  type="number"
                  value={formData.length || ''}
                  onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
                  className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">الارتفاع (cm)</label>
                <input
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Operating Data */}
          <div className="mb-8">
            <h3 className="text-xs font-black text-blue-600 mb-4 border-b border-blue-100 pb-2">بيانات التشغيل</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">نظام التصنيع</label>
                <select
                  value={formData.manufacturingSystem}
                  onChange={(e) => setFormData({ ...formData, manufacturingSystem: e.target.value as ManufacturingSystem })}
                  className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
                >
                  <option value="American">American</option>
                  <option value="German">German</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5">سياسة الضمان</label>
                <select
                  value={formData.warrantyPolicy}
                  onChange={(e) => setFormData({ ...formData, warrantyPolicy: e.target.value as WarrantyPolicy })}
                  className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
                >
                  <option value="10 Years">10 Years</option>
                  <option value="7 Years">7 Years</option>
                  <option value="5 Years">5 Years</option>
                  <option value="Declining Warranty">Declining Warranty</option>
                  <option value="Hybrid Warranty">Hybrid Warranty</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1.5">كود المادة في SAP (SAP Material Code)</label>
                <input
                  type="text"
                  value={formData.sapMaterialCode}
                  onChange={(e) => setFormData({ ...formData, sapMaterialCode: e.target.value })}
                  placeholder="اختياري"
                  className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Status */}
          <div className="mb-6">
            <h3 className="text-xs font-black text-blue-600 mb-4 border-b border-blue-100 pb-2">الحالة</h3>
            <div>
              <label className="block text-xs font-bold mb-1.5">حالة المنتج</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductStatus })}
                className="w-full h-11 px-3 bg-slate-50 border border-border-main rounded-xl text-sm outline-none focus:border-blue-600"
              >
                <option value="active">نشط (Active)</option>
                <option value="inactive">غير نشط (Inactive)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-main">
            <button
              type="submit"
              className="flex-1 h-12 bg-[#0B2D5C] hover:bg-[#133358] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Save size={18} />
              <span>حفظ المنتج</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
