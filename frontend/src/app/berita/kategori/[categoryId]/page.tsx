"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

// Updated TechBackground yang diperbaiki untuk menghindari hydration mismatch
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
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
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
      {/* Grid pattern */}
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
      
      {/* Circuit lines */}
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

      {/* Floating particles - hanya render setelah client-side hydration */}
      <div className="absolute inset-0">
        {isClient && particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>

      {/* Animated lines */}
      <div className="absolute inset-0">
        <div className="tech-lines opacity-20"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
    </div>
  )
}

// Interface untuk breadcrumb item
interface BreadcrumbItem {
  label: string
  href?: string
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

type Category = {
  id: number
  name: string
  description?: string
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

// Props untuk NewsCard
interface NewsCardProps {
  news: NewsItem
}

// Komponen NewsCard yang disederhanakan
const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
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
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors duration-300">
          <Link href={`/berita/${news.slug}`} className="hover:text-blue-700 transition-colors duration-300">
            {news.title}
          </Link>
        </h3>

        <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {getDescription()}
        </p>

        <div className="flex flex-col gap-3 text-xs text-gray-500 mb-6 group-hover:text-gray-600 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
              <svg className="w-3 h-3 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <span>
              Diposting oleh <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">{news.author || "Admin"}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
              <svg className="w-3 h-3 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <span>
              pada <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">{formatTanggal(news.published_at)}</span>
            </span>
          </div>
        </div>

        <Link
          href={`/berita/${news.slug}`}
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-bold text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 group/button"
        >
          Baca Selengkapnya
          <svg className="w-4 h-4 transition-transform duration-300 group-hover/button:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  )
}

const CategoryPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.categoryId as string

  const [category, setCategory] = useState<Category | null>(null)
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const itemsPerPage = 12

  const fetchCategoryAndNews = async (pageNum: number = 1, append: boolean = false): Promise<void> => {
    if (!categoryId) return

    if (!append) {
      setLoading(true)
      setError(null)
    }

    try {
      const newsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
        headers: { Accept: "application/json" },
      })

      if (!newsResponse.ok) throw new Error("Gagal mengambil data berita")

      const allNews: NewsItem[] = await newsResponse.json()
      const filteredNews = allNews.filter(
        (newsItem) =>
          newsItem.status === "published" && 
          newsItem.categories.some((cat) => cat.id === parseInt(categoryId))
      )

      const sortedNews = filteredNews.sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      )

      const startIndex = (pageNum - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedNews = sortedNews.slice(0, endIndex)

      if (sortedNews.length > 0) {
        const categoryData = sortedNews[0].categories.find(
          (cat) => cat.id === parseInt(categoryId)
        )
        if (categoryData) setCategory(categoryData)
      }

      if (append) {
        setNews((prev) => [...prev, ...paginatedNews.slice(startIndex)])
      } else {
        setNews(paginatedNews)
      }

      setHasMore(endIndex < sortedNews.length)
    } catch (error) {
      console.error("Error fetching category and news:", error)
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryAndNews(1, false)
  }, [categoryId])

  const loadMore = (): void => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchCategoryAndNews(nextPage, true)
  }

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    return [
      { label: "Home", href: "/" },
      { label: "Berita", href: "/berita" },
      { label: category?.name || "Kategori" }
    ]
  }

  // Loading state
  if (loading && news.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section untuk Loading - matching BeritaPage */}
        <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 pt-20 pb-16">
          <TechBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-white/20 rounded w-48 mb-8 mx-auto"></div>
              <div className="h-12 bg-white/20 rounded w-3/4 mb-4 mx-auto"></div>
              <div className="h-6 bg-white/20 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          {/* Tech decorations */}
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 opacity-60" />
          <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/30 rotate-12 opacity-40" />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full opacity-50" />
        </div>
        
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto">
            <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border-2 border-gray-200 overflow-hidden animate-pulse" style={{ borderRadius: '0px' }}>
                  <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 w-20" style={{ borderRadius: '0px' }}></div>
                      <div className="h-6 bg-gray-200 w-16" style={{ borderRadius: '0px' }}></div>
                    </div>
                    <div className="h-6 bg-gray-200 mb-3 w-4/5" style={{ borderRadius: '0px' }}></div>
                    <div className="h-4 bg-gray-200 mb-2" style={{ borderRadius: '0px' }}></div>
                    <div className="h-4 bg-gray-200 mb-2" style={{ borderRadius: '0px' }}></div>
                    <div className="h-4 bg-gray-200 w-3/4 mb-6" style={{ borderRadius: '0px' }}></div>
                    <div className="space-y-3 mb-6">
                      <div className="h-3 bg-gray-200 w-40" style={{ borderRadius: '0px' }}></div>
                      <div className="h-3 bg-gray-200 w-32" style={{ borderRadius: '0px' }}></div>
                    </div>
                    <div className="h-12 bg-gray-200" style={{ borderRadius: '0px' }}></div>
                  </div>
                </div>
              ))}
            </section>
          </div>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section untuk Error - matching BeritaPage */}
        <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 pt-20 pb-16">
          <TechBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <nav className="mb-8">
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>|</span>
                <Link href="/berita" className="hover:text-white transition-colors">Berita</Link>
                <span>|</span>
                <span className="text-white font-semibold">Error</span>
              </div>
            </nav>

            <div className="text-white text-6xl mb-4">⚠️</div>
            <h1 className="text-5xl font-bold text-white mb-4">Kategori Tidak Ditemukan</h1>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">{error}</p>
            
            <button
              onClick={() => router.push("/berita")}
              className="px-8 py-4 bg-white text-red-600 font-bold border-2 border-white hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
              style={{ borderRadius: '0px' }}
            >
              Kembali ke Daftar Berita
            </button>
          </div>
          {/* Tech decorations */}
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 opacity-60" />
          <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/30 rotate-12 opacity-40" />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full opacity-50" />
        </div>
      </main>
    )
  }

  // No news found
  if (!loading && news.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section untuk No News - matching BeritaPage */}
        <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 pt-20 pb-16">
          <TechBackground />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>|</span>
                <Link href="/berita" className="hover:text-white transition-colors">Berita</Link>
                <span>|</span>
                <span className="text-white font-semibold">{category?.name || "Kategori"}</span>
              </div>
            </nav>

            <h1 className="text-5xl font-bold text-white mb-4">Kategori: {category?.name || "Kategori"}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Belum ada berita untuk kategori ini</p>
          </div>
          {/* Tech decorations */}
          <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 opacity-60" />
          <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/30 rotate-12 opacity-40" />
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full opacity-50" />
        </div>
        
        <div className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto text-center py-20">
            <div
              className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 border-4 border-gray-300 mb-6"
              style={{ borderRadius: '0px' }}
            >
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Belum Ada Berita untuk Kategori {category?.name || "Ini"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">Silakan periksa kategori lain atau kembali nanti.</p>
            <button
              onClick={() => router.push("/berita")}
              className="px-8 py-4 bg-blue-500 text-white font-bold border-2 border-blue-600 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
              style={{ borderRadius: '0px' }}
            >
              Kembali ke Daftar Berita
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section dengan Tech Background - matching BeritaPage */}
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 pt-20 pb-16">
        <TechBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-white/80">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>|</span>
              <Link href="/berita" className="hover:text-white transition-colors">
                Berita
              </Link>
              <span>|</span>
              <span className="text-white font-semibold">{category?.name || "Kategori"}</span>
            </div>
          </nav>

          <h1 className="text-5xl font-bold text-white mb-4">Kategori : {category?.name || "Kategori"}</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">Berita terkini untuk kategori {category?.name || "ini"} - {news.length} berita ditemukan</p>
        </div>

        {/* Tech decorations */}
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 opacity-60" />
        <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/30 rotate-12 opacity-40" />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full opacity-50" />
      </div>

      {/* Content Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <nav className="mb-8">
            <button 
              onClick={() => router.push("/berita")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105"
              style={{ borderRadius: '0px' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Daftar Berita
            </button>
          </nav>

          {/* Grid berita dengan spacing yang sama seperti BeritaPage */}
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            {news.map((newsItem, index) => (
              <div key={newsItem.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 150}ms` }}>
                <NewsCard news={newsItem} />
              </div>
            ))}
          </section>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-10 py-4 bg-blue-500 text-white font-bold border-2 border-blue-600 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: '0px' }}
              >
                {loading ? "Memuat Berita..." : "Muat Lebih Banyak Berita"}
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

export default CategoryPage