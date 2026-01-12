"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const TechBackground: React.FC = () => {
  const [particles, setParticles] = useState<Array<{
    left: string;
    top: string;
    delay: string;
    duration: string;
  }> | null>(null);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${2 + Math.random() * 3}s`
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-30" viewBox="0 0 1200 600">
          <defs>
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M20 20h160M20 20v160M180 20v160M20 180h160"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                    fill="none" />
              <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.5)" />
              <circle cx="180" cy="20" r="3" fill="rgba(255,255,255,0.5)" />
              <circle cx="20" cy="180" r="3" fill="rgba(255,255,255,0.5)" />
              <circle cx="180" cy="180" r="3" fill="rgba(255,255,255,0.5)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {particles && (
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration
              }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0">
        <div className="tech-lines opacity-20"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
    </div>
  );
};

type NewsDetail = {
  id: number;
  title: string;
  excerpt?: string;
  slug: string;
  author?: string;
  published_at: string;
  status: string;
  source_url?: string;
  thumbnail_image_id?: number;
  views?: number;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    path: string;
    caption?: string;
    urutan?: number;
  }>;
  contents: Array<{
    id: number;
    type: string;
    content: string;
    urutan?: number;
  }>;
  pdfs: Array<{
    id: number;
    path: string;
    title?: string;
    description?: string;
    original_name?: string;
    file_type?: string;
    file_size?: number;
    urutan?: number;
    display_mode?: 'link' | 'embed';
  }>;
  tables?: Array<{
    id: number;
    nama_inovasi: string;
    uraian: string;
    link?: string;
    urutan: number;
  }>;
};

const formatTanggal = (tanggal: string) => {
  if (!tanggal) return '';
  const date = new Date(tanggal);
  return date.toLocaleDateString("id-ID", {
    weekday: 'long',
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatFileSize = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FormattedContent: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return null;
  const cleanText = content.replace(/<[^>]*>/g, '');
  return (
    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
      {cleanText}
    </div>
  );
};

const InnovationTable: React.FC<{ tables: NewsDetail['tables'] }> = ({ tables }) => {
  if (!tables || tables.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b-2 border-blue-500 pb-3">
        Daftar Tabel
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-gray-300 p-3 text-left font-semibold text-blue-800">No</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-blue-800">Nama Inovasi</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-blue-800">Uraian</th>
              <th className="border border-gray-300 p-3 text-left font-semibold text-blue-800">Link</th>
            </tr>
          </thead>
          <tbody>
            {tables
              .sort((a, b) => (a.urutan || 0) - (b.urutan || 0))
              .map((table, index) => (
                <tr key={table.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="border border-gray-300 p-3 font-medium text-gray-700">
                    {table.urutan || index + 1}
                  </td>
                  <td className="border border-gray-300 p-3 font-semibold text-blue-700">
                    {table.nama_inovasi}
                  </td>
                  <td className="border border-gray-300 p-3 text-gray-600 leading-relaxed">
                    {table.uraian}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {table.link ? (
                      <a
                        href={table.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                        </svg>
                        Buka Link
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">Tidak ada link</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NewsDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<NewsDetail['tables']>([]);

  useEffect(() => {
    const fetchNewsDetail = async () => {
        if (!slug) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/slug/${slug}`, {
                headers: { 'Accept': 'application/json' },
            });
            if (!response.ok) {
                throw new Error('Gagal mengambil data berita');
            }
            const data = await response.json();
            if (data.status !== 'published') {
                throw new Error('Berita tidak ditemukan atau belum dipublikasikan');
            }
            setNews(data);
            
            if (data.id) {
              try {
                const tablesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news/${data.id}/tables`, {
                  headers: { 'Accept': 'application/json' },
                });
                if (tablesResponse.ok) {
                  const tablesData = await tablesResponse.json();
                  setTables(tablesData);
                }
              } catch (tableError) {
                console.error("Error fetching tables:", tableError);
              }
            }
        } catch (error) {
            console.error("Error fetching news detail:", error);
            setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
        } finally {
            setLoading(false);
        }
    };
    fetchNewsDetail();
  }, [slug]);

  const handleBack = () => {
    router.push('/berita');
  };

  const getContentImages = () => {
    if (!news?.images || news.images.length === 0) return [];
    return news.images.filter(img => {
      if (news.thumbnail_image_id && img.id === news.thumbnail_image_id) {
        return false;
      }
      return true;
    }).sort((a, b) => (a.urutan || 0) - (b.urutan || 0));
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 pt-32 pb-24">
          <TechBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="animate-pulse text-left">
              <div className="h-6 bg-white/20 rounded w-48 mb-8"></div>
              <div className="h-12 bg-white/20 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-white/20 rounded w-1/2"></div>
            </div>
          </div>
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 opacity-60" />
          <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/30 rotate-12 opacity-40" />
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !news) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 pt-32 pb-24">
          <TechBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <nav className="mb-8">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/berita" className="hover:text-white transition-colors">Berita</Link>
                <span>/</span>
                <span className="text-white font-semibold">Error</span>
              </div>
            </nav>

            <h1 className="text-4xl font-bold text-white mb-4">Berita Tidak Ditemukan</h1>
            <p className="text-xl text-white/90 mb-6">{error || 'Berita tidak ditemukan'}</p>
            
            <button
              onClick={handleBack}
              className="px-8 py-4 bg-white text-red-600 font-bold border-2 border-white hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
            >
              Kembali ke Daftar Berita
            </button>
          </div>
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 opacity-60" />
          <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/30 rotate-12 opacity-40" />
        </div>
      </main>
    );
  }

  const contentImages = getContentImages();
  const allContent = [
    ...contentImages.map(img => ({ ...img, type: 'image', order: img.urutan || 0 })),
    ...news.contents.map(content => ({ ...content, order: content.urutan || 0 })),
    ...news.pdfs.map(pdf => ({ ...pdf, type: 'pdf', order: pdf.urutan || 0 }))
  ].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 pt-32 pb-24">
        <TechBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <nav className="mb-6">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/berita" className="hover:text-white transition-colors">Berita</Link>
              <span>/</span>
              <span className="text-white font-semibold">Detail</span>
            </div>
          </nav>

          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight text-left">
              {news.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90 mb-4">
              {news.author && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>Oleh {news.author}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{formatTanggal(news.published_at)}</span>
              </div>

              {news.views && news.views > 0 && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span>{news.views} views</span>
                </div>
              )}
            </div>

            {news.categories && news.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {news.categories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/berita/kategori/${cat.slug}`}
                    className="px-3 py-1 text-xs font-bold bg-white/20 text-white hover:bg-white hover:text-blue-700 transition-all duration-300"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 opacity-60" />
        <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/30 rotate-12 opacity-40" />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Daftar Berita
            </button>
          </nav>

          {tables && tables.length > 0 && (
            <InnovationTable tables={tables} />
          )}

          <article className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {allContent.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Tidak ada konten untuk ditampilkan.</p>
              </div>
            ) : (
              allContent.map((item, index) => {
                if ('type' in item && item.type === 'image') {
                  const imageItem = item as typeof news.images[0] & { type: string };
                  return (
                    <figure key={`image-${imageItem.id}-${index}`} className="my-6">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${imageItem.path}`}
                        alt={imageItem.caption || news.title}
                        className="w-full rounded-lg shadow-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/image/DINAS KOMUNIKASI DAN INFORMATIKA KOTA MADIUN.png'; }}
                      />
                      {imageItem.caption && (
                        <figcaption className="text-center text-gray-600 text-sm mt-3 italic">
                          {imageItem.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if ('type' in item && item.type === 'pdf') {
                  const docItem = item as (typeof news.pdfs)[0] & { type: string, display_mode?: 'link' | 'embed' };
                  const isPdf = docItem.file_type?.toLowerCase() === 'pdf' || docItem.original_name?.toLowerCase().endsWith('.pdf');
                  const isWord = ['doc', 'docx'].includes(docItem.file_type?.toLowerCase() || '') || docItem.original_name?.toLowerCase().endsWith('.doc') || docItem.original_name?.toLowerCase().endsWith('.docx');

                  const docInfoCard = (
                    <div key={`doc-info-${docItem.id}-${index}`} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 my-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {isPdf && (
                            <div className="w-12 h-12 bg-red-100 border-2 border-red-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          {isWord && (
                            <div className="w-12 h-12 bg-blue-100 border-2 border-blue-200 flex items-center justify-center">
                               <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm5 6a.5.5 0 00-1 0v2.586l-1.293-1.293a.5.5 0 00-.707.707l2 2a.5.5 0 00.707 0l2-2a.5.5 0 10-.707-.707L10 12.586V10a.5.5 0 00-1 0z" clipRule="evenodd" />
                                <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor">W</text>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-800 mb-1">
                            {docItem.title || docItem.original_name || 'Dokumen'}
                          </h4>
                          {docItem.description && (
                            <p className="text-gray-600 mb-2">{docItem.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            {docItem.file_size && (
                              <span>Ukuran: {formatFileSize(docItem.file_size)}</span>
                            )}
                             {isPdf && <span>Format: PDF</span>}
                             {isWord && <span>Format: Word Document</span>}
                          </div>
                          <div className="flex gap-3">
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL}/api/pdfs/download/${docItem.id}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-bold border-2 border-blue-600 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  
                  if (isPdf && docItem.display_mode === 'embed') {
                    return (
                      <div key={`doc-block-${docItem.id}-${index}`}>
                        {docInfoCard}
                        <div className="mt-4 border rounded-lg overflow-hidden">
                          <iframe
                            src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${docItem.path}`}
                            title={docItem.title || 'Tampilan PDF'}
                            className="w-full h-[800px] border-none"
                            aria-label="PDF Viewer"
                          >
                            Browser Anda tidak mendukung tampilan PDF. Silakan klik tombol download.
                          </iframe>
                        </div>
                      </div>
                    );
                  }
                  
                  return docInfoCard;
                }

                if ('content' in item) {
                  const contentItem = item as typeof news.contents[0];
                  if (contentItem.type === 'heading') {
                    return (
                      <h2 key={`content-${contentItem.id}-${index}`} className="text-2xl font-bold text-gray-800 my-6">
                        {contentItem.content}
                      </h2>
                    );
                  }
                  if (contentItem.type === 'paragraph') {
                    return (
                      <div key={`content-${contentItem.id}-${index}`} className="my-6">
                        <FormattedContent content={contentItem.content} />
                      </div>
                    );
                  }
                }
                return null;
              })
            )}

            {news.source_url && (
              <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200">
                <p className="text-sm font-bold text-blue-700 mb-2">Link :</p>
                <a
                  href={news.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all underline"
                >
                  {news.source_url}
                </a>
              </div>
            )}
          </article>
        </div>
      </div>
    </main>
  );
};

export default NewsDetailPage;