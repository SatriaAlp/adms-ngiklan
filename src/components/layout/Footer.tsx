import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdmsLogo } from '../common/AdmsLogo';
import {
  ShieldCheck,
  Instagram,
  Facebook,
  MessageCircle,
  Video,
  ArrowRight,
  Heart,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, setIsChatOpen } = useApp();

  return (
    <footer className="bg-navy border-t border-navy text-slate-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <AdmsLogo size="lg" isDarkBg={true} />
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Platform terpadu Marketplace Produk Digital, Multi-Vendor Merchant, dan Platform Pemasangan Iklan Gratis & Promosi Berbayar untuk mengembangkan bisnis Anda.
            </p>

            <div className="pt-2 flex items-center gap-2.5 text-slate-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:text-gold transition-colors"
                title="Instagram ADMS"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:text-gold transition-colors"
                title="Facebook ADMS"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:text-gold transition-colors"
                title="TikTok ADMS"
              >
                <Video className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 hover:text-gold transition-colors"
                title="WhatsApp CS ADMS"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Kolom Platform */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <button onClick={() => navigate('marketplace')} className="hover:text-gold transition-colors">
                  Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => navigate('marketplace')} className="hover:text-gold transition-colors">
                  Produk Digital
                </button>
              </li>
              <li>
                <button onClick={() => navigate('ads')} className="hover:text-gold transition-colors">
                  Iklan & Promosi
                </button>
              </li>
              <li>
                <button onClick={() => navigate('merchants')} className="hover:text-gold transition-colors">
                  Merchant Vendor
                </button>
              </li>
              <li>
                <button onClick={() => navigate('pricing')} className="hover:text-gold transition-colors">
                  Paket Iklan
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom Bantuan */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Bantuan</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <button onClick={() => navigate('bantuan')} className="hover:text-gold transition-colors">
                  FAQ & Pertanyaan
                </button>
              </li>
              <li>
                <button onClick={() => setIsChatOpen(true)} className="hover:text-gold transition-colors text-left">
                  Customer Support (AI Assistant)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bantuan')} className="hover:text-gold transition-colors">
                  Cara Pembelian Produk
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bantuan')} className="hover:text-gold transition-colors">
                  Cara Menjadi Merchant
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bantuan')} className="hover:text-gold transition-colors">
                  Panduan Iklan Gratis
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Legal & Kebijakan</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <button onClick={() => navigate('bantuan')} className="hover:text-gold transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bantuan')} className="hover:text-gold transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bantuan')} className="hover:text-gold transition-colors">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bantuan')} className="hover:text-gold transition-colors">
                  Advertising Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <p>© 2026 ADMS (PT. Armada Digital Marketing Syariah). All rights reserved.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>Platform Status: Operational & Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
