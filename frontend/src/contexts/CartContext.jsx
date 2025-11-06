import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({})

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  // Initialize with data from localStorage immediately
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart')
        return savedCart ? JSON.parse(savedCart) : []
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
        return []
      }
    }
    return []
  })
  
  const [wishlist, setWishlist] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedWishlist = localStorage.getItem('wishlist')
        return savedWishlist ? JSON.parse(savedWishlist) : []
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error)
        return []
      }
    }
    return []
  })
  
  const [isLoading, setIsLoading] = useState(false)

  // Save to localStorage whenever cart or wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart to localStorage:', error)
    }
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error)
    }
  }, [wishlist])

  const addToCart = async (product, quantity = 1) => {
    console.log('Adding to cart:', product, quantity)
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCart(prevCart => {
        console.log('Current cart:', prevCart)
        const existingItem = prevCart.find(item => item.id === product.id)
        
        if (existingItem) {
          const updatedCart = prevCart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
          console.log('Updated existing item:', updatedCart)
          return updatedCart
        } else {
          const newCart = [...prevCart, { id: product.id, quantity, product }]
          console.log('Added new item:', newCart)
          return newCart
        }
      })
      
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const addToWishlist = (productId) => {
    console.log('Adding to wishlist:', productId)
    if (!wishlist.includes(productId)) {
      setWishlist(prev => {
        const newWishlist = [...prev, productId]
        console.log('New wishlist:', newWishlist)
        return newWishlist
      })
    }
  }

  const removeFromWishlist = (productId) => {
    console.log('Removing from wishlist:', productId)
    setWishlist(prev => {
      const newWishlist = prev.filter(id => id !== productId)
      console.log('New wishlist:', newWishlist)
      return newWishlist
    })
  }

  const toggleWishlist = (productId) => {
    console.log('Toggling wishlist for product:', productId)
    console.log('Current wishlist:', wishlist)
    console.log('Is in wishlist:', wishlist.includes(productId))
    
    if (wishlist.includes(productId)) {
      console.log('Removing from wishlist')
      removeFromWishlist(productId)
    } else {
      console.log('Adding to wishlist')
      addToWishlist(productId)
    }
    
    // Force a re-render by updating state
    setTimeout(() => {
      console.log('Wishlist after toggle:', wishlist)
    }, 100)
  }

  const isInWishlist = (productId) => {
    return wishlist.includes(productId)
  }

  const getCartItem = (productId) => {
    return cart.find(item => item.id === productId)
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const getCartCount = () => {
    const count = cart.reduce((total, item) => total + item.quantity, 0)
    console.log('Cart count calculation:', { cart, count })
    return count
  }

  const value = {
    cart,
    wishlist,
    isLoading,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getCartItem,
    getCartTotal,
    getCartCount,
    getWishlistCount: () => {
      const count = wishlist.length
      console.log('Wishlist count calculation:', { wishlist, count })
      return count
    }
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
