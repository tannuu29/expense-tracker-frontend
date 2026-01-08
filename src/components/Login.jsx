import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './AuthForms.css'


const API_BASE_URL = "http://localhost:80"

export default function Login({ onClose, onSwitchToSignUp, registrationSuccess, onClearRegistrationSuccess }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Clear registration success message when user starts typing
  useEffect(() => {
    if (registrationSuccess && formData.usernameOrEmail) {
      onClearRegistrationSuccess?.()
    }
  }, [formData.usernameOrEmail, registrationSuccess, onClearRegistrationSuccess])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden' // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

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
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or Email is required'
    } else {
      // If it contains @, validate as email, otherwise accept as username
      if (formData.usernameOrEmail.includes('@')) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.usernameOrEmail)) {
          newErrors.usernameOrEmail = 'Please enter a valid email'
        }
      }
      // Username validation - just check it's not empty and has reasonable length
      else if (formData.usernameOrEmail.trim().length < 3) {
        newErrors.usernameOrEmail = 'Username must be at least 3 characters'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    console.log("LOGIN SUBMIT TRIGGERED"); // 🔥 ADD THIS
    e.preventDefault()
    setLoginError('')
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Call login API
      const loginUrl = `${API_BASE_URL}/login`;
      console.log('Attempting login to:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.usernameOrEmail, // Backend expects "username" field
          password: formData.password
        })
      })

      // Handle 401 Unauthorized - logout if token exists, show error
      if (response.status === 401) {
        // Clear any existing tokens (logout)
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setLoginError('Invalid username or password. Please try again.')
        setIsLoading(false)
        return
      }

      // Handle 403 Forbidden - do NOT logout, just show error
      if (response.status === 403) {
        setLoginError('Access forbidden. Please contact administrator.')
        setIsLoading(false)
        return
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        setLoginError(errorData.message || `Login failed (${response.status}). Please try again.`)
        setIsLoading(false)
        return
      }

      // Success - get token and role from response
      const data = await response.json()
      
      if (data.token) {
        // Store JWT token in localStorage under key "token"
        localStorage.setItem('token', data.token)
        
        // Store user role in localStorage under key "role"
        if (data.role) {
          localStorage.setItem('role', data.role)
        }
        
        // Minimal console logs for debugging
        console.log('Login successful - Token stored:', data.token.substring(0, 20) + '...')
        console.log('Login successful - Role stored:', data.role || 'N/A')
        
        // Close modal and redirect to dashboard
        onClose()
        // Use navigate instead of window.location.href to avoid full page reload
        navigate('/dashboard', { replace: true })
      } else {
        setLoginError('Invalid response from server. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        setLoginError('Cannot connect to server. Please make sure the backend server is running on http://localhost:80')
      } else {
        setLoginError('Network error. Please check your connection and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }
 
  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

{location.state?.registered && (
  <div className="success-message">
    Registration successful! Please login.
  </div>
)}

        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Login to your MoneyMap account</p>
          {registrationSuccess && (
            <div className="success-message" style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#d4edda', 
              border: '1px solid #c3e6cb', 
              borderRadius: '8px',
              color: '#155724',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}>
              {registrationSuccess.message}
            </div>
          )}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usernameOrEmail" className="form-label">
              Username or Email Address
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              className={`form-input ${errors.usernameOrEmail ? 'form-input-error' : ''}`}
              placeholder="Enter your username or email"
              value={formData.usernameOrEmail}
              onChange={handleChange}
            />
            {errors.usernameOrEmail && <span className="error-message">{errors.usernameOrEmail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
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
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" />
              <span>Remember me</span>
            </label>
            <button 
              type="button" 
              className="forgot-password-link"
              onClick={() => {
                onClose()
                navigate('/forgot-password')
              }}
            >
              Forgot password?
            </button>
          </div>

          {loginError && (
            <div className="error-message" style={{ marginBottom: '16px', textAlign: 'center' }}>
              {loginError}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <button type="button" className="auth-switch-link" onClick={onSwitchToSignUp}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
