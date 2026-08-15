import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, Search, Filter, MessageSquare, Send, CheckCircle2, Clock, XCircle 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const SupportView: React.FC = () => {
  const { addNotification } = useApp();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OPEN'); // OPEN, CLOSED
  const [search, setSearch] = useState('');
  
  // Detail Modal State
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await api.getTickets();
      // Filter locally since mock doesn't handle query params
      setTickets(data.filter((t: any) => t.status === activeTab));
    } catch (error) {
      addNotification('Gagal memuat data tiket', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

  const handleReply = async (markAsResolved: boolean) => {
    if (!replyMessage.trim() && !markAsResolved) {
      addNotification('Pesan balasan tidak boleh kosong', 'error');
      return;
    }

    try {
      await api.replyTicket(selectedTicket.id, replyMessage, markAsResolved);
      addNotification(`Balasan terkirim${markAsResolved ? ' dan tiket ditutup' : ''}`, 'success');
      
      if (markAsResolved) {
        setTickets(prev => prev.filter(t => t.id !== selectedTicket.id));
        setSelectedTicket(null);
      } else {
        // Optimistically update local ticket thread
        setSelectedTicket({
          ...selectedTicket,
          messages: [
            ...selectedTicket.messages, 
            { sender: 'ADMIN', text: replyMessage, time: new Date() }
          ]
        });
      }
      setReplyMessage('');
    } catch (error) {
      addNotification('Gagal mengirim balasan', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Customer Support</h2>
          <p className="text-slate-500 text-sm mt-1">Tanggapi keluhan dan pertanyaan pengguna platform.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex overflow-x-auto scrollbar-none">
        {['OPEN', 'CLOSED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-navy text-white shadow-md'
                : 'text-slate-500 hover:text-navy hover:bg-slate-50'
            }`}
          >
            {tab === 'OPEN' ? 'Tiket Aktif / Belum Dijawab' : 'Tiket Selesai (Closed)'}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Inbox Bersih!</h3>
            <p className="text-sm text-slate-500">Tidak ada tiket {activeTab.toLowerCase()} saat ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="font-bold text-blue-700">{ticket.user.name.charAt(0).toUpperCase()}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-navy truncate">{ticket.subject}</h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                      {new Date(ticket.lastUpdate).toLocaleDateString('id-ID', {month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">{ticket.messages[ticket.messages.length - 1].text}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-slate-400">{ticket.user.name}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ticket.priority === 'HIGH' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ticket.priority} PRIORITY
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Thread Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-3xl shadow-xl animate-in zoom-in-95 duration-200 flex flex-col h-[80vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-2xl z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-bold text-blue-700">{selectedTicket.user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-navy">{selectedTicket.subject}</h3>
                  <p className="text-xs text-slate-500">{selectedTicket.user.name} • {selectedTicket.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            {/* Thread Area */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-6">
              {selectedTicket.messages.map((msg: any, idx: number) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'ADMIN' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1">{msg.sender === 'ADMIN' ? 'Anda (Admin)' : selectedTicket.user.name}</span>
                  <div className={`p-4 rounded-2xl max-w-[80%] ${
                    msg.sender === 'ADMIN' 
                      ? 'bg-cyan-500 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 mr-1">
                    {new Date(msg.time).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Area */}
            {selectedTicket.status === 'OPEN' && (
              <div className="p-4 bg-white border-t border-slate-100 rounded-b-2xl shrink-0">
                <textarea 
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Ketik balasan Anda di sini..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none h-20 bg-slate-50"
                />
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => handleReply(true)}
                    className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Tandai Selesai (Close Ticket)
                  </button>
                  <button 
                    onClick={() => handleReply(false)}
                    disabled={!replyMessage.trim()}
                    className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-200 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
                  >
                    Kirim Balasan <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
