import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Custom hook that scrolls to top of page on route change
 * Usage: Call useScrollToTop() in any component that needs scroll-to-top behavior
 */
const useScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth scroll animation
    })
  }, [location.pathname, location.search, location.hash])
}

export default useScrollToTop
