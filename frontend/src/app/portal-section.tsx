"use client"

import { Calendar, ExternalLink } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

interface ServiceItem {
  id: number
  title: string
  description: string
  icon: string
  url: string
  category: string
}

interface GalleryItem {
  id: number
  title: string
  date: string
  image: string
  category: string
  slug: string 
  excerpt?: string
}

const digitalServices: ServiceItem[] = [
    {
      id: 1,
      title: "Kominfo Kota Madiun",
      description: "Dinas Komunikasi dan Informatika Kota Madiun - Layanan informasi dan teknologi digital",
      icon: "/image/DINAS KOMUNIKASI DAN INFORMATIKA KOTA MADIUN LOGO.png",
      url: "https://kominfo.madiunkota.go.id",
      category: "Teknologi",
    },
    {
      id: 2,
      title: "AwaKSigap Kota Madiun",
      description: "Sistem informasi terpadu untuk pelayanan cepat dan responsif bagi masyarakat",
      icon: "/icons/awaksigap.jpeg",
      url: "https://awaksigap.madiunkota.go.id",
      category: "Pelayanan",
    },
    {
      id: 3,
      title: "PPID Kota Madiun",
      description: "Pejabat Pengelola Informasi dan Dokumentasi - Akses informasi publik secara transparan",
      icon: "/icons/PPID.png",
      url: "https://ppid.madiunkota.go.id",
      category: "Informasi",
    },
    {
      id: 4,
      title: "Website Kota Madiun",
      description: "Portal resmi Pemerintah Kota Madiun untuk informasi pemerintahan dan pelayanan",
      icon: "/icons/madiun.png",
      url: "https://madiunkota.go.id",
      category: "Pemerintahan",
    },
]

export default function PortalSection() {
  const [galleryNews, setGalleryNews] = useState<GalleryItem[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)
  const [galleryError, setGalleryError] = useState<string | null>(null)
  
  const [isVisible, setIsVisible] = useState<{
    servicesTitle: boolean;
    services: boolean[];
    galleryTitle: boolean;
    gallery: boolean[];
    button: boolean;
  }>({
    servicesTitle: false,
    services: Array(4).fill(false),
    galleryTitle: false,
    gallery: [],
    button: false,
  })

  const servicesTitleRef = useRef<HTMLDivElement>(null)
  const galleryTitleRef = useRef<HTMLDivElement>(null)
  const servicesRefs = useRef<(HTMLDivElement | null)[]>([])
  const galleryRefs = useRef<(HTMLDivElement | null)[]>([])
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchGalleryNews = async () => {
      setGalleryLoading(true)
      setGalleryError(null)
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/news-by-category/foto-galeri-kegiatan`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error("Gagal mengambil data galeri dari server.")
        }

        const result = await response.json()
        const newsData = result.data || []

        const formattedNews: GalleryItem[] = newsData.map((news: any) => {
          let imageUrl = "/image/placeholder.png"
          
          if (news.images && news.images.length > 0) {
            const thumbnail = news.images.find((img: any) => img.id === news.thumbnail_image_id)
            const imagePath = thumbnail ? thumbnail.path : news.images[0].path
            imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/storage/${imagePath}`
          }

          return {
            id: news.id,
            title: news.title,
            date: news.published_at,
            image: imageUrl,
            category: news.categories[0]?.name || "Berita",
            slug: news.slug,
            excerpt: news.excerpt,
          }
        })

        setGalleryNews(formattedNews)
      } catch (error) {
        console.error("Error fetching gallery news:", error)
        setGalleryError("Tidak dapat memuat galeri. Silakan coba lagi nanti.")
      } finally {
        setGalleryLoading(false)
      }
    }

    fetchGalleryNews()
  }, [])

  useEffect(() => {
    if (galleryNews.length > 0) {
      setIsVisible(prev => ({
        ...prev,
        gallery: Array(galleryNews.length).fill(false)
      }));
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement

          if (target === servicesTitleRef.current) {
            setIsVisible((prev) => ({ ...prev, servicesTitle: true }))
          } else if (target === galleryTitleRef.current) {
            setIsVisible((prev) => ({ ...prev, galleryTitle: true }))
          } else if (target === buttonRef.current) {
            setIsVisible((prev) => ({ ...prev, button: true }))
          } else {
            const serviceIndex = servicesRefs.current.findIndex((ref) => ref === target)
            if (serviceIndex !== -1) {
              setIsVisible((prev) => ({
                ...prev,
                services: prev.services.map((visible, index) => (index === serviceIndex ? true : visible)),
              }))
            }
            
            const galleryIndex = galleryRefs.current.findIndex((ref) => ref === target)
            if (galleryIndex !== -1) {
              setIsVisible((prev) => ({
                ...prev,
                gallery: prev.gallery.map((visible, index) => (index === galleryIndex ? true : visible)),
              }))
            }
          }
        }
      })
    }, observerOptions)

    const refsToObserve = [
        servicesTitleRef.current, 
        galleryTitleRef.current, 
        buttonRef.current,
        ...servicesRefs.current,
        ...galleryRefs.current
    ];

    refsToObserve.forEach(ref => {
        if (ref) observer.observe(ref);
    });

    return () => {
        refsToObserve.forEach(ref => {
            if (ref) observer.unobserve(ref);
        });
    }
  }, [galleryNews])

  return (
    <>
      <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-400">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div
            className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-32 right-20 w-16 h-16 bg-white/15 rounded-full animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-40 left-1/4 w-14 h-14 bg-white/20 rounded-full animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          ></div>
        </div>

        <div className="w-full mx-auto px-4 py-12 relative z-10">
          <div className="flex justify-center mb-12 mt-8">
            <div className="w-40 h-40 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-sm border-4 border-white/30 shadow-xl">
              <img
                src="/icons/madiun.png"
                alt="Logo Kota Madiun"
                className="w-28 h-28 object-contain filter drop-shadow-lg"
              />
            </div>
          </div>

          <div className="mb-16">
            <div
              ref={servicesTitleRef}
              className={`mb-12 transition-all duration-1000 ease-out ${
                isVisible.servicesTitle ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white font-serif bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Layanan Digital Kecamatan
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-white/60 to-cyan-300 mx-auto mb-4 rounded-full"></div>
                <p className="text-white/90 text-base md:text-lg leading-relaxed font-light">
                  Akses berbagai layanan digital untuk kemudahan administrasi dan pelayanan publik di Kecamatan Taman
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-6xl mx-auto">
              {digitalServices.map((service, index) => (
                <div
                  key={service.id}
                  ref={(el) => {
                    servicesRefs.current[index] = el
                  }}
                  className={`group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/30 h-full ${
                    isVisible.services[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                  style={{
                    transitionDelay: isVisible.services[index] ? `${index * 150}ms` : "0ms",
                  }}
                >
                  <div className="p-8 h-full flex flex-col justify-between min-h-[280px]">
                    <div className="flex-1">
                      <div className="flex items-start mb-4">
                        <div className="p-2 rounded-xl flex-shrink-0 mr-4 w-16 h-16 flex items-center justify-center">
                          <img
                            src={service.icon || "/placeholder.svg"}
                            alt={`${service.title} logo`}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full mb-3">
                            {service.category}
                          </span>
                          <h3 className="text-xl font-bold leading-tight text-gray-800 group-hover:text-blue-600 cursor-pointer transition-colors mb-3">
                            {service.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <a
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-all duration-300 font-medium shadow-sm hover:shadow-md group-hover:translate-y-[-2px]"
                      >
                        Akses Layanan
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-12"></div>
        </div>
      </div>

      <div className="w-full bg-white py-16">
        <div className="w-full mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4 lg:flex-shrink-0">
                <div
                  ref={galleryTitleRef}
                  className={`transition-all duration-1000 ease-out ${
                    isVisible.galleryTitle ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                  }`}
                >
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800 font-serif">
                    Galeri Kecamatan Taman
                  </h2>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 mb-4 rounded-full"></div>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Dokumentasi berbagai kegiatan dan perkembangan terkini di Kecamatan Taman Kota Madiun
                  </p>
                </div>
              </div>

              <div className="lg:w-3/4">
                {galleryLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Skeleton loader */}
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse"></div>
                    ))}
                  </div>
                )}
                {galleryError && (
                  <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg">{galleryError}</div>
                )}
                {!galleryLoading && !galleryError && galleryNews.length === 0 && (
                    <div className="text-center text-gray-500 bg-gray-50 p-8 rounded-lg">Tidak ada berita di galeri ini.</div>
                )}
                {!galleryLoading && !galleryError && galleryNews.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {galleryNews.map((item, index) => (
                      <Link href={`/berita/${item.slug}`} key={item.id} passHref>
                        <div
                          ref={(el) => { galleryRefs.current[index] = el }}
                          className={`
                            relative group cursor-pointer overflow-hidden
                            transition-all duration-500 ease-in-out
                            ${isVisible.gallery[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
                          `}
                          style={{
                            transitionDelay: isVisible.gallery[index] ? `${index * 100}ms` : "0ms",
                          }}
                        >
                          {/* Container dengan aspect ratio dinamis - tanpa gap */}
                          <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 transform transition-all duration-700 ease-out group-hover:scale-110 group-hover:shadow-2xl group-hover:z-50">
                            {/* Gambar utama */}
                            <img
                              src={item.image}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            
                            {/* Overlay gradien yang muncul saat hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"></div>

                            {/* Konten teks yang muncul saat hover */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0">
                              <h3 className="text-sm font-bold leading-tight line-clamp-2 mb-2 drop-shadow-lg">
                                {item.title}
                              </h3>
                              <div className="flex items-center text-xs text-white/90">
                                <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                                <span>
                                  {new Date(item.date).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>

                            {/* Border glow effect saat hover */}
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/50 transition-colors duration-500"></div>
                            
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                          </div>

                          {/* Efek bayangan tambahan */}
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 transform translate-y-2 group-hover:translate-y-4 blur-xl"></div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}