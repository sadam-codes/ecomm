import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Component that automatically scrolls to top on route change
 * Place this component in your main App component or router
 */
const ScrollToTop = () => {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top when location changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Smooth scroll animation
    })
  }, [location.pathname, location.search, location.hash])

  // This component doesn't render anything
  return null
}

export default ScrollToTop
