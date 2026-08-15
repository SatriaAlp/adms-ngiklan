import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShoppingBag, Trash2, ArrowRight, ShieldCheck, CreditCard, Sparkles, Plus, Minus, Heart } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    addNotification,
    isLoggedIn,
    setIsLoginModalOpen,
    currentUser,
    cartDrawerTab,
    setCartDrawerTab,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
  } = useApp();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('Budi Santoso');
  const [customerEmail, setCustomerEmail] = useState('budi@example.com');
  const [customerPhone, setCustomerPhone] = useState('081234567890');
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'bank_transfer' | 'e_wallet' | 'afifah_gateway'>('afifah_gateway');

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      setCustomerName(currentUser.name);
      setCustomerEmail(currentUser.email);
      setCustomerPhone(currentUser.phone);
    }
  }, [isLoggedIn, currentUser]);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      const order = await placeOrder({
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod,
        items: cart,
      });

      addNotification(`Pesanan #${order.id} berhasil dibuat! Link download dikirim ke email Anda.`, 'success');
      setIsCheckingOut(false);
      setIsCartOpen(false);
    } catch (error) {
      addNotification('Gagal memproses pesanan. Silakan coba lagi.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between transform transition-all animate-slide-in">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500 text-slate-950 font-bold">
                {cartDrawerTab === 'cart' ? <ShoppingBag className="w-5 h-5" /> : <Heart className="w-5 h-5 text-slate-950" />}
              </div>
              <div>
                <h3 className="font-bold text-base text-white">{cartDrawerTab === 'cart' ? 'Keranjang Belanja' : 'Wishlist Saya'}</h3>
                <p className="text-xs text-slate-400 font-medium">
                  {cartDrawerTab === 'cart' ? `${cart.length} item tersimpan` : `${wishlist.length} produk disukai`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Tab Switcher */}
          {!isCheckingOut && (
            <div className="flex bg-slate-100 p-1 border-b border-slate-200">
              <button
                onClick={() => setCartDrawerTab('cart')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  cartDrawerTab === 'cart' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Keranjang ({cart.length})</span>
              </button>
              <button
                onClick={() => setCartDrawerTab('wishlist')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  cartDrawerTab === 'wishlist' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Disukai ({wishlist.length})</span>
              </button>
            </div>
          )}

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartDrawerTab === 'wishlist' ? (
              /* Wishlist Tab Content */
              wishlist.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">Wishlist Anda Kosong</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Sukacita produk digital yang Anda inginkan dengan menekan tombol hati saat menjelajah.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Produk Disukai</span>
                  </div>

                  {wishlist.map((id) => {
                    const product = products.find((p) => p.id === id);
                    if (!product) return null;
                    return (
                      <div
                        key={product.id}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3"
                      >
                        <img
                          src={product.thumbnail || product.images?.[0]}
                          alt={product.title}
                          className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate">{product.title}</h5>
                          <p className="text-xs font-bold text-cyan-600 mt-0.5">
                            Rp{product.price.toLocaleString('id-ID')}
                          </p>
                          <button
                            onClick={() => {
                              addToCart(product);
                              addNotification(`${product.title} ditambahkan ke keranjang!`, 'success');
                            }}
                            className="mt-2 text-[10px] font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1 rounded-md transition-colors"
                          >
                            Tambah ke Keranjang
                          </button>
                        </div>

                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Hapus dari Wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              /* Cart Tab Content */
              cart.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-base">Keranjang Anda Kosong</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Jelajahi produk digital terbaik di marketplace kami dan tambahkan ke keranjang belanja Anda.
                  </p>
                </div>
              ) : !isCheckingOut ? (
                /* Item List Mode */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Daftar Produk</span>
                    <button
                      onClick={clearCart}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      Kosongkan
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3"
                    >
                      <img
                        src={item.product.thumbnail || item.product.images?.[0]}
                        alt={item.product.title}
                        className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-xs font-bold text-slate-900 truncate">{item.product.title}</h5>
                        <p className="text-xs font-bold text-cyan-600 mt-0.5">
                          Rp{item.product.price.toLocaleString('id-ID')}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-slate-200 bg-white rounded-lg">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-slate-600 hover:text-slate-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-slate-600 hover:text-slate-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-200 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                /* Checkout Form Mode */
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Informasi Pembeli</span>
                    <button
                      type="button"
                      onClick={() => setIsCheckingOut(false)}
                      className="text-xs text-slate-600 font-bold hover:underline"
                    >
                      ← Kembali
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email (Untuk Pengiriman File)</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Metode Pembayaran</label>
                    
                    {/* Afifah Gateway Special Badge */}
                    <div
                      onClick={() => setPaymentMethod('afifah_gateway')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'afifah_gateway'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-cyan-400" />
                          <span className="font-bold text-xs">Custom Payment Gateway (by Afifah)</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                          Otomatis
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 ${paymentMethod === 'afifah_gateway' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Sistem gateway kustom terintegrasi otomatis untuk QRIS, Transfer Bank, dan E-Wallet.
                      </p>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs font-bold ${
                        paymentMethod === 'qris' ? 'border-slate-900 bg-slate-100 text-slate-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>QRIS (Scan All Bank / E-Wallet)</span>
                      <span>Instant</span>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('bank_transfer')}
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between text-xs font-bold ${
                        paymentMethod === 'bank_transfer' ? 'border-slate-900 bg-slate-100 text-slate-900' : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>Transfer Bank (BCA / Mandiri / BNI)</span>
                      <span>Manual/VA</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Bayar Sekarang (Rp{subtotal.toLocaleString('id-ID')})</span>
                  </button>
                </form>
              )
            )}
          </div>

          {/* Drawer Footer */}
          {cartDrawerTab === 'cart' && cart.length > 0 && !isCheckingOut && (
            <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between font-bold text-sm text-slate-900">
                <span>Total Pembayaran</span>
                <span className="text-base text-cyan-600">Rp{subtotal.toLocaleString('id-ID')}</span>
              </div>

              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setIsLoginModalOpen(true);
                    addNotification('Silakan login terlebih dahulu untuk melakukan pembayaran.', 'warning');
                  } else {
                    setIsCheckingOut(true);
                  }
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Garansi 100% Produk Digital & Lisensi Asli</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
