"use client"
import { useEffect, useRef, useState } from "react"

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState({
    title: false,
    content: false,
    stats: false,
  })

  const titleRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          if (target === titleRef.current) {
            setIsVisible((prev) => ({ ...prev, title: true }))
          } else if (target === contentRef.current) {
            setIsVisible((prev) => ({ ...prev, content: true }))
          } else if (target === statsRef.current) {
            setIsVisible((prev) => ({ ...prev, stats: true }))
          }
        }
      })
    }, observerOptions)

    if (titleRef.current) observer.observe(titleRef.current)
    if (contentRef.current) observer.observe(contentRef.current)
    if (statsRef.current) observer.observe(statsRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-16">
          <div className="p-8">
            <div
              ref={titleRef}
              className={`text-center mb-8 transition-all duration-1000 ease-out ${
                isVisible.title ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
              }`}
            >
              <h2 className="text-4xl font-bold text-black">Tentang Kecamatan Taman Kota Madiun</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div
                ref={contentRef}
                className={`space-y-6 transition-all duration-1000 ease-out delay-200 ${
                  isVisible.content ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                }`}
              >
                <p className="text-lg leading-relaxed text-gray-700 text-justify">
                  Kecamatan Taman merupakan salah satu kecamatan yang berada di wilayah Kota Madiun, Jawa Timur. Sebagai
                  pusat pemerintahan dan bisnis, kecamatan ini memiliki peran strategis dalam pengembangan ekonomi dan
                  sosial masyarakat Kota Madiun dengan fokus pada pelayanan digital dan transparansi data.
                </p>
                <p className="text-lg leading-relaxed text-gray-700 text-justify">
                  Dengan luas wilayah yang mencakup beberapa kelurahan, Kecamatan Taman terus berkomitmen untuk
                  memberikan pelayanan terbaik kepada masyarakat melalui berbagai program pembangunan infrastruktur,
                  peningkatan kualitas pendidikan, kesehatan, dan pemberdayaan ekonomi masyarakat dengan dukungan
                  teknologi informasi terkini.
                </p>
                <div
                  ref={statsRef}
                  className={`grid grid-cols-2 gap-4 mt-8 transition-all duration-1000 ease-out delay-500 ${
                    isVisible.stats ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                ></div>
              </div>
              <div className="relative h-96">
                <div className="absolute top-4 right-0 z-10">
                  <div className="aspect-[4/3] w-72 rounded-2xl overflow-hidden shadow-xl transform rotate-3 hover:rotate-1 transition-transform duration-500">
                    <img
                      src="/image/ringroad.jpg"
                      alt="Ring Road Kota Madiun"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="absolute top-12 left-8 z-30">
                  <div className="aspect-[4/3] w-80 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/xxT-ZbcMrGM?rel=0&modestbranding=1&showinfo=0"
                      title="Profil Kecamatan Taman Kota Madiun"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    ></iframe>
                  </div>
                </div>
                <div className="absolute top-2 right-12 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-lg"></div>
                <div className="absolute top-20 right-20 w-8 h-8 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-full blur-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
