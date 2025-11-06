import React from 'react'

const LoadingFallback = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
        <p className="text-sm text-gray-500 mt-2">
          If this takes too long, please refresh the page
        </p>
      </div>
    </div>
  )
}

export default LoadingFallback
