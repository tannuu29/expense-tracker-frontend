import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../utils/auth'
import './AuthForms.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

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
        [name]: ''
      }))
    }
    // Clear success/error messages when user starts typing
    if (submitError || submitSuccess) {
      setSubmitError('')
      setSubmitSuccess('')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email.trim()
        })
      })

      if (!response.ok) {
        let errorMessage = 'Failed to send password reset link. Please try again.'
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch {
          // If response is not JSON, use default message
        }
        setSubmitError(errorMessage)
        setIsLoading(false)
        return
      }

      // Success - get response message
      const responseText = await response.text()
      const successMessage = responseText || 'Password reset link sent to your email'
      setSubmitSuccess(successMessage)

    } catch (error) {
      console.error('Forgot password error:', error)
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        setSubmitError('Cannot connect to server. Please make sure the backend server is running on http://localhost:80')
      } else {
        setSubmitError('Network error. Please check your connection and try again.')
      }
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-page-container">
      <div className="register-form-container">
        <div className="auth-header">
          <h2 className="auth-title">Forgot Password</h2>
          <p className="auth-subtitle">Enter your email to receive a password reset link</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {submitError && (
            <div className="error-message" style={{ marginBottom: '16px', textAlign: 'center' }}>
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="success-message" style={{ marginBottom: '16px', textAlign: 'center', color: '#28a745' }}>
              {submitSuccess}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <button 
              type="button" 
              className="auth-switch-link" 
              onClick={() => navigate('/')}
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

