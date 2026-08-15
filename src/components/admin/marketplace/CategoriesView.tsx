import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit, Trash2, FolderTree, Layout, Code, Image as ImageIcon, Music, Video, Book 
} from 'lucide-react';
import { api } from '../../../services/apiClient';
import { useApp } from '../../../context/AppContext';

// Simple icon mapper
const iconMap: Record<string, React.ReactNode> = {
  Layout: <Layout className="w-5 h-5 text-cyan-500" />,
  Code: <Code className="w-5 h-5 text-purple-500" />,
  Image: <ImageIcon className="w-5 h-5 text-emerald-500" />,
  Music: <Music className="w-5 h-5 text-rose-500" />,
  Video: <Video className="w-5 h-5 text-orange-500" />,
  Book: <Book className="w-5 h-5 text-blue-500" />,
};

export const CategoriesView: React.FC = () => {
  const { addNotification } = useApp();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    description: '',
    iconName: 'Layout'
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      addNotification('Gagal memuat kategori', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      addNotification('Nama dan Slug wajib diisi', 'error');
      return;
    }

    try {
      if (formData.id) {
        await api.updateCategory(formData.id, formData);
        addNotification('Kategori berhasil diupdate', 'success');
      } else {
        await api.createCategory(formData);
        addNotification('Kategori baru berhasil ditambahkan', 'success');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      addNotification('Terjadi kesalahan saat menyimpan kategori', 'error');
    }
  };

  const openEdit = (category: any) => {
    setFormData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      iconName: category.iconName || 'Layout'
    });
    setModalOpen(true);
  };

  const openCreate = () => {
    setFormData({
      id: '',
      name: '',
      slug: '',
      description: '',
      iconName: 'Layout'
    });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-navy">Manajemen Kategori</h2>
          <p className="text-slate-500 text-sm mt-1">Kelola kategori produk untuk mempermudah pencarian.</p>
        </div>
        <button 
          onClick={openCreate}
          className="px-4 py-2.5 bg-navy text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Kategori Baru
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-center">Total Produk</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Memuat data...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada kategori yang ditemukan.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                          {iconMap[category.iconName] || <FolderTree className="w-5 h-5 text-slate-400" />}
                        </div>
                        <div>
                          <p className="font-bold text-navy">{category.name}</p>
                          <p className="text-xs text-slate-500 max-w-md truncate">{category.description || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium font-mono text-xs">
                      /{category.slug}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 bg-slate-100 text-slate-700 font-black rounded-lg">
                        {category._count?.products || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEdit(category)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-navy mb-4 flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-cyan-500" />
              {formData.id ? 'Edit Kategori' : 'Kategori Baru'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Kategori</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Contoh: Template Canva"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">URL Slug</label>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-slate-600"
                  placeholder="contoh-template-canva"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Icon</label>
                <select 
                  value={formData.iconName}
                  onChange={(e) => setFormData({...formData, iconName: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {Object.keys(iconMap).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Deskripsi</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none h-20"
                  placeholder="Deskripsi singkat mengenai kategori ini..."
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-navy text-white font-bold hover:bg-slate-800 transition-colors shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
