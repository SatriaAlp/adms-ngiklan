import React, { useState } from 'react';
import { Advertisement } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  MapPin,
  Phone,
  Mail,
  User,
  ExternalLink,
  MessageCircle,
  Eye,
  MousePointer,
  Sparkles,
  Zap,
  Tag,
  Share2
} from 'lucide-react';

interface ClassifiedDetailModalProps {
  ad: Advertisement | null;
  onClose: () => void;
}

export const ClassifiedDetailModal: React.FC<ClassifiedDetailModalProps> = ({ ad, onClose }) => {
  const { addNotification } = useApp();
  const [selectedImg, setSelectedImg] = useState<number>(0);

  if (!ad) return null;

  const formatRupiah = (amount: number) => {
    return amount === 0
      ? 'Rp0 / Gratis'
      : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification('Link iklan disalin ke clipboard!', 'info');
  };

  // WhatsApp Link generator
  const getWhatsAppLink = () => {
    const text = encodeURIComponent(
      `Halo ${ad.contactName || 'Pengiklan'}, saya tertarik dengan iklan Anda "${ad.title}" di ADMS Ngiklan. Apakah masih tersedia?`
    );
    const phone = ad.whatsapp.replace(/\D/g, ''); // strip non-digits
    return `https://wa.me/${phone.startsWith('0') ? '62' + phone.slice(1) : phone}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl text-slate-800 space-y-6 transform transition-all animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Grid Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Images Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-xl bg-slate-100 overflow-hidden border border-slate-200 relative">
              <img
                src={ad.images[selectedImg] || 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80'}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              
              {/* Type Badge Overlay */}
              <div className="absolute top-3 left-3">
                {ad.type === 'PREMIUM' || ad.type === 'premium' ? (
                  <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5" /> Sponsor Premium
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-slate-950 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" /> Iklan 
                  </span>
                )}
              </div>

              {/* Condition Badge Overlay */}
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-slate-950 font-bold text-[10px] border border-slate-200 shadow-sm capitalize">
                Kondisi: {ad.condition}
              </span>
            </div>

            {/* Thumbnail Selection */}
            {ad.images && ad.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {ad.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImg === idx ? 'border-slate-900 scale-102' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Price, Location, Details */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Category, Condition & Views info */}
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                <span className="text-cyan-600">{ad.category}</span>
                <div className="flex items-center gap-3 lowercase normal-case">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {(ad.viewsCount || 0) + 120} views
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {ad.title}
              </h1>

              {/* Price */}
              <div className="text-2xl font-black text-slate-900">
                {formatRupiah(ad.price)}
              </div>

              {/* Specs boxes (Location & Condition) */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-600 shrink-0" />
                  <div className="truncate">
                    <div className="text-[10px] text-slate-400 font-medium">Lokasi</div>
                    <div className="text-xs font-bold text-slate-900 truncate">{ad.location}</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Kondisi Barang</div>
                    <div className="text-xs font-bold text-slate-900 capitalize">{ad.condition}</div>
                  </div>
                </div>
              </div>

              {/* Contact Person Box */}
              <div className="p-4 rounded-xl bg-slate-950 text-white space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Hubungi Pengiklan</div>
                    <div className="text-sm font-bold text-white">{ad.contactName}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-white fill-white" />
                <span>Chat Penjual di WhatsApp</span>
              </a>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-medium">
                <span className="text-[10px] text-slate-400">
                  Paket: {ad.packageName || 'Iklan Gratis'}
                </span>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Bagikan Link
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full Description Tab Area */}
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
            Deskripsi Detail Iklan
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-normal whitespace-pre-line">
            {ad.description}
          </p>
        </div>
      </div>
    </div>
  );
};
