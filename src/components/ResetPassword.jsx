import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API_BASE_URL } from '../utils/auth'
import './AuthForms.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [tokenError, setTokenError] = useState('')

  useEffect(() => {
    // Check if token is missing
    if (!token || token.trim() === '') {
      setTokenError('Invalid or expired link')
    }
  }, [token])

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

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitSuccess('')
    
    if (!token || token.trim() === '') {
      setTokenError('Invalid or expired link')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token.trim(),
          newPassword: formData.newPassword
        })
      })

      if (!response.ok) {
        let errorMessage = 'Failed to reset password. Please try again.'
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
        
        // Handle invalid/expired token
        if (response.status === 400 || response.status === 401 || response.status === 404) {
          setTokenError(errorMessage)
        } else {
          setSubmitError(errorMessage)
        }
        setIsLoading(false)
        return
      }

      // Success - get response message
      const responseText = await response.text()
      const successMessage = responseText || 'Password reset successful'
      setSubmitSuccess(successMessage)

      // Redirect to landing page (login available there) after 2-3 seconds
      setTimeout(() => {
        navigate('/', { replace: true })
      }, 2500)

    } catch (error) {
      console.error('Reset password error:', error)
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

  // Show error if token is missing
  if (tokenError) {
    return (
      <div className="register-page-container">
        <div className="register-form-container">
          <div className="auth-header">
            <h2 className="auth-title">Reset Password</h2>
            <p className="auth-subtitle">Password Reset Link Error</p>
          </div>

          <div style={{ padding: '0 40px 40px' }}>
            <div className="error-message" style={{ marginBottom: '24px', textAlign: 'center', padding: '16px', backgroundColor: '#ffe0e0', border: '1px solid #ff6b6b', borderRadius: '8px' }}>
              {tokenError}
            </div>

            <div className="auth-footer" style={{ borderTop: 'none', paddingTop: '0', marginTop: '0' }}>
              <p>
                <button 
                  type="button" 
                  className="auth-switch-link" 
                  onClick={() => navigate('/forgot-password')}
                >
                  Request a new reset link
                </button>
                {' or '}
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
      </div>
    )
  }

  return (
    <div className="register-page-container">
      <div className="register-form-container">
        <div className="auth-header">
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">Enter your new password</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                className={`form-input ${errors.newPassword ? 'form-input-error' : ''}`}
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {submitError && (
            <div className="error-message" style={{ marginBottom: '16px', textAlign: 'center' }}>
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="success-message" style={{ marginBottom: '16px', textAlign: 'center', color: '#28a745' }}>
              {submitSuccess}
              <div style={{ marginTop: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
                Redirecting to login page...
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading || !!submitSuccess}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
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

