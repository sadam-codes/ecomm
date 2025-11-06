import React, { useState, useEffect } from 'react'
import Stepper from './Stepper'

const ProductFormWithStepper = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  submitButtonText = 'Create Product'
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])

  const steps = [
    {
      id: 'basic-info',
      title: 'Basic Info',
      description: 'Essential details'
    },
    {
      id: 'product-details',
      title: 'Details',
      description: 'Additional info'
    },
    {
      id: 'specifications',
      title: 'Specs',
      description: 'Technical details'
    },
    {
      id: 'media',
      title: 'Media',
      description: 'Product images'
    }
  ]

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    price: initialData.price || '',
    stock: initialData.stock || '',
    category: initialData.category || 'watches',
    status: initialData.status || 'active',
    brand: initialData.brand || '',
    model: initialData.model || '',
    discount: initialData.discount || '',
    images: initialData.images || [],
    specifications: initialData.specifications || {},
  })

  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState(initialData.images || [])
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateStep = (stepIndex) => {
    const newErrors = {}

    switch (stepIndex) {
      case 0: // Basic Info - REQUIRED FIELDS
        if (!formData.name.trim()) {
          newErrors.name = 'Product name is required'
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
          newErrors.price = 'Valid price is required'
        }
        if (!formData.stock || parseInt(formData.stock) < 0) {
          newErrors.stock = 'Valid stock quantity is required'
        }
        if (!formData.category) {
          newErrors.category = 'Category is required'
        }
        if (formData.discount && (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
          newErrors.discount = 'Discount must be between 0 and 100'
        }
        break
      case 1: // Product Details - REQUIRED FIELDS
        if (!formData.description.trim()) {
          newErrors.description = 'Product description is required'
        }
        if (!formData.brand.trim()) {
          newErrors.brand = 'Brand is required'
        }
        if (formData.discount && (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
          newErrors.discount = 'Discount must be between 0 and 100'
        }
        break
      case 2: // Specifications - OPTIONAL
        // Optional step - no validation required
        break
      case 3: // Media - OPTIONAL
        // Optional step - no validation required
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => [...new Set([...prev, currentStep])])
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleStepClick = (stepIndex) => {
    // Only allow clicking on completed steps, current step, or previous steps
    if (completedSteps.includes(stepIndex) || stepIndex === currentStep || stepIndex < currentStep) {
      setCurrentStep(stepIndex)
    } else {
      // Show validation message for incomplete steps
      const stepName = steps[stepIndex]?.title || 'Step'
      alert(`Please complete the current step before proceeding to ${stepName}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Final validation
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required'
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setCurrentStep(0) // Go back to first step if validation fails
      return
    }

    // Convert string values to appropriate types
    const submitData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category,
      status: formData.status,
      brand: formData.brand,
      model: formData.model,
      discount: formData.discount ? parseFloat(formData.discount) : null,
      // Don't include images in form data - they're sent as separate files
      specifications: Object.keys(formData.specifications).length > 0 ? formData.specifications : null,
    }

    onSubmit(submitData, imageFiles)
  }

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }))
  }

  const addSpecification = () => {
    const newKey = `spec_${Object.keys(formData.specifications).length + 1}`
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newKey]: ''
      }
    }))
  }

  const removeSpecification = (key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return {
        ...prev,
        specifications: newSpecs
      }
    })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(prev => [...prev, ...files])

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="form-grid">
              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field ${errors.name ? 'input-field-error' : ''}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-danger-600">{errors.name}</p>}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter product description"
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label htmlFor="category" className="form-label">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="watches">Watches</option>
                    <option value="shoes">Shoes</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label htmlFor="price" className="form-label">
                    Price *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={`input-field ${errors.price ? 'input-field-error' : ''}`}
                    placeholder="0.00"
                  />
                  {errors.price && <p className="mt-1 text-sm text-danger-600">{errors.price}</p>}
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label htmlFor="stock" className="form-label">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className={`input-field ${errors.stock ? 'input-field-error' : ''}`}
                    placeholder="0"
                  />
                  {errors.stock && <p className="mt-1 text-sm text-danger-600">{errors.stock}</p>}
                </div>
              </div>
            </div>
          </div>
        )

      case 1: // Product Details
        return (
          <div className="space-y-6">
            <div className="form-grid">
              <div>
                <div className="form-group">
                  <label htmlFor="brand" className="form-label">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label htmlFor="model" className="form-label">
                    Model
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter model name"
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label htmlFor="discount" className="form-label">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                    className={`input-field ${errors.discount ? 'input-field-error' : ''}`}
                    placeholder="0.00"
                  />
                  <p className="mt-1 text-xs text-gray-500">Discount percentage (0-100%)</p>
                  {errors.discount && <p className="mt-1 text-sm text-danger-600">{errors.discount}</p>}
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 2: // Specifications
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Product Specifications</h3>
              <button
                type="button"
                onClick={addSpecification}
                className="btn-secondary"
              >
                Add Specification
              </button>
            </div>

            {Object.keys(formData.specifications).length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No specifications</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding your first specification.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Specification name"
                      className="input-field flex-1"
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value
                        if (newKey !== key) {
                          setFormData(prev => {
                            const newSpecs = { ...prev.specifications }
                            newSpecs[newKey] = newSpecs[key]
                            delete newSpecs[key]
                            return {
                              ...prev,
                              specifications: newSpecs
                            }
                          })
                        }
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      className="input-field flex-1"
                      value={value}
                      onChange={(e) => handleSpecificationChange(key, e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-danger-600 hover:text-danger-700 p-2 rounded-lg hover:bg-danger-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 3: // Media
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Images</h4>
                  <div className="flex flex-wrap gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="image-preview-img"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="image-remove-btn"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="file-upload">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-upload-input"
                  id="file-upload"
                />
                <div className="file-upload-content">
                  <svg className="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                  </svg>
                  <div className="file-upload-text">
                    Click to upload images or drag and drop
                  </div>
                  <div className="file-upload-hint">
                    PNG, JPG, GIF up to 10MB each
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="stepper-progress-bar">
        <div
          className="stepper-progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Step Content */}
      <div className="stepper-content">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="stepper-navigation">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`stepper-nav-btn ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : 'stepper-nav-btn-secondary'}`}
        >
          Previous
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="stepper-nav-btn stepper-nav-btn-primary"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="stepper-nav-btn stepper-nav-btn-success"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </div>
            ) : (
              submitButtonText
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProductFormWithStepper
