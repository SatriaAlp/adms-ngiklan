import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CreditCard, Wallet, Smartphone, CheckCircle2, Copy } from 'lucide-react';

export const PaymentPopupModal: React.FC = () => {
  const { paymentPopupProduct: product, setPaymentPopupProduct, addNotification } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'transfer' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!product) return null;

  const onClose = () => {
    setPaymentPopupProduct(null);
    setPaymentMethod(null);
    setShowSuccess(false);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const price = product.discountPrice || product.price;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification('Berhasil disalin ke clipboard!', 'success');
  };

  const handleConfirmPayment = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-slate-900 text-lg">Pilih Metode Pembayaran</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto">
          {showSuccess ? (
            <div className="py-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-slate-500 text-sm">Terima kasih telah memesan {product.title}. Pesanan Anda sedang kami proses.</p>
            </div>
          ) : (
            <>
              {/* Product Info */}
              <div className="bg-slate-50 p-4 rounded-xl mb-6 flex gap-4 items-center">
                <img src={product.thumbnail} alt={product.title} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{product.title}</h4>
                  <p className="text-navy font-bold">{formatRupiah(price)}</p>
                </div>
              </div>

              {!paymentMethod ? (
                <div className="space-y-3">
                  <button 
                    onClick={() => setPaymentMethod('qris')}
                    className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:border-navy hover:bg-navy/5 transition-colors text-left group"
                  >
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">QRIS (Semua E-Wallet)</h4>
                      <p className="text-xs text-slate-500">Gopay, OVO, Dana, LinkAja, dll</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod('transfer')}
                    className="w-full p-4 border border-slate-200 rounded-xl flex items-center gap-4 hover:border-navy hover:bg-navy/5 transition-colors text-left group"
                  >
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Transfer Bank</h4>
                      <p className="text-xs text-slate-500">BCA, Mandiri, BNI, BRI</p>
                    </div>
                  </button>

                  <div className="relative py-3 flex items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-medium">Atau butuh bantuan?</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <button 
                    onClick={() => {
                      const message = `Halo admin ADMS, saya ingin konsultasi mengenai layanan *${product.title}*.`;
                      window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3.5 rounded-xl transition-colors shadow-xs flex justify-center items-center gap-2"
                  >
                    Konsultasi Gratis via WhatsApp
                  </button>
                </div>
              ) : paymentMethod === 'qris' ? (
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-4">Scan QR code di bawah ini menggunakan aplikasi e-wallet Anda.</p>
                  <div className="bg-slate-100 p-4 rounded-2xl inline-block mb-6">
                    {/* Mockup QRIS */}
                    <div className="w-48 h-48 bg-white border border-slate-200 rounded-xl flex items-center justify-center p-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS" className="w-full h-full opacity-80" />
                    </div>
                  </div>
                  <button 
                    onClick={handleConfirmPayment}
                    className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Saya Sudah Bayar
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-600 mb-4">Silakan transfer ke rekening berikut:</p>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-900">BCA</span>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" className="h-4" />
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                      <span className="font-mono text-lg font-bold tracking-wider text-slate-700">123 456 7890</span>
                      <button onClick={() => handleCopy('1234567890')} className="text-navy hover:text-slate-900">
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">A.n. PT Armada Digital Marketing Solution</p>
                  </div>
                  <button 
                    onClick={handleConfirmPayment}
                    className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Saya Sudah Transfer
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
