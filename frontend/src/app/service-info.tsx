"use client"
import { useRef, useEffect, useState } from "react"

const serviceInfo = [
  {
    id: 1,
    title: "MAKLUMAT PELAYANAN",
    image: "/image/maklumat-pelayanan.jpg",
  },
  {
    id: 2,
    title: "JAM PELAYANAN KECAMATAN TAMAN",
    image: "/image/jam-pelayanan.jpeg",
  },
  {
    id: 3,
    title: "INDEKS PELAYANAN PUBLIK TAHUN 2024",
    image: "/image/indeks-pelayanan.jpeg",
  },
  {
    id: 4,
    title: "INDEKS KEPUASAN MASYARAKAT TAHUN 2024",
    image: "/image/indeks-kepuasan.jpeg",
  },
  {
    id: 5,
    title: "NILAI SAKIP TAHUN 2024",
    image: "/image/nilai-sakip.jpeg",
  },
  {
    id: 6,
    title: "BUDAYA 5S",
    image: "/image/budaya-5s.png",
  },
]

export default function ServiceSection() {
  const serviceCarouselRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-scroll carousel
  useEffect(() => {
    if (!serviceCarouselRef.current || isHovered) return

    const interval = setInterval(() => {
      setCurrentPosition((prev) => {
        const container = serviceCarouselRef.current
        if (!container) return prev

        const itemWidth = 320 // Width of each item (w-80 = 320px)
        const maxScroll = container.scrollWidth - container.clientWidth

        if (prev >= maxScroll) {
          // Reset to start for seamless loop
          container.scrollTo({ left: 0, behavior: "instant" })
          return 0
        } else {
          const newPosition = prev + itemWidth
          container.scrollTo({ left: newPosition, behavior: "smooth" })
          return newPosition
        }
      })
    }, 3000) // Scroll every 3 seconds

    return () => clearInterval(interval)
  }, [isHovered])

  // Handle manual scroll to update position
  useEffect(() => {
    const carousel = serviceCarouselRef.current
    if (!carousel) return

    const handleScroll = () => {
      setCurrentPosition(carousel.scrollLeft)
    }

    carousel.addEventListener("scroll", handleScroll)
    return () => carousel.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div ref={sectionRef} className="container mx-auto px-4 py-16 bg-white">
      <div className="mb-16">
        <div
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Informasi Pelayanan Publik</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dokumen dan informasi penting terkait pelayanan publik di Kecamatan Taman Kota Madiun
          </p>
        </div>

        <div
          ref={serviceCarouselRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-4 py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {serviceInfo.map((info, index) => (
            <div
              key={info.id}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 overflow-hidden flex-shrink-0 w-80 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
              }`}
              style={{
                transitionDelay: isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                <img
                  src={info.image || "/placeholder.svg"}
                  alt={info.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4">
                <h3 className="text-gray-800 font-bold text-lg leading-tight text-center">
                  {info.title}
                </h3>
              </div>
            </div>
          ))}

          {serviceInfo.map((info, index) => (
            <div
              key={`duplicate-${info.id}`}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 overflow-hidden flex-shrink-0 w-80 opacity-100"
            >
              <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                <img
                  src={info.image || "/placeholder.svg"}
                  alt={info.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-4">
                <h3 className="text-gray-800 font-bold text-lg leading-tight text-center">
                  {info.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-2">
          {serviceInfo.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor(currentPosition / 320) % serviceInfo.length === index
                  ? "bg-blue-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => {
                if (serviceCarouselRef.current) {
                  serviceCarouselRef.current.scrollTo({
                    left: index * 320,
                    behavior: "smooth",
                  })
                }
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}