import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageCircle, X, Send, Sparkles, User, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const ChatBotWidget: React.FC = () => {
  const { isChatOpen, setIsChatOpen, navigate } = useApp();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Halo! Saya ADMS AI Assistant. Ada yang bisa saya bantu terkait marketplace produk digital, pendaftaran merchant, atau pemasangan iklan?',
      time: 'Baru saja',
    },
  ]);

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white p-3.5 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 group transition-all hover:scale-105"
        title="Customer Support Chatbot"
      >
        <MessageCircle className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold pr-1 hidden sm:inline">Bantuan ADMS</span>
      </button>
    );
  }

  const handleSend = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: 'Baru saja',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');

    // Generate smart response based on keywords
    setTimeout(() => {
      let reply = 'Terima kasih atas pertanyaan Anda. Tim customer support ADMS selalu siap membantu!';
      const query = textToSend.toLowerCase();

      if (query.includes('iklan') || query.includes('promosi')) {
        reply = 'Anda bisa memasang iklan gratis Rp0 atau memilih paket sponsor premium di ADMS! Klik tombol "Pasang Iklan Gratis" di beranda atau menu untuk memulai.';
      } else if (query.includes('merchant') || query.includes('jual')) {
        reply = 'Untuk menjadi Merchant di ADMS, Anda dapat mendaftar melalui Dashboard Merchant dan langsung mengunggah produk digital tanpa biaya pendaftaran.';
      } else if (query.includes('bayar') || query.includes('pembayaran') || query.includes('afifah')) {
        reply = 'ADMS didukung oleh Custom Payment Gateway terintegrasi otomatis (QRIS, Virtual Account, & E-Wallet) yang memverifikasi transaksi instan.';
      } else if (query.includes('download') || query.includes('file')) {
        reply = 'Setiap produk digital yang Anda beli dapat langsung diunduh secara instan dari Dashboard User pada tab "Riwayat Pembelian".';
      }

      const botReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        time: 'Baru saja',
      };
      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
      {/* Chat Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white">ADMS Customer Support</h4>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online 24/7
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsChatOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user' ? 'bg-slate-900 text-white' : 'bg-cyan-500 text-slate-950'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div
              className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none font-medium'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium shadow-xs'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[10px] font-bold">
        <button
          onClick={() => handleSend(undefined, 'Bagaimana cara pasang iklan gratis?')}
          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
        >
          Iklan Gratis?
        </button>
        <button
          onClick={() => handleSend(undefined, 'Bagaimana cara buka toko merchant?')}
          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
        >
          Buka Merchant?
        </button>
        <button
          onClick={() => handleSend(undefined, 'Bagaimana sistem pembayarannya?')}
          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap"
        >
          Payment Gateway?
        </button>
      </div>

      {/* Input Bar */}
      <form onSubmit={(e) => handleSend(e)} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pertanyaan Anda..."
          className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
        >
          <Send className="w-4 h-4 text-cyan-400" />
        </button>
      </form>
    </div>
  );
};
