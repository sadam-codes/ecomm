import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [primaryColor, setPrimaryColor] = useState('blue')
  const [accentColor, setAccentColor] = useState('purple')
  const [fontSize, setFontSize] = useState('medium')
  const [compactMode, setCompactMode] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme')
        const savedPrimaryColor = localStorage.getItem('primaryColor')
        const savedAccentColor = localStorage.getItem('accentColor')
        const savedFontSize = localStorage.getItem('fontSize')
        const savedCompactMode = localStorage.getItem('compactMode')

        if (savedTheme) setTheme(savedTheme)
        if (savedPrimaryColor) setPrimaryColor(savedPrimaryColor)
        if (savedAccentColor) setAccentColor(savedAccentColor)
        if (savedFontSize) setFontSize(savedFontSize)
        if (savedCompactMode) setCompactMode(JSON.parse(savedCompactMode))
      } catch (error) {
        console.error('Error loading theme from localStorage:', error)
      }
    }

    if (typeof window !== 'undefined') {
      loadTheme()
    }
  }, [])

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.error('Error saving theme to localStorage:', error)
    }
  }, [theme])

  useEffect(() => {
    try {
      localStorage.setItem('primaryColor', primaryColor)
    } catch (error) {
      console.error('Error saving primaryColor to localStorage:', error)
    }
  }, [primaryColor])

  useEffect(() => {
    try {
      localStorage.setItem('accentColor', accentColor)
    } catch (error) {
      console.error('Error saving accentColor to localStorage:', error)
    }
  }, [accentColor])

  useEffect(() => {
    try {
      localStorage.setItem('fontSize', fontSize)
    } catch (error) {
      console.error('Error saving fontSize to localStorage:', error)
    }
  }, [fontSize])

  useEffect(() => {
    try {
      localStorage.setItem('compactMode', JSON.stringify(compactMode))
    } catch (error) {
      console.error('Error saving compactMode to localStorage:', error)
    }
  }, [compactMode])

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      console.log('Applying theme:', { theme, primaryColor, accentColor, fontSize, compactMode })
      document.documentElement.setAttribute('data-theme', theme)
      document.documentElement.setAttribute('data-primary-color', primaryColor)
      document.documentElement.setAttribute('data-accent-color', accentColor)
      document.documentElement.setAttribute('data-font-size', fontSize)
      document.documentElement.setAttribute('data-compact-mode', compactMode)
      
      // Force a re-render by adding a class
      document.body.className = `theme-${theme} primary-${primaryColor}`
    }
  }, [theme, primaryColor, accentColor, fontSize, compactMode])

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
  }

  const updatePrimaryColor = (newColor) => {
    setPrimaryColor(newColor)
  }

  const updateAccentColor = (newColor) => {
    setAccentColor(newColor)
  }

  const updateFontSize = (newSize) => {
    setFontSize(newSize)
  }

  const updateCompactMode = (newMode) => {
    setCompactMode(newMode)
  }

  const resetTheme = () => {
    setTheme('light')
    setPrimaryColor('blue')
    setAccentColor('purple')
    setFontSize('medium')
    setCompactMode(false)
  }

  const value = {
    theme,
    primaryColor,
    accentColor,
    fontSize,
    compactMode,
    updateTheme,
    updatePrimaryColor,
    updateAccentColor,
    updateFontSize,
    updateCompactMode,
    resetTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
