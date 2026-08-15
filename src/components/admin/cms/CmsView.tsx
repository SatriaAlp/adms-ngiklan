import React, { useState, useEffect } from 'react';
import { 
  FileText, Edit, Save, X, CheckCircle2, LayoutTemplate 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

export const CmsView: React.FC = () => {
  const { addNotification } = useApp();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [editingPage, setEditingPage] = useState<any | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [editorStatus, setEditorStatus] = useState('DRAFT');

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await api.getPages();
      setPages(data);
    } catch (error) {
      addNotification('Gagal memuat data halaman', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setEditorContent(page.content);
    setEditorStatus(page.status);
  };

  const handleSave = async () => {
    if (!editingPage) return;
    
    try {
      await api.updatePage(editingPage.id, { content: editorContent, status: editorStatus });
      addNotification('Halaman berhasil disimpan', 'success');
      setEditingPage(null);
      fetchPages();
    } catch (error) {
      addNotification('Terjadi kesalahan saat menyimpan halaman', 'error');
    }
  };

  if (editingPage) {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <button onClick={() => setEditingPage(null)} className="hover:text-navy">CMS</button>
              <span>/</span>
              <span className="font-bold">{editingPage.title}</span>
            </div>
            <h2 className="text-xl font-black text-navy flex items-center gap-2">
              <Edit className="w-5 h-5 text-cyan-500" />
              Edit Halaman
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={editorStatus}
              onChange={(e) => setEditorStatus(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
            <button 
              onClick={() => setEditingPage(null)}
              className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan
            </button>
          </div>
        </div>

        {/* Pseudo Rich Text Editor */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="bg-slate-50 p-2 border-b border-slate-200 flex items-center gap-1 overflow-x-auto">
            {['B', 'I', 'U', 'H1', 'H2', 'H3', 'Link', 'Image', 'List', 'Quote'].map(tool => (
              <button key={tool} className="px-3 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded transition-colors">
                {tool}
              </button>
            ))}
            <div className="w-px h-6 bg-slate-300 mx-2"></div>
            <span className="text-xs text-slate-400 italic px-2">Format HTML didukung</span>
          </div>
          <textarea 
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            className="flex-1 w-full p-6 text-sm text-slate-700 font-mono focus:outline-none resize-none leading-relaxed"
            placeholder="Tulis konten HTML di sini..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Content Management (CMS)</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola halaman statis seperti About Us, Terms & Conditions, Privacy Policy.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <div key={page.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <LayoutTemplate className="w-6 h-6 text-cyan-600" />
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                  page.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {page.status}
                </span>
              </div>
              
              <h3 className="text-lg font-black text-navy mb-2">{page.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mb-6">
                Terakhir diperbarui: <span className="font-bold text-slate-600">{new Date(page.lastUpdated).toLocaleDateString('id-ID')}</span>
              </p>

              <button 
                onClick={() => handleEdit(page)}
                className="mt-auto w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" /> Edit Halaman
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
