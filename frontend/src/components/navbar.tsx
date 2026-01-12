"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import NAV_MENU, { type NavItem as NavMenuItem, type NavChild } from "@/types/navMenu"
import Image from "next/image"

interface DropdownMenuProps {
  items: NavChild[]
  onClose?: () => void
}

interface NavItemProps {
  item: NavMenuItem
  isMobile?: boolean
}

interface SearchResult {
  id: number
  title: string
  slug: string
  excerpt?: string
  thumbnail_image?: {
    id: number
    path: string
    caption?: string
  }
  category?: {
    name: string
    slug: string
  }
  categories?: Array<{
    id: number
    name: string
  }>
  created_at: string
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items = [], onClose = () => {} }) => (
  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out z-50">
    {items.map((item, index) => (
      <a
        key={`${item.name}-${index}`}
        href={item.href}
        onClick={onClose}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
      >
        {item.name}
      </a>
    ))}
  </div>
)

const MenuItem: React.FC<NavItemProps> = ({ item, isMobile = false }) => {
  const [open, setOpen] = useState<boolean>(false)
  const hasDropdown = item.children && item.children.length > 0

  const itemClasses = `flex items-center justify-between cursor-pointer px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded transition-all duration-150 ${
    isMobile ? "w-full" : ""
  }`

  const handleClick = () => {
    if (isMobile && hasDropdown) {
      setOpen(!open)
    }
  }

  return (
    <li className={`relative group ${isMobile ? "w-full" : ""}`}>
      {hasDropdown ? (
        <div className={itemClasses} onClick={handleClick}>
          <span>{item.name}</span>
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${
              isMobile && open ? "rotate-180" : "group-hover:rotate-180"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      ) : (
        <a href={item.href || "#"} className={itemClasses}>
          <span>{item.name}</span>
        </a>
      )}

      {hasDropdown &&
        (isMobile ? (
          <div
            className={`overflow-hidden transition-all duration-200 ease-out ${
              open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="pl-4 py-2 space-y-1">
              {item.children!.map((child, index) => (
                <li key={`${child.name}-${index}`}>
                  <a
                    href={child.href}
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors duration-150"
                  >
                    {child.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <DropdownMenu items={item.children!} />
        ))}
    </li>
  )
}

// Search Result Item Component - Enhanced Clickability
const SearchResultItem: React.FC<{
  result: SearchResult
  onSelect: (result: SearchResult) => void
}> = ({ result, onSelect }) => {
  const handleClick = () => {
    onSelect(result)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelect(result)
    }
  }

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Buka berita: ${result.title}`}
      className="w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-b-0 focus:outline-none focus:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-inset"
    >
      <div className="flex gap-3">
        {result.thumbnail_image && (
          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${result.thumbnail_image.path}`}
              alt={result.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/image/DINAS KOMUNIKASI DAN INFORMATIKA KOTA MADIUN.png"
              }}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{result.title}</h4>
          {result.excerpt && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{result.excerpt}</p>}
          <div className="flex items-center gap-2 mt-2">
            {(result.category?.name || (result.categories && result.categories[0]?.name)) && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {result.category?.name || result.categories?.[0]?.name}
              </span>
            )}
            <span className="text-xs text-gray-500">{new Date(result.created_at).toLocaleDateString("id-ID")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simplified search hook - menggunakan pola yang sama dengan anime
const useSimpleSearch = () => {
  const [query, setQuery] = useState("")
  const [allNews, setAllNews] = useState<SearchResult[]>([])
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Load semua berita sekali saat komponen dimount
  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        const response = await fetch(`${baseUrl}/api/news?per_page=100`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          const newsData = data.data ? data.data : Array.isArray(data) ? data : []
          setAllNews(newsData)
          console.log("All news loaded:", newsData.length)
        }
      } catch (error) {
        console.error("Error loading news:", error)
      }
    }

    fetchAllNews()
  }, [])

  // Filter client-side seperti di anime
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)

    if (!searchQuery.trim()) {
      setFilteredResults([])
      setIsVisible(false)
      return
    }

    setIsVisible(true)

    // Filter langsung di client seperti anime
    const filtered = allNews
      .filter(
        (news) =>
          news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (news.excerpt && news.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (news.category?.name && news.category.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (news.categories &&
            news.categories.some((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))),
      )
      .slice(0, 5) // Limit to 5 results

    setFilteredResults(filtered)
    console.log("Filtered results:", filtered.length)
  }

  const clearSearch = () => {
    setQuery("")
    setFilteredResults([])
    setIsVisible(false)
  }

  return {
    query,
    results: filteredResults,
    isLoading,
    isVisible,
    handleSearch,
    clearSearch,
    setIsVisible,
    totalNews: allNews.length,
  }
}

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { query, results, isLoading, isVisible, handleSearch, clearSearch, setIsVisible, totalNews } = useSimpleSearch()

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsScrolled(scrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setIsVisible])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsVisible(false)
      // Tidak clear search agar query tetap ada di URL
      router.push(`/berita/cari?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleResultSelect = (result: SearchResult) => {
    setIsVisible(false)
    clearSearch()
    router.push(`/berita/${result.slug}`)
  }

  const handleInputFocus = () => {
    if (query) {
      setIsVisible(true)
    }
  }

  const handleViewAllResults = () => {
    if (query.trim()) {
      setIsVisible(false)
      // Tidak clear search agar query tetap ada di URL
      router.push(`/berita/cari?q=${encodeURIComponent(query.trim())}`)
    }
  }

  // Handle keyboard navigation for search results
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" && results.length > 0) {
      e.preventDefault()
      // Focus first result
      const firstResult = document.querySelector('[role="button"][aria-label*="Buka berita"]') as HTMLElement
      if (firstResult) {
        firstResult.focus()
      }
    }
  }

  return (
    <>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="Kembali ke Halaman Utama">
              <div className="flex items-center">
                <div className="relative w-[160px] h-[40px]">
                  <Image
                    src="/image/madkot.png"
                    alt="Logo Taman"
                    fill
                    className="object-contain"
                    sizes="160px"
                    priority
                  />
                </div>
              </div>
            </Link>
            <div className="flex-1 max-w-xl mx-8" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={handleInputFocus}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={`Cari berita... (${totalNews} berita tersedia)`}
                  className="w-full px-4 py-2 pl-10 pr-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </form>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200">
                Taman Terdepan
              </button>
              <button
                onClick={() => window.open("mailto:kecamatantaman@madiunkota.go.id", "_blank")}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Kirim Email ke Kecamatan Taman"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation section remains the same */}
      <nav
        className={`sticky top-0 bg-white border-b border-gray-100 z-40 transition-all duration-200 ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <ul className="hidden lg:flex items-center space-x-8">
              {NAV_MENU.map((item, index) => (
                <MenuItem key={`nav-${item.name}-${index}`} item={item} />
              ))}
            </ul>

            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-all duration-200"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <span
                  className={`bg-current h-0.5 w-5 rounded transition-all duration-200 ${
                    open ? "rotate-45 translate-y-0.5" : ""
                  }`}
                ></span>
                <span
                  className={`bg-current h-0.5 w-5 rounded transition-all duration-200 ${open ? "opacity-0" : "mt-1"}`}
                ></span>
                <span
                  className={`bg-current h-0.5 w-5 rounded transition-all duration-200 ${
                    open ? "-rotate-45 -translate-y-1/2" : "mt-1"
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile menu section */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-200 ease-out ${
              open ? "max-h-screen pb-4" : "max-h-0"
            }`}
          >
            <div className="pt-4 border-t border-gray-100">
              <div className="mb-4" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={handleInputFocus}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Cari berita..."
                    className="w-full px-4 py-2 pl-10 pr-10 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {query && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </form>
              </div>

              <ul className="space-y-2">
                {NAV_MENU.map((item, index) => (
                  <MenuItem key={`mobile-nav-${item.name}-${index}`} item={item} isMobile />
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200">
                  Taman Terdepan
                </button>
                <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  Kontak
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
