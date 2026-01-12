"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Komponen untuk Animated Tech Background
const TechBackground: React.FC = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Circuit lines */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-30" viewBox="0 0 1200 600">
          <defs>
            <pattern id="circuit" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path
                d="M20 20h160M20 20v160M180 20v160M20 180h160"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.5)" />
              <circle cx="180" cy="20" r="3" fill="rgba(255,255,255,0.5)" />
              <circle cx="20" cy="180" r="3" fill="rgba(255,255,255,0.5)" />
              <circle cx="180" cy="180" r="3" fill="rgba(255,255,255,0.5)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Floating particles - hanya render di client */}
      {isClient && (
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Animated lines */}
      <div className="absolute inset-0">
        <div className="tech-lines opacity-20"></div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
    </div>
  )
}

// Tipe data berita sesuai dengan struktur dari admin
interface NewsItem {
  id: number
  title: string
  excerpt?: string
  slug: string
  author?: string
  published_at: string
  status: string
  views?: number
  source_url?: string
  thumbnail_image_id?: number
  categories: Array<{
    id: number
    name: string
  }>
  images: Array<{
    id: number
    path: string
    caption?: string
    urutan: number
  }>
  contents: Array<{
    id: number
    type: string
    content: string
  }>
  pdfs: Array<{
    id: number
    path: string
    title?: string
    description?: string
  }>
  thumbnailImage?: {
    id: number
    path: string
    caption?: string
  }
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

// Format waktu relatif
const formatRelativeTime = (tanggal: string): string => {
  if (!tanggal) return ""
  const date = new Date(tanggal)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Hari ini"
  if (diffInDays === 1) return "1 hari lalu"
  if (diffInDays < 7) return `${diffInDays} hari lalu`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} minggu lalu`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} bulan lalu`
  return `${Math.floor(diffInDays / 365)} tahun lalu`
}

// Komponen untuk Berita Populer dengan layout seperti gambar
const PopularNewsSection: React.FC<{ popularNews: NewsItem[] }> = ({ popularNews }) => {
  const router = useRouter()

  if (!popularNews || popularNews.length === 0) return null

  const mainNews = popularNews[0] // Berita utama (kiri)
  const sideNews = popularNews.slice(1, 5) // Berita samping (kanan, maksimal 4)

  const getImageUrl = (news: NewsItem): string => {
    if (news.thumbnailImage) {
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${news.thumbnailImage.path}`
    }

    if (news.thumbnail_image_id && news.images) {
      const thumbnailImage = news.images.find((img) => img.id === news.thumbnail_image_id)
      if (thumbnailImage) {
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${thumbnailImage.path}`
      }
    }

    if (news.images && news.images.length > 0) {
      const sortedImages = [...news.images].sort((a, b) => a.urutan - b.urutan)
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${sortedImages[0].path}`
    }

    return "/image/thumbnail.png"
  }

  const handleNewsClick = (slug: string) => {
    router.push(`/berita/${slug}`)
  }

  const handleCategoryClick = (e: React.MouseEvent, categoryId: number) => {
    e.stopPropagation()
    router.push(`/berita/kategori/${categoryId}`)
  }

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">BERITA POPULER</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Berita Utama - Kiri (2/3 width) */}
        <div className="lg:col-span-2">
          <article
            className="relative h-96 bg-cover bg-center cursor-pointer group overflow-hidden"
            style={{
              backgroundImage: `url(${getImageUrl(mainNews)})`,
              borderRadius: "8px",
            }}
            onClick={() => handleNewsClick(mainNews.slug)}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              {/* Category badge */}
              {mainNews.categories && mainNews.categories.length > 0 && (
                <button
                  onClick={(e) => handleCategoryClick(e, mainNews.categories[0].id)}
                  className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-semibold mb-4 hover:bg-orange-600 transition-colors"
                  style={{ borderRadius: "4px" }}
                >
                  {mainNews.categories[0].name}
                </button>
              )}

              <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-orange-300 transition-colors">
                {mainNews.title}
              </h3>

              {/* Read more button */}
              <div className="flex items-center gap-2 text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>Baca Selengkapnya</span>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </article>
        </div>

        {/* Berita Samping - Kanan (1/3 width) */}
        <div className="space-y-4">
          {sideNews.map((news, index) => (
            <article
              key={news.id}
              className="flex gap-4 group cursor-pointer"
              onClick={() => handleNewsClick(news.slug)}
            >
              {/* Image */}
              <div className="flex-shrink-0 w-20 h-16 bg-gray-200 overflow-hidden" style={{ borderRadius: "4px" }}>
                <img
                  src={getImageUrl(news) || "/placeholder.svg"}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/image/thumbnail.png"
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
                  {news.title}
                </h4>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="text-orange-500 font-medium">Popular News</span>
                  <span>•</span>
                  <span>{formatRelativeTime(news.published_at)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// Loading skeleton untuk berita populer baru
const PopularNewsLoadingSkeleton: React.FC = () => (
  <section className="mb-16">
    <div className="flex items-center gap-3 mb-8">
      <div className="h-8 bg-gray-200 w-64 animate-pulse"></div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main news skeleton */}
      <div className="lg:col-span-2">
        <div className="h-96 bg-gray-200 animate-pulse" style={{ borderRadius: "8px" }}>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="h-6 bg-gray-300 w-20 mb-4" style={{ borderRadius: "4px" }}></div>
            <div className="h-8 bg-gray-300 mb-3 w-3/4" style={{ borderRadius: "4px" }}></div>
            <div className="h-4 bg-gray-300 w-32" style={{ borderRadius: "4px" }}></div>
          </div>
        </div>
      </div>

      {/* Side news skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-20 h-16 bg-gray-200" style={{ borderRadius: "4px" }}></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 mb-2 w-full" style={{ borderRadius: "4px" }}></div>
              <div className="h-4 bg-gray-200 mb-2 w-3/4" style={{ borderRadius: "4px" }}></div>
              <div className="h-3 bg-gray-200 w-24" style={{ borderRadius: "4px" }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// Komponen kartu berita dengan desain siku dan animasi meriah
const NewsCard: React.FC<{ news: NewsItem; index: number }> = ({ news, index }) => {
  const router = useRouter()

  // Fungsi untuk navigasi ke halaman kategori
  const handleCategoryClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    categoryId: number,
    categoryName: string,
  ): void => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/berita/kategori/${categoryId}`)
  }

  // Fungsi untuk navigasi ke detail berita saat gambar diklik
  const handleImageClick = (e: React.MouseEvent): void => {
    e.preventDefault()
    router.push(`/berita/${news.slug}`)
  }

  // Fungsi untuk mengambil gambar thumbnail yang sudah diset dari admin
  const getImageUrl = (): string => {
    // Prioritas 1: Gunakan thumbnail yang sudah diset dari admin (relasi thumbnailImage)
    if (news.thumbnailImage) {
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${news.thumbnailImage.path}`
    }

    // Prioritas 2: Cari gambar berdasarkan thumbnail_image_id
    if (news.thumbnail_image_id && news.images) {
      const thumbnailImage = news.images.find((img) => img.id === news.thumbnail_image_id)
      if (thumbnailImage) {
        return `${process.env.NEXT_PUBLIC_API_URL}/storage/${thumbnailImage.path}`
      }
    }

    // Prioritas 3: Gunakan gambar pertama berdasarkan urutan
    if (news.images && news.images.length > 0) {
      // Sort berdasarkan urutan, kemudian ambil yang pertama
      const sortedImages = [...news.images].sort((a, b) => a.urutan - b.urutan)
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${sortedImages[0].path}`
    }

    // Prioritas 4: Fallback ke gambar default
    return "/image/thumbnail.png"
  }

  // Ambil deskripsi dari excerpt atau content pertama
  const getDescription = (): string => {
    if (news.excerpt) {
      return news.excerpt
    }

    // Jika tidak ada excerpt, ambil dari content pertama
    const firstContent = news.contents?.find((content) => content.type === "paragraph")
    if (firstContent) {
      // Hapus HTML tags dan batasi panjang
      const plainText = firstContent.content.replace(/<[^>]*>/g, "")
      return plainText.length > 100 ? plainText.substring(0, 100) + "..." : plainText
    }

    return "Baca selengkapnya untuk mengetahui informasi detail tentang berita ini."
  }

  return (
    <article
      className="group relative bg-white border-2 border-gray-200 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:border-blue-500 hover:bg-blue-50 news-card"
      style={{
        animationDelay: `${index * 150}ms`,
        borderRadius: "0px", // Bentuk siku
      }}
    >
      {/* Animated lines effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="animated-lines"></div>
      </div>

      {/* Image Container with Click Handler */}
      <div className="relative h-64 overflow-hidden cursor-pointer bg-gray-100" onClick={handleImageClick}>
        <img
          src={getImageUrl() || "/placeholder.svg"}
          alt={news.title}
          className="object-cover w-full h-full transition-all duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-110 image-fade-in"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = "/image/thumbnail.png"
          }}
        />

        {/* Blue overlay on hover */}
        <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="p-6 relative z-10">
        {/* Kategori Tags - Clickable dengan animasi */}
        {news.categories && news.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {news.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={(e) => handleCategoryClick(e, cat.id, cat.name)}
                className="px-3 py-1.5 text-xs font-bold border-2 border-blue-200 text-blue-700 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110 category-tag"
                title={`Lihat semua berita kategori ${cat.name}`}
                style={{ borderRadius: "0px" }}
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

        {/* Meta Information dengan ikon yang lebih menarik */}
        <div className="flex flex-col gap-3 text-xs text-gray-500 mb-6 group-hover:text-gray-600 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300"
              style={{ borderRadius: "0px" }}
            >
              <svg
                className="w-3 h-3 text-gray-600 group-hover:text-blue-600 transition-colors duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3a2 2 0 01-2-2v10a2 2 0 012-2h12a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  clipRule="evenodd"
                />
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
            <div
              className="p-1.5 bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300"
              style={{ borderRadius: "0px" }}
            >
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

          {/* Views */}
          {news.views && news.views > 0 && (
            <div className="flex items-center gap-2">
              <div
                className="p-1.5 bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300"
                style={{ borderRadius: "0px" }}
              >
                <svg
                  className="w-3 h-3 text-gray-600 group-hover:text-blue-600 transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>
                dilihat{" "}
                <span className="font-bold text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                  {news.views} kali
                </span>
              </span>
            </div>
          )}
        </div>

        <Link
          href={`/berita/${news.slug}`}
          className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-bold text-gray-700 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105 group/button"
          style={{ borderRadius: "0px" }}
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

const BeritaPage: React.FC = () => {
  const perPage = 6
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [news, setNews] = useState<NewsItem[]>([])
  const [popularNews, setPopularNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data berita dari API
  const fetchNews = async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`, {
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Gagal mengambil data berita")
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        // Filter hanya berita yang sudah dipublish dan urutkan berdasarkan tanggal terbaru
        const publishedNews = data
          .filter((item: NewsItem) => item.status === "published")
          .sort((a: NewsItem, b: NewsItem) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

        setNews(publishedNews)

        // Set berita populer berdasarkan views terbanyak (maksimal 5 berita)
        const popular = publishedNews
          .filter((item: NewsItem) => item.views && item.views > 0)
          .sort((a: NewsItem, b: NewsItem) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)

        setPopularNews(popular)
      } else {
        console.error("Respons API bukan array yang valid:", data)
        setNews([])
        setPopularNews([])
      }
    } catch (error) {
      console.error("Gagal mengambil data berita:", error)
      setError("Gagal memuat berita. Silakan coba lagi nanti.")
      setNews([])
      setPopularNews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(news.length / perPage)
  const startIndex = (currentPage - 1) * perPage
  const paginatedNews = news.slice(startIndex, startIndex + perPage)

  // Loading skeleton dengan animasi yang lebih menarik
  const LoadingSkeleton: React.FC = () => (
    <div className="bg-white border-2 border-gray-200 overflow-hidden" style={{ borderRadius: "0px" }}>
      <div className="animate-pulse">
        <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
        <div className="p-6">
          <div className="flex gap-2 mb-4">
            <div className="h-6 bg-gray-200 w-20" style={{ borderRadius: "0px" }}></div>
            <div className="h-6 bg-gray-200 w-16" style={{ borderRadius: "0px" }}></div>
          </div>
          <div className="h-6 bg-gray-200 mb-3 w-4/5" style={{ borderRadius: "0px" }}></div>
          <div className="h-4 bg-gray-200 mb-2" style={{ borderRadius: "0px" }}></div>
          <div className="h-4 bg-gray-200 mb-2" style={{ borderRadius: "0px" }}></div>
          <div className="h-4 bg-gray-200 w-3/4 mb-6" style={{ borderRadius: "0px" }}></div>
          <div className="space-y-3 mb-6">
            <div className="h-3 bg-gray-200 w-40" style={{ borderRadius: "0px" }}></div>
            <div className="h-3 bg-gray-200 w-32" style={{ borderRadius: "0px" }}></div>
          </div>
          <div className="h-12 bg-gray-200" style={{ borderRadius: "0px" }}></div>
        </div>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section dengan Tech Background */}
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
              <span className="text-white font-semibold">Berita</span>
            </div>
          </nav>

          <h1 className="text-5xl font-bold text-white mb-4">Daftar Semua Berita</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">Informasi terbaru dan terkini</p>
        </div>

        {/* Tech decorations */}
        <div className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-lg rotate-45 opacity-60" />
        <div className="absolute bottom-20 left-20 w-16 h-16 border-2 border-white/30 rotate-12 opacity-40" />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full opacity-50" />
      </div>

      {/* Content Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Berita Populer Section dengan layout baru */}
          {!loading && !error && popularNews.length > 0 && <PopularNewsSection popularNews={popularNews} />}

          {/* Loading state untuk berita populer */}
          {loading && <PopularNewsLoadingSkeleton />}

          {/* Divider */}
          {!loading && !error && popularNews.length > 0 && (
            <div className="mb-16">
              <div className="border-t-4 border-gray-300 mb-8"></div>
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">SEMUA BERITA</h2>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: perPage }).map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </section>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-20">
              <div
                className="inline-flex items-center justify-center w-20 h-20 bg-red-100 border-4 border-red-300 mb-6"
                style={{ borderRadius: "0px" }}
              >
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Terjadi Kesalahan</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">{error}</p>
              <button
                onClick={fetchNews}
                className="px-8 py-4 bg-red-500 text-white font-bold border-2 border-red-600 hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                style={{ borderRadius: "0px" }}
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && news.length === 0 && (
            <div className="text-center py-20">
              <div
                className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 border-4 border-gray-300 mb-6"
                style={{ borderRadius: "0px" }}
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
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Belum Ada Berita</h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                Berita akan ditampilkan di sini setelah admin memublikasikannya.
              </p>
            </div>
          )}

          {/* Grid berita dengan spacing dan animasi yang lebih baik */}
          {!loading && !error && paginatedNews.length > 0 && (
            <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
              {paginatedNews.map((newsItem, index) => (
                <div key={newsItem.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 150}ms` }}>
                  <NewsCard news={newsItem} index={index} />
                </div>
              ))}
            </section>
          )}

          {/* Pagination dengan styling yang lebih modern */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-12 h-12 border-2 transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white transform hover:scale-105"
                }`}
                style={{ borderRadius: "0px" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else {
                  if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 text-sm font-bold border-2 transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white border-blue-600 transform scale-110"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white transform hover:scale-105"
                    }`}
                    style={{ borderRadius: "0px" }}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-12 h-12 border-2 transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white transform hover:scale-105"
                }`}
                style={{ borderRadius: "0px" }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .tech-lines {
          background-image: 
            linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: moveLines 10s linear infinite;
        }

        @keyframes moveLines {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 20px 20px, -20px 20px;
          }
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
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes moveLines {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 50px 50px, 50px 50px;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .animated-lines {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(45deg, transparent 40%, rgba(59, 130, 246, 0.1) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(59, 130, 246, 0.1) 50%, transparent 60%);
          background-size: 30px 30px;
          animation: moveLines 2s linear infinite;
        }

        .news-card {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }

        .image-fade-in {
          transition: all 0.7s ease;
        }

        .category-tag {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

export default BeritaPage
