"use client";

import { useEffect, useState } from 'react';
import NewsModal from '@/components/admin/NewsModal';
import Cookies from 'js-cookie';
import { Plus, Edit, Trash2, FileText, Link as LinkIcon, Star, Search } from 'lucide-react';

export default function BeritaPage() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. STATE BARU UNTUK SORTING DAN FILTERING
  const [sortConfig, setSortConfig] = useState('date_desc'); // Opsi: 'date_desc', 'date_asc', 'title_asc', 'title_desc'
  const [filterStatus, setFilterStatus] = useState('all'); // Opsi: 'all', 'published', 'draft'

  const fetchNews = async () => {
    setLoading(true);
    const token = Cookies.get('auth_token');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news?admin=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (Array.isArray(data)) {
        setNews(data);
      } else if (data.data && Array.isArray(data.data)) {
        setNews(data.data);
      } else {
        console.error("Respons API bukan array yang valid:", data);
        setNews([]);
      }
    } catch (error) {
      console.error("Gagal mengambil data berita:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // 3. LOGIKA BARU UNTUK MEMPROSES FILTER, SEARCH, DAN SORT
  useEffect(() => {
    let processedNews = [...news];

    // Langkah 1: Filter berdasarkan status
    if (filterStatus !== 'all') {
      processedNews = processedNews.filter(item => item.status === filterStatus);
    }

    // Langkah 2: Filter berdasarkan query pencarian
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      processedNews = processedNews.filter(item =>
        item.title?.toLowerCase().includes(lowercasedQuery) ||
        item.excerpt?.toLowerCase().includes(lowercasedQuery) ||
        item.author?.toLowerCase().includes(lowercasedQuery) ||
        item.categories?.some(cat => cat.name.toLowerCase().includes(lowercasedQuery))
      );
    }

    // Langkah 3: Urutkan hasil
    processedNews.sort((a, b) => {
      const [sortBy, sortOrder] = sortConfig.split('_');

      if (sortBy === 'date') {
        const dateA = new Date(a.published_at || 0).getTime();
        const dateB = new Date(b.published_at || 0).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      if (sortBy === 'title') {
        const titleA = a.title || '';
        const titleB = b.title || '';
        if (sortOrder === 'asc') {
          return titleA.localeCompare(titleB);
        } else {
          return titleB.localeCompare(titleA);
        }
      }
      return 0;
    });

    setFilteredNews(processedNews);
  }, [news, searchQuery, sortConfig, filterStatus]); // Tambahkan state baru ke dependency array

  const handleOpenModal = (newsItem = null) => {
    setEditingNews(newsItem);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const handleSave = () => {
    handleCloseModal();
    fetchNews();
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      const token = Cookies.get('auth_token');
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${id}`, {
          method: 'DELETE',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        fetchNews();
      } catch (error) {
        console.error("Gagal menghapus berita:", error);
        alert("Gagal menghapus berita. Silakan coba lagi.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Asia/Jakarta'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };
  
  const renderCategories = (categories) => {
    if (!categories || categories.length === 0) {
      return '-';
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          <span key={cat.id} className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {cat.name}
          </span>
        ))}
      </div>
    );
  };

  const getThumbnailImage = (item) => {
    if (item.thumbnail_image && item.thumbnail_image.path) {
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.thumbnail_image.path}`;
    }
    
    if (item.images && item.images.length > 0) {
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.images[0].path}`;
    }
    
    return 'https://placehold.co/600x400/e2e8f0/64748b?text=No+Image';
  };

  const hasThumbnail = (item) => {
    return item.thumbnail_image_id && item.images && item.images.some(img => img.id === item.thumbnail_image_id);
  };
  
  const controlInputClass = "w-full pl-3 pr-8 py-2 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none";


  return (
    <>
      <div className="themed-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-2xl text-gray-900 dark:text-white">
            Manajemen Berita
          </h2>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> 
            Tambah Berita
          </button>
        </div>

        {/* 2. UI KONTROL BARU UNTUK SEARCH, SORT, DAN FILTER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cari Berita</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Judul, penulis..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Urutkan</label>
            <select id="sort" value={sortConfig} onChange={e => setSortConfig(e.target.value)} className={controlInputClass}>
              <option value="date_desc">Terbaru</option>
              <option value="date_asc">Terlama</option>
              <option value="title_asc">Judul (A-Z)</option>
              <option value="title_desc">Judul (Z-A)</option>
            </select>
          </div>
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter Status</label>
            <select id="filterStatus" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={controlInputClass}>
              <option value="all">Semua Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Memuat data...</span>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{searchQuery || filterStatus !== 'all' ? 'Tidak ada berita yang cocok dengan kriteria Anda' : 'Belum ada berita yang tersedia'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border-collapse">
              <thead className="themed-table-head">
                <tr>
                  <th className="w-[8%] text-left py-3 px-4 font-semibold">Gambar</th>
                  <th className="w-[20%] text-left py-3 px-4 font-semibold">Judul</th>
                  <th className="w-[20%] text-left py-3 px-4 font-semibold">Ringkasan</th>
                  <th className="w-[10%] text-left py-3 px-4 font-semibold">Penulis</th>
                  <th className="w-[15%] text-left py-3 px-4 font-semibold">Kategori</th>
                  <th className="w-[6%] text-left py-3 px-4 font-semibold">Status</th>
                  <th className="w-[4%] text-left py-3 px-4 font-semibold">PDF</th>
                  <th className="w-[4%] text-left py-3 px-4 font-semibold">Sumber</th>
                  <th className="w-[12%] text-left py-3 px-4 font-semibold">Tgl Publikasi</th>
                  <th className="w-[6%] text-left py-3 px-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((item) => (
                  <tr key={item.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4 align-top">
                      <div className="relative">
                        <img 
                          src={getThumbnailImage(item)} 
                          alt={item.title || 'News image'} 
                          className="h-12 w-16 object-cover rounded border"
                          onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = 'https://placehold.co/600x400/e2e8f0/64748b?text=Error'; 
                          }}
                        />
                        {hasThumbnail(item) && (
                          <div className="absolute -top-1 -right-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" title="Thumbnail set" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-normal break-words align-top">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {item.title || 'Untitled'}
                      </div>
                      {item.views > 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          👁️ {item.views} views
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-normal break-words text-sm text-gray-600 dark:text-gray-400 align-top">
                      <div className="line-clamp-3">
                        {item.excerpt || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4 align-top text-sm">
                      {item.author || '-'}
                    </td>
                    <td className="py-3 px-4 align-top">
                      {renderCategories(item.categories)}
                    </td>
                    <td className="py-3 px-4 align-top">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {item.status || 'draft'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center align-top">
                      {item.pdfs && item.pdfs.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {item.pdfs.map((pdf, index) => (
                            <a 
                              key={pdf.id || index}
                              href={`${process.env.NEXT_PUBLIC_API_URL}/storage/${pdf.path}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-red-500 hover:text-red-700 inline-block" 
                              title={pdf.title || pdf.original_name || 'Download PDF'}
                            >
                              <FileText size={16} />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center align-top">
                      {item.source_url ? (
                        <a 
                          href={item.source_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500 hover:text-blue-700 inline-block" 
                          title="Buka Sumber"
                        >
                          <LinkIcon size={16} />
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 align-top">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(item.published_at)}
                      </div>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleOpenModal(item)} 
                          className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)} 
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" 
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredNews.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <div>
              {`Menampilkan ${filteredNews.length} dari ${news.length} total berita`}
            </div>
            <div>
              Published: {news.filter(item => item.status === 'published').length} | 
              Draft: {news.filter(item => item.status === 'draft').length}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <NewsModal
          news={editingNews}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
}