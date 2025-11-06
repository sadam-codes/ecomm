// Simple browser toast notifications
export const showToast = (message, type = 'info') => {
  // Check if browser supports notifications
  if ('Notification' in window) {
    // Request permission if not already granted
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification(message, type)
        }
      })
    } else if (Notification.permission === 'granted') {
      showNotification(message, type)
    }
  }
  
  // Fallback to alert for browsers that don't support notifications
  if (Notification.permission === 'denied' || !('Notification' in window)) {
    alert(message)
  }
}

const showNotification = (message, type) => {
  const notification = new Notification('E-Commerce App', {
    body: message,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'ecommerce-toast',
    requireInteraction: false,
    silent: false
  })
  
  // Auto close after 3 seconds
  setTimeout(() => {
    notification.close()
  }, 3000)
  
  // Handle click to focus window
  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}

// Convenience methods
export const showSuccess = (message) => showToast(message, 'success')
export const showError = (message) => showToast(message, 'error')
export const showInfo = (message) => showToast(message, 'info')
export const showWarning = (message) => showToast(message, 'warning')
