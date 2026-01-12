"use client"

import { useState, useEffect, useRef } from "react"

function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredSection, setHoveredSection] = useState<number | null>(null)
  const [animatedDots, setAnimatedDots] = useState<any[]>([])
  const [isInView, setIsInView] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)

  const [statistikPengunjung, setStatistikPengunjung] = useState<number | null>(null)

  useEffect(() => {
    const catatDanAmbilStatistik = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        const response = await fetch(`${apiUrl}/api/statistik-pengunjung/catat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        })
        if (!response.ok) throw new Error("Gagal menghubungi API statistik")
        const data = await response.json()
        setStatistikPengunjung(data.jumlah)
      } catch (error) {
        console.error("Gagal mengambil statistik pengunjung:", error)
      }
    }
    catatDanAmbilStatistik()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    const dots = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }))
    setAnimatedDots(dots)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true)
      },
      { threshold: 0.1, rootMargin: "50px" }
    )
    if (footerRef.current) observer.observe(footerRef.current)
    return () => {
      clearTimeout(timer)
      if (footerRef.current) observer.unobserve(footerRef.current)
    }
  }, [])

  const SocialIcon = ({ platform, url }: { platform: string; url: string }) => {
    const iconProps = {
      className: "w-5 h-5 transition-all duration-300 group-hover:scale-125",
    }
    const getIcon = () => {
      switch (platform) {
        case "Facebook":
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )
        case "Twitter":
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
          )
        case "Instagram":
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-2.664 4.771-6.979 4.919-1.266.057-1.644.069-4.849.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.849-.07 4.354-.2 6.782-2.618 6.979-6.98.059-1.265.073-1.689.073-4.849 0-3.204-.013-3.583-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          )
        case "YouTube":
          return (
            <svg {...iconProps} fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          )
        default:
          return null
      }
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-white/10 border border-white/30 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:rotate-6 cursor-pointer relative overflow-hidden group"
        title={platform}
      >
        <div className="text-white">{getIcon()}</div>
        <div className="absolute inset-0 bg-white rounded-lg scale-0 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-20"></div>
      </a>
    )
  }

  const socialIcons = [
    { name: "Facebook", url: "https://www.facebook.com/kectaman.kotamadiun/" },
    { name: "Twitter", url: "https://x.com/pkk_kectaman" },
    { name: "Instagram", url: "https://www.instagram.com/kecamatantaman_madiun/" },
    { name: "YouTube", url: "https://www.youtube.com/embed/xxT-ZbcMrGM?rel=0&modestbranding=1&showinfo=0" },
  ]

  return (
    <div ref={footerRef} className="text-white relative overflow-hidden" style={{ backgroundColor: "#1e7dd6" }}>
      {/* Elemen Latar Belakang Animasi */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {animatedDots.map((style, i) => (
          <div key={i} className="absolute w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={style} />
        ))}
      </div>
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-16 h-16 border border-white rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
        <div
          className="absolute bottom-32 right-20 w-12 h-12 bg-white rounded-full animate-bounce"
          style={{ animationDuration: "4s" }}
        ></div>
      </div>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-y-12 animate-pulse"></div>
      </div>

      {/* Konten Utama Footer */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section dengan Logo di KIRI dan Statistik di KANAN */}
        <div className="px-6 pt-8 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Sisi Kiri: Logo dan Nama Instansi */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center p-1.5 border border-white/30 shadow-md">
                <img
                  src="/icons/madiun.png"
                  alt="Logo Kecamatan Taman Kota Madiun"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    const fallback = e.currentTarget.nextSibling as HTMLElement
                    fallback.style.display = "block"
                  }}
                />
                <div className="text-2xl hidden" style={{ display: "none" }}>
                  🏛️
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Kecamatan Taman</h1>
                <p className="text-white/90 text-xs">Kota Madiun</p>
              </div>
            </div>

            {/* Sisi Kanan: Blok Statistik Pengunjung */}
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/30 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a3.75 3.75 0 015.968 0 3.75 3.75 0 01-5.968 0zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-white/80 text-xs font-light">Total Pengunjung</p>
                <p className="text-2xl font-bold text-white tracking-wider -mt-1">
                  {statistikPengunjung !== null ? statistikPengunjung.toLocaleString("id-ID") : "..."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informasi Kontak Section */}
        <div className="px-6 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Kolom 1: Alamat */}
              <div className="text-center lg:text-left">
                <h4 className="text-base font-semibold text-white underline mb-3">Alamat Kantor</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-white">Jl. Raya Taman No. 15</p>
                  <p className="text-white">Kel. Taman, Kecamatan Taman</p>
                  <p className="text-white">Kota Madiun, Jawa Timur 63133</p>
                </div>
              </div>

              {/* Kolom 2: Kontak */}
              <div className="text-center lg:text-left">
                <h4 className="text-base font-semibold text-white underline mb-3">Hubungi Kami</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-white">Telepon: (0351) 123-456</p>
                  <p className="text-white">Email: taman@madiunkota.go.id</p>
                </div>
              </div>

              {/* Kolom 3: Jam Layanan */}
              <div className="text-center lg:text-left">
                <h4 className="text-base font-semibold text-white underline mb-3">Jam Pelayanan</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-white">
                    <span className="font-medium block">Senin - Kamis:</span>
                    07.00 - 15.30 WIB
                  </p>
                  <p className="text-white">
                    <span className="font-medium block">Jumat:</span>
                    06.30 - 14.30 WIB
                  </p>
                </div>
              </div>

              {/* Kolom 4: Social Media */}
              <div className="text-center lg:text-left">
                <h3 className="text-base font-semibold text-white underline mb-3">Media Sosial</h3>
                <p className="text-white text-sm mb-4">Ikuti kami untuk informasi terbaru</p>
                <div className="flex justify-center lg:justify-start space-x-3">
                  {socialIcons.map((social) => (
                    <SocialIcon key={social.name} platform={social.name} url={social.url} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bagian Copyright */}
        <div className="px-6 py-4 mt-4">
          <div className="pt-4 border-t border-blue-400 border-opacity-30 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/80 text-xs">
                © {new Date().getFullYear()} Kecamatan Taman, Kota Madiun. Seluruh hak cipta dilindungi.
              </p>
              <div className="flex gap-3">
                <a href="#" className="text-white/70 hover:text-white text-xs">
                  Kebijakan Privasi
                </a>
                <a href="#" className="text-white/70 hover:text-white text-xs">
                  Syarat & Ketentuan
                </a>
                <a href="#" className="text-white/70 hover:text-white text-xs">
                  Peta Situs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(3deg);
          }
        }
      `}</style>
    </div>
  )
}

export default Footer