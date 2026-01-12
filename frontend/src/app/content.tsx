import HeaderCarousel from "./carrousel-taman"
import AboutSection from "./about-section"
import NewsSection from "./portal-section"
import ServiceSection from "./service-info"

export default function Content() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <HeaderCarousel />
      <AboutSection />
      <NewsSection />
      <ServiceSection />
    </div>
  )
}
