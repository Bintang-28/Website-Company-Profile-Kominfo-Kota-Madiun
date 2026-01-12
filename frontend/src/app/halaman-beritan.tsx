"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

// Tipe data sesuai struktur admin
interface NewsItem {
  id: number
  title: string
  excerpt?: string
  slug: string
  author?: string
  published_at: string
  status: string
  source_url?: string
  categories: Array<{
    id: number
    name: string
  }>
  images: Array<{
    id: number
    path: string
    caption?: string
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
}

export function DistrictNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [visibleItems, setVisibleItems] = useState(new Set<string>())

  const fetchPublishedNews = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn("NEXT_PUBLIC_API_URL not configured, using sample data")
        setSampleData()
        return
      }

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
          .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        setNews(publishedNews)
      } else {
        console.error("Respons API bukan array yang valid:", data)
        setNews([])
      }
    } catch (error) {
      console.error("Gagal mengambil data berita:", error)
      setSampleData()
    } finally {
      setLoading(false)
    }
  }

  const setSampleData = () => {
    const sampleNews: NewsItem[] = [
      {
        id: 1,
        title: "Pembangunan Jalan Baru di Kecamatan Taman Dimulai",
        excerpt:
          "Proyek pembangunan jalan sepanjang 2 km ini diharapkan dapat meningkatkan akses transportasi warga dan mendukung perekonomian lokal.",
        slug: "pembangunan-jalan-baru-kecamatan-taman",
        author: "Admin Kecamatan",
        published_at: new Date().toISOString(),
        status: "published",
        categories: [{ id: 1, name: "Infrastruktur" }],
        images: [{ id: 1, path: "placeholder.jpg", caption: "Pembangunan jalan baru" }],
        contents: [
          {
            id: 1,
            type: "paragraph",
            content:
              "Proyek pembangunan jalan sepanjang 2 km ini diharapkan dapat meningkatkan akses transportasi warga dan mendukung perekonomian lokal di Kecamatan Taman.",
          },
        ],
        pdfs: [],
      },
      {
        id: 2,
        title: "Program Bantuan Sosial untuk Warga Kurang Mampu",
        excerpt:
          "Kecamatan Taman menyalurkan bantuan sosial berupa sembako dan uang tunai kepada 500 keluarga kurang mampu.",
        slug: "program-bantuan-sosial-warga-kurang-mampu",
        author: "Tim Sosial",
        published_at: new Date(Date.now() - 86400000).toISOString(),
        status: "published",
        categories: [{ id: 2, name: "Sosial" }],
        images: [{ id: 2, path: "placeholder.jpg", caption: "Penyaluran bantuan sosial" }],
        contents: [
          {
            id: 2,
            type: "paragraph",
            content:
              "Kecamatan Taman menyalurkan bantuan sosial berupa sembako dan uang tunai kepada 500 keluarga kurang mampu sebagai bentuk kepedulian pemerintah.",
          },
        ],
        pdfs: [],
      },
      {
        id: 3,
        title: "Vaksinasi COVID-19 Dosis Booster di Puskesmas Taman",
        excerpt:
          "Kegiatan vaksinasi booster COVID-19 akan dilaksanakan setiap hari Senin dan Kamis di Puskesmas Kecamatan Taman.",
        slug: "vaksinasi-covid-19-dosis-booster",
        author: "Dinkes Taman",
        published_at: new Date(Date.now() - 172800000).toISOString(),
        status: "published",
        categories: [{ id: 3, name: "Kesehatan" }],
        images: [{ id: 3, path: "placeholder.jpg", caption: "Vaksinasi COVID-19" }],
        contents: [
          {
            id: 3,
            type: "paragraph",
            content:
              "Kegiatan vaksinasi booster COVID-19 akan dilaksanakan setiap hari Senin dan Kamis di Puskesmas Kecamatan Taman untuk meningkatkan imunitas masyarakat.",
          },
        ],
        pdfs: [],
      },
      {
        id: 4,
        title: "Pelatihan Kewirausahaan untuk Pemuda Kecamatan Taman",
        excerpt:
          "Sebanyak 50 pemuda mengikuti pelatihan kewirausahaan yang diselenggarakan oleh Kecamatan Taman bekerjasama dengan UMKM lokal.",
        slug: "pelatihan-kewirausahaan-pemuda",
        author: "Bagian Ekonomi",
        published_at: new Date(Date.now() - 259200000).toISOString(),
        status: "published",
        categories: [{ id: 4, name: "Ekonomi" }],
        images: [{ id: 4, path: "placeholder.jpg", caption: "Pelatihan kewirausahaan" }],
        contents: [
          {
            id: 4,
            type: "paragraph",
            content:
              "Sebanyak 50 pemuda mengikuti pelatihan kewirausahaan yang diselenggarakan oleh Kecamatan Taman bekerjasama dengan UMKM lokal untuk meningkatkan ekonomi kreatif.",
          },
        ],
        pdfs: [],
      },
      {
        id: 5,
        title: "Gotong Royong Bersih Lingkungan Setiap Jumat",
        excerpt: "Warga Kecamatan Taman rutin mengadakan gotong royong membersihkan lingkungan setiap hari Jumat pagi.",
        slug: "gotong-royong-bersih-lingkungan",
        author: "RT/RW Taman",
        published_at: new Date(Date.now() - 345600000).toISOString(),
        status: "published",
        categories: [{ id: 5, name: "Lingkungan" }],
        images: [{ id: 5, path: "placeholder.jpg", caption: "Gotong royong" }],
        contents: [
          {
            id: 5,
            type: "paragraph",
            content:
              "Warga Kecamatan Taman rutin mengadakan gotong royong membersihkan lingkungan setiap hari Jumat pagi untuk menjaga kebersihan dan keindahan lingkungan.",
          },
        ],
        pdfs: [],
      },
    ]

    // Add more sample data to fill all sections
    const additionalNews = Array.from({ length: 10 }, (_, i) => ({
      id: i + 6,
      title: `Berita Terbaru Kecamatan Taman ${i + 1}`,
      excerpt: `Ini adalah contoh berita terbaru dari Kecamatan Taman yang menampilkan berbagai kegiatan dan program yang sedang berjalan.`,
      slug: `berita-terbaru-${i + 1}`,
      author: "Admin",
      published_at: new Date(Date.now() - (i + 1) * 432000000).toISOString(),
      status: "published",
      categories: [{ id: 1, name: "Berita" }],
      images: [{ id: i + 6, path: "placeholder.jpg", caption: `Berita ${i + 1}` }],
      contents: [
        {
          id: i + 6,
          type: "paragraph",
          content: `Ini adalah contoh berita terbaru dari Kecamatan Taman yang menampilkan berbagai kegiatan dan program yang sedang berjalan di wilayah kecamatan.`,
        },
      ],
      pdfs: [],
    }))

    setNews([...sampleNews, ...additionalNews])
  }

  useEffect(() => {
    fetchPublishedNews()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            if (target.dataset.index) {
              setVisibleItems((prev) => new Set(prev).add(target.dataset.index!))
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    const newsItems = document.querySelectorAll("[data-news-item]")
    newsItems.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [news])

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("id-ID", options)
  }

  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Helper functions untuk mengambil data dari struktur admin
  const getImageUrl = (item: NewsItem) => {
    if (item.images && item.images.length > 0) {
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.images[0].path}`
    }
    return "https://placehold.co/800x600/e2e8f0/64748b?text=No+Image"
  }

  const getExcerpt = (item: NewsItem) => {
    if (item.excerpt) return item.excerpt

    // Ambil dari content pertama jika tidak ada excerpt
    const firstContent = item.contents?.find((content) => content.type === "paragraph")
    if (firstContent) {
      const plainText = firstContent.content.replace(/<[^>]*>/g, "")
      return plainText
    }

    return ""
  }

  const getPdfUrl = (item: NewsItem) => {
    if (item.pdfs && item.pdfs.length > 0) {
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${item.pdfs[0].path}`
    }
    return null
  }

  const headlineNews = news[0]
  const featuredNews = news.slice(1, 4)
  const sidebarNews = news.slice(4, 8)
  const bottomNews = news.slice(8, 12)

  if (loading) {
    return (
      <section className="w-full max-w-7xl mx-auto flex flex-col items-center px-4 py-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-12 w-full">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <h4 className="text-2xl text-center mt-4 text-blue-gray-800">Memuat berita terbaru...</h4>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col items-center px-4 py-20">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-50 to-transparent rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

        <div className="text-center mb-12 relative z-10 border-b-4 border-gray-900 pb-6">
          <div className="inline-block mb-4">
            <button className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl bg-gray-900 text-white font-bold px-6 py-2 text-sm rounded">
              BERITA HARIAN
            </button>
          </div>
          <h2
            className="text-4xl text-center mb-2 font-black text-gray-900 tracking-tight"
            style={{ fontFamily: "serif" }}
          >
            KECAMATAN TAMAN
          </h2>
          <p className="text-sm text-center font-normal text-gray-600 uppercase tracking-widest">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            {headlineNews && (
              <div
                data-news-item
                data-index="headline"
                className={`mb-8 transform transition-all duration-700 ease-out ${
                  visibleItems.has("headline") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                onMouseEnter={() => setHoveredItem("headline")}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`p-0 transition-all duration-500 hover:shadow-xl rounded-none border-b-2 border-gray-900 ${
                    hoveredItem === "headline" ? "bg-gradient-to-br from-blue-50 to-white" : "bg-white"
                  }`}
                >
                  <div className="p-0">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div
                        className={`overflow-hidden transition-all duration-500 rounded-lg ${
                          hoveredItem === "headline" ? "shadow-xl" : "shadow-lg"
                        }`}
                      >
                        <Image
                          width={800}
                          height={600}
                          src={getImageUrl(headlineNews) || "/placeholder.svg"}
                          className={`w-full h-[300px] object-cover transition-all duration-700 rounded-lg ${
                            hoveredItem === "headline" ? "scale-105" : "scale-100"
                          }`}
                          alt={headlineNews.title}
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = "https://placehold.co/800x600/e2e8f0/64748b?text=No+Image"
                          }}
                          unoptimized={true}
                        />
                      </div>

                      <div className="flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-red-600 font-bold uppercase tracking-widest mb-2">HOT NEWS</p>
                          <Link href={`/berita/${headlineNews.slug}`}>
                            <h3
                              className={`text-3xl font-black text-gray-900 mb-4 leading-tight cursor-pointer transition-all duration-300 ${
                                hoveredItem === "headline" ? "text-blue-600" : "hover:text-blue-600"
                              }`}
                              style={{ fontFamily: "serif" }}
                            >
                              {truncateText(headlineNews.title, 120)}
                            </h3>
                          </Link>
                          <p className="text-lg text-gray-700 mb-4 leading-relaxed" style={{ fontFamily: "serif" }}>
                            {truncateText(getExcerpt(headlineNews), 250)}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {(headlineNews.author || "Admin")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-900">{headlineNews.author || "Admin"}</p>
                              <p className="text-xs text-gray-600">{formatDate(headlineNews.published_at)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {getPdfUrl(headlineNews) && (
                              <a
                                href={getPdfUrl(headlineNews)!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-bold px-3 py-1 border border-red-600 hover:bg-red-50 transition-all duration-300"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 00-2-2H6a2 2 0 00-2-2V4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                PDF
                              </a>
                            )}
                            <Link
                              href={`/berita/${headlineNews.slug}`}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold px-3 py-1 border border-blue-600 hover:bg-blue-50 transition-all duration-300"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2-2V4z"
                                />
                              </svg>
                              BACA SELENGKAPNYA
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {featuredNews.map((item, idx) => (
                <div
                  key={item.id}
                  data-news-item
                  data-index={`featured-${idx}`}
                  className={`transform transition-all duration-700 ease-out ${
                    visibleItems.has(`featured-${idx}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                  onMouseEnter={() => setHoveredItem(`featured-${idx}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    className={`p-0 transition-all duration-500 hover:shadow-lg rounded-none border-r border-gray-300 pr-4 ${
                      hoveredItem === `featured-${idx}` ? "bg-gradient-to-br from-blue-50 to-white" : "bg-white"
                    }`}
                  >
                    <div className="p-0">
                      <div
                        className={`w-full mb-3 h-[150px] overflow-hidden rounded-lg ${
                          hoveredItem === `featured-${idx}` ? "shadow-lg" : "shadow-md"
                        }`}
                      >
                        <Image
                          width={400}
                          height={300}
                          src={getImageUrl(item) || "/placeholder.svg"}
                          className={`w-full object-cover h-full transition-all duration-700 rounded-lg ${
                            hoveredItem === `featured-${idx}` ? "scale-110" : "scale-100"
                          }`}
                          alt={item.title}
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image"
                          }}
                          unoptimized={true}
                        />
                      </div>
                      <Link href={`/berita/${item.slug}`}>
                        <h6
                          className={`text-lg font-bold text-gray-900 mb-2 leading-tight cursor-pointer transition-all duration-300 ${
                            hoveredItem === `featured-${idx}` ? "text-blue-600" : "hover:text-blue-600"
                          }`}
                          style={{ fontFamily: "serif" }}
                        >
                          {truncateText(item.title, 80)}
                        </h6>
                      </Link>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {truncateText(getExcerpt(item), 120)}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {item.author || "Admin"} • {formatDate(item.published_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 border-l-2 border-gray-900 pl-6">
            <div className="mb-6">
              <h4
                className="text-2xl font-black text-gray-900 mb-4 border-b-2 border-gray-300 pb-2"
                style={{ fontFamily: "serif" }}
              >
                BERITA LAINNYA
              </h4>
            </div>

            {sidebarNews.map((item, idx) => (
              <div
                key={item.id}
                data-news-item
                data-index={`sidebar-${idx}`}
                className={`mb-6 pb-4 border-b border-gray-200 transform transition-all duration-700 ease-out ${
                  visibleItems.has(`sidebar-${idx}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${300 + idx * 150}ms` }}
                onMouseEnter={() => setHoveredItem(`sidebar-${idx}`)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`p-0 transition-all duration-500 ${
                    hoveredItem === `sidebar-${idx}` ? "bg-gradient-to-br from-blue-50 to-white" : "bg-white"
                  }`}
                >
                  <div className="p-0">
                    <div className="flex gap-3">
                      <div
                        className={`w-20 h-16 flex-shrink-0 overflow-hidden rounded-md ${
                          hoveredItem === `sidebar-${idx}` ? "shadow-md" : ""
                        }`}
                      >
                        <Image
                          width={200}
                          height={150}
                          src={getImageUrl(item) || "/placeholder.svg"}
                          className={`w-full h-full object-cover transition-all duration-700 rounded-md ${
                            hoveredItem === `sidebar-${idx}` ? "scale-110" : "scale-100"
                          }`}
                          alt={item.title}
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = "https://placehold.co/200x150/e2e8f0/64748b?text=No+Image"
                          }}
                          unoptimized={true}
                        />
                      </div>
                      <div className="flex-1">
                        <Link href={`/berita/${item.slug}`}>
                          <h6
                            className={`text-lg font-bold text-gray-900 mb-1 leading-tight cursor-pointer transition-all duration-300 text-sm ${
                              hoveredItem === `sidebar-${idx}` ? "text-blue-600" : "hover:text-blue-600"
                            }`}
                            style={{ fontFamily: "serif" }}
                          >
                            {truncateText(item.title, 60)}
                          </h6>
                        </Link>
                        <p className="text-xs text-gray-600 mb-2">{truncateText(getExcerpt(item), 80)}</p>
                        <p className="text-xs text-gray-500">{formatDate(item.published_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {bottomNews.length > 0 && (
          <div className="mt-12 pt-8 border-t-2 border-gray-900">
            <h4 className="text-2xl font-black text-gray-900 mb-6 text-center" style={{ fontFamily: "serif" }}>
              BERITA TERPOPULER
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bottomNews.map((item, idx) => (
                <div
                  key={item.id}
                  data-news-item
                  data-index={`bottom-${idx}`}
                  className={`transform transition-all duration-700 ease-out h-full ${
                    visibleItems.has(`bottom-${idx}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                  style={{ transitionDelay: `${600 + idx * 100}ms` }}
                  onMouseEnter={() => setHoveredItem(`bottom-${idx}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    className={`flex flex-col h-full transition-all duration-500 hover:shadow-xl rounded-lg overflow-hidden ${
                      hoveredItem === `bottom-${idx}`
                        ? "bg-gradient-to-br from-blue-50 to-white transform -translate-y-2 shadow-2xl"
                        : "bg-white shadow-md hover:shadow-lg"
                    }`}
                  >
                    <div
                      className={`w-full h-40 overflow-hidden flex-shrink-0 ${hoveredItem === `bottom-${idx}` ? "shadow-lg" : ""}`}
                    >
                      <Image
                        width={300}
                        height={200}
                        src={getImageUrl(item) || "/placeholder.svg"}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          hoveredItem === `bottom-${idx}` ? "scale-110 brightness-110" : "scale-100"
                        }`}
                        alt={item.title}
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const target = e.target as HTMLImageElement
                          target.onerror = null
                          target.src = "https://placehold.co/300x200/e2e8f0/64748b?text=No+Image"
                        }}
                        unoptimized={true}
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="mb-3">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                            hoveredItem === `bottom-${idx}` ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {item.categories[0]?.name || ""}
                        </span>
                      </div>

                      <div className="flex-1 mb-4">
                        <Link href={`/berita/${item.slug}`}>
                          <h6
                            className={`text-sm font-bold text-gray-900 mb-3 leading-tight cursor-pointer transition-all duration-300 ${
                              hoveredItem === `bottom-${idx}` ? "text-blue-600" : "hover:text-blue-600"
                            }`}
                            style={{ fontFamily: "serif" }}
                          >
                            {truncateText(item.title, 60)}
                          </h6>
                        </Link>
                        <p className="text-xs text-gray-600 leading-relaxed">{truncateText(getExcerpt(item), 80)}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            hoveredItem === `bottom-${idx}` ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {(item.author || "Admin")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            {item.author || "Admin"} • {formatDate(item.published_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Link
            href="/berita"
            className="group flex items-center gap-2 bg-gray-900 text-white px-6 py-3 font-bold uppercase tracking-wider text-sm hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded"
          >
            <span>LIHAT SEMUA BERITA</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {news.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h5 className="text-xl text-gray-600" style={{ fontFamily: "serif" }}>
              Belum ada berita yang dipublikasikan
            </h5>
            <p className="text-sm text-gray-600 mt-2">Silakan kembali lagi nanti untuk berita terbaru</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default DistrictNews
