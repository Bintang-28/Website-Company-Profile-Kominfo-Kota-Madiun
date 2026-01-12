"use client"
import { useRef, useEffect, useState } from "react"

const quickLinks = [
  {
    title: "Awak Sigap",
    description: "Sistem Informasi Keamanan dan Ketertiban",
    url: "https://awaksigap.madiunkota.go.id",
    logo: "/icons/awaksigap.jpeg",
  },
  {
    title: "PPID Kota Madiun",
    description: "Pejabat Pengelola Informasi dan Dokumentasi",
    url: "https://ppid.madiunkota.go.id",
    logo: "/icons/PPID.png",
  },
  {
    title: "Kominfo Kota Madiun",
    description: "Komunikasi dan Informatika Kota Madiun",
    url: "https://kominfo.madiunkota.go.id",
    logo: "/icons/madiun.png",
  },
  {
    title: "Madiun Today",
    description: "Portal Berita Terkini Kota Madiun",
    url: "https://madiuntoday.id",
    logo: "/icons/madiun-today.jpeg",
  },
  {
    title: "Portal Open Data",
    description: "Data Terbuka Kecamatan Taman Kota Madiun",
    url: "https://opendata.madiunkota.go.id",
    logo: "/icons/madiun.png",
  },
  {
    title: "siRUP",
    description: "Sistem Informasi Rencana Umum Pengadaan",
    url: "https://sirup-lat.lkpp.go.id/sirup/rekap/penyedia/D179",
    logo: "/icons/madiun.png",
  },
  {
    title: "LPSE",
    description: "Layanan Pengadaan Secara Elektronik",
    url: "https://spse.inaproc.id/madiunkota",
    logo: "/icons/logo-lpse.png",
  },
]

export default function HeaderCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current && !isPaused) {
        const scrollAmount = 0.5
        const singleSetWidth = quickLinks.length * (192 + 16)
        const currentScroll = carouselRef.current.scrollLeft

        if (currentScroll >= singleSetWidth) {
          carouselRef.current.scrollLeft = 0
        } else {
          carouselRef.current.scrollLeft += scrollAmount
        }
      }
    }, 16)

    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <div
      className="mb-16 w-full relative overflow-hidden border-t-8 border-white"
      style={{ backgroundColor: "#1E90FF" }}
    >
      <div className="relative z-20 text-center py-8 px-4">
        <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Selamat Datang di Website Resmi</h1>
        <h2 className="text-white/90 text-lg md:text-xl lg:text-2xl font-medium">Kecamatan Taman Kota Madiun</h2>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-32 right-20 w-16 h-16 bg-white/15 rounded-full animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/20 rounded-full animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-8 h-8 bg-white/25 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
        ></div>
        <div
          className="absolute top-16 right-10 w-6 h-6 bg-white/20 rotate-45 animate-spin"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-32 right-1/4 w-4 h-4 bg-white/30 rotate-45 animate-spin"
          style={{ animationDuration: "6s", animationDirection: "reverse" }}
        ></div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-white/15 via-white/25 to-white/15 animate-pulse"></div>{" "}
      </div>

      <div className="relative py-8 z-10">
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[...quickLinks, ...quickLinks, ...quickLinks].map((link, index) => (
            <div
              key={index}
              className="group relative rounded-2xl hover:shadow-none transition-all duration-500 transform hover:-translate-y-1 hover:rotate-1 p-4 flex-shrink-0 w-48"
              style={{ backgroundColor: "transparent" }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500"
                style={{ backgroundColor: "#1E90FF" }} // Updated hover background to match new sky blue color
              ></div>
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    <img
                      src={link.logo || "/placeholder.svg"}
                      alt={`${link.title} logo`}
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-white font-medium text-sm mb-1">{link.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
