"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

// Komponen TechBackground yang diperbaiki untuk menghindari hydration mismatch
const TechBackground: React.FC = () => {
  const [isClient, setIsClient] = useState(false)
  const [particles, setParticles] = useState<Array<{
    id: number
    left: number
    top: number
    delay: number
    duration: number
  }>>([])

  useEffect(() => {
    setIsClient(true)
    
    // Generate particles hanya di client side
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
    }))
    
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Hanya render particles setelah client-side hydration */}
      {isClient && particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
    </div>
  )
}

// Interface untuk breadcrumb item
interface BreadcrumbItem {
  label: string
  href?: string
}

// Props untuk TechHeader
interface TechHeaderProps {
  title: string
  breadcrumbItems?: BreadcrumbItem[]
  description?: string
}

// Komponen TechHeader yang disederhanakan
const TechHeader: React.FC<TechHeaderProps> = ({ title, breadcrumbItems = [], description }) => {
  return (
    <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 pt-20 pb-16 min-h-[400px] flex items-center">
      <TechBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {breadcrumbItems.length > 0 && (
          <nav className="mb-8">
            <div className="flex items-center gap-2 text-sm text-white/80 flex-wrap">
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={index}>
                  {item.href ? (
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className={index === breadcrumbItems.length - 1 ? "text-white font-semibold" : ""}>
                      {item.label}
                    </span>
                  )}
                  {index < breadcrumbItems.length - 1 && <span className="text-white/60">|</span>}
                </React.Fragment>
              ))}
            </div>
          </nav>
        )}

        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">{title}</h1>

          {description && <p className="text-xl text-white/90 max-w-3xl mb-6 leading-relaxed">{description}</p>}
        </div>
      </div>

      <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 opacity-60" />
      <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/30 rotate-12 opacity-40" />
    </div>
  )
}

type NewsItem = {
  id: number
  title: string
  excerpt?: string
  slug: string
  author?: string
  published_at: string
  status: string
  categories: Array<{
    id: number
    name: string
  }>
  images: Array<{
    id: number
    path: string
    caption?: string
    urutan?: number
  }>
  contents: Array<{
    id: number
    type: string
    content: string
  }>
  thumbnailImage?: {
    id: number
    path: string
    caption?: string
  }
  thumbnail_image_id?: number
}

// Format tanggal Indonesia
const formatTanggal = (tanggal: string): string => {
  if (!tanggal) return ""
  const date = new Date(tanggal)
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// Fungsi untuk mendapatkan gambar thumbnail
const getThumbnailImage = (newsItem: NewsItem): string => {
  if (newsItem.thumbnailImage) {
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${newsItem.thumbnailImage.path}`
  }

  if (newsItem.thumbnail_image_id && newsItem.images) {
    const thumbnailImage = newsItem.images.find((img) => img.id === newsItem.thumbnail_image_id)
    if (thumbnailImage) {
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${thumbnailImage.path}`
    }
  }

  if (newsItem.images && newsItem.images.length > 0) {
    const sortedImages = [...newsItem.images].sort((a, b) => (a.urutan || 0) - (b.urutan || 0))
    return `${process.env.NEXT_PUBLIC_API_URL}/storage/${sortedImages[0].path}`
  }

  return "/image/thumbnail.png"
}

// Fungsi untuk highlight text yang cocok dengan pencarian
const highlightSearchTerm = (text: string, searchTerm: string): React.ReactNode => {
  if (!searchTerm.trim()) return text

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 text-gray-900 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

// Props untuk NewsCard
interface NewsCardProps {
  news: NewsItem
  searchTerm?: string
}

// Komponen NewsCard yang disederhanakan
const NewsCard: React.FC<NewsCardProps> = ({ news, searchTerm = "" }) => {
  const router = useRouter()

  const handleCategoryClick = (e: React.MouseEvent, categoryId: number): void => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/berita/kategori/${categoryId}`)
  }

  const getDescription = (): string => {
    if (news.excerpt) return news.excerpt

    const firstContent = news.contents?.find((content) => content.type === "paragraph")
    if (firstContent) {
      const plainText = firstContent.content.replace(/<[^>]*>/g, "")
      return plainText.length > 100 ? plainText.substring(0, 100) + "..." : plainText
    }

    return "Baca selengkapnya untuk mengetahui informasi detail tentang berita ini."
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement
    target.src = "/image/thumbnail.png"
  }

  return (
    <article className="group bg-white border-2 border-gray-200 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:border-blue-500 hover:bg-blue-50">
      <div
        className="relative h-64 overflow-hidden cursor-pointer bg-gray-100"
        onClick={() => router.push(`/berita/${news.slug}`)}
      >
        <img
          src={getThumbnailImage(news) || "/placeholder.svg"}
          alt={news.title}
          className="object-cover w-full h-full transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-110"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="p-6 relative z-10">
        {news.categories && news.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {news.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={(e) => handleCategoryClick(e, cat.id)}
                className="px-3 py-1.5 text-xs font-bold border-2 border-blue-200 text-blue-700 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                {highlightSearchTerm(cat.name, searchTerm)}
              </button>
            ))}
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">
          <Link href={`/berita/${news.slug}`} className="hover:text-blue-700 transition-colors duration-300">
            {highlightSearchTerm(news.title, searchTerm)}
          </Link>
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {highlightSearchTerm(getDescription(), searchTerm)}
        </p>

        <div className="flex flex-col gap-3 text-xs text-gray-500 mb-6 group-hover:text-gray-600 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
              <svg
                className="w-3 h-3 text-gray-600 group-hover:text-blue-600 transition-colors duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span>
              Diposting oleh{" "}
              <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                {news.author || "Admin"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
              <svg
                className="w-3 h-3 text-gray-600 group-hover:text-blue-600 transition-colors duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>
              pada{" "}
              <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                {formatTanggal(news.published_at)}
              </span>
            </span>
          </div>
        </div>

        <Link
          href={`/berita/${news.slug}`}
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-bold text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 group/button"
        >
          Baca Selengkapnya
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

const SearchResultsPage: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""

  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [totalResults, setTotalResults] = useState<number>(0)
  const itemsPerPage = 12

  const fetchSearchResults = async (pageNum = 1, append = false): Promise<void> => {
    if (!query.trim()) return

    if (!append) {
      setLoading(true)
      setError(null)
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
        headers: { Accept: "application/json" },
      })

      if (!response.ok) throw new Error("Gagal mengambil data berita")

      const allNews: NewsItem[] = await response.json()

      // Filter berita berdasarkan pencarian
      const filteredNews = allNews.filter((newsItem) => {
        if (newsItem.status !== "published") return false

        const searchTerm = query.toLowerCase()
        const titleMatch = newsItem.title.toLowerCase().includes(searchTerm)
        const excerptMatch = newsItem.excerpt?.toLowerCase().includes(searchTerm)
        const categoryMatch = newsItem.categories.some((cat) => cat.name.toLowerCase().includes(searchTerm))
        const contentMatch = newsItem.contents?.some((content) => content.content.toLowerCase().includes(searchTerm))

        return titleMatch || excerptMatch || categoryMatch || contentMatch
      })

      // Sort by relevance and date
      const sortedNews = filteredNews.sort((a, b) => {
        const searchTerm = query.toLowerCase()

        // Prioritize title matches
        const aTitleMatch = a.title.toLowerCase().includes(searchTerm) ? 1 : 0
        const bTitleMatch = b.title.toLowerCase().includes(searchTerm) ? 1 : 0

        if (aTitleMatch !== bTitleMatch) {
          return bTitleMatch - aTitleMatch
        }

        // Then sort by date
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      })

      setTotalResults(sortedNews.length)

      const startIndex = (pageNum - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedNews = sortedNews.slice(0, endIndex)

      if (append) {
        setNews((prev) => [...prev, ...paginatedNews.slice(startIndex)])
      } else {
        setNews(paginatedNews)
      }

      setHasMore(endIndex < sortedNews.length)
    } catch (error) {
      console.error("Error fetching search results:", error)
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (query) {
      fetchSearchResults(1, false)
    } else {
      setLoading(false)
      setNews([])
      setTotalResults(0)
    }
  }, [query])

  const loadMore = (): void => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchSearchResults(nextPage, true)
  }

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    return [{ label: "Home", href: "/" }, { label: "Berita", href: "/berita" }, { label: `Pencarian: "${query}"` }]
  }

  // Loading state
  if (loading && news.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <TechHeader
          title="Mencari Berita..."
          breadcrumbItems={getBreadcrumbItems()}
          description={`Mencari berita dengan kata kunci "${query}"`}
        />

        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border-2 border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200"></div>
                    <div className="h-4 bg-gray-200"></div>
                    <div className="h-4 bg-gray-200 w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 pt-20 pb-16 min-h-[400px] flex items-center">
          <TechBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Terjadi Kesalahan</h1>
            <p className="text-xl text-white/90 mb-6">{error}</p>
            <button
              onClick={() => router.push("/berita")}
              className="px-8 py-4 bg-white text-red-600 font-bold border-2 border-white hover:bg-red-50 transition-all duration-300"
            >
              Kembali ke Daftar Berita
            </button>
          </div>
        </div>
      </main>
    )
  }

  // No query
  if (!query.trim()) {
    return (
      <main className="min-h-screen bg-gray-50">
        <TechHeader
          title="Pencarian Berita"
          breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Berita", href: "/berita" }, { label: "Pencarian" }]}
          description="Masukkan kata kunci untuk mencari berita"
        />

        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Silakan Masukkan Kata Kunci Pencarian</h2>
            <p className="text-gray-600 mb-8">Gunakan kotak pencarian untuk mencari berita yang Anda inginkan.</p>
            <button
              onClick={() => router.push("/berita")}
              className="px-8 py-4 bg-blue-500 text-white font-bold border-2 border-blue-600 hover:bg-blue-600 transition-all duration-300"
            >
              Lihat Semua Berita
            </button>
          </div>
        </div>
      </main>
    )
  }

  // No results found
  if (!loading && news.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <TechHeader
          title={`Pencarian: "${query}"`}
          breadcrumbItems={getBreadcrumbItems()}
          description="Tidak ada hasil yang ditemukan"
        />

        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Tidak Ada Hasil untuk "{query}"</h2>
            <p className="text-gray-600 mb-8">
              Coba gunakan kata kunci yang berbeda atau periksa ejaan kata kunci Anda.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push("/berita")}
                className="px-8 py-4 bg-blue-500 text-white font-bold border-2 border-blue-600 hover:bg-blue-600 transition-all duration-300"
              >
                Lihat Semua Berita
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-8 py-4 bg-gray-500 text-white font-bold border-2 border-gray-600 hover:bg-gray-600 transition-all duration-300"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <TechHeader
        title={`Pencarian: "${query}"`}
        breadcrumbItems={getBreadcrumbItems()}
        description={`Ditemukan ${totalResults} berita yang sesuai dengan pencarian Anda`}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Back Button dan Info Hasil */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <button
              onClick={() => router.push("/berita")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Daftar Berita
            </button>

            <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border-2 border-gray-200">
              Menampilkan {news.length} dari {totalResults} hasil untuk
              <span className="font-bold text-blue-600 ml-1">"{query}"</span>
            </div>
          </div>

          {/* Grid Berita */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {news.map((newsItem, index) => (
              <div key={newsItem.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <NewsCard news={newsItem} searchTerm={query} />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-10 py-4 bg-blue-500 text-white font-bold border-2 border-blue-600 hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memuat Lebih Banyak..." : `Muat Lebih Banyak (${totalResults - news.length} tersisa)`}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  )
}

export default SearchResultsPage