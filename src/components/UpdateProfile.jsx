import React, { useState } from 'react'
import './AuthForms.css'

const API_BASE_URL = 'http://localhost:80'

export default function UpdateProfile() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '', // shown but NOT sent to backend
    email: '',
    mobile: '',
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' }) // type: 'success' | 'error' | ''

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}

    if (!formData.fullName.trim()) next.fullName = 'Full name is required'

    if (!formData.email.trim()) next.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) next.email = 'Enter a valid email'

    if (!formData.mobile.trim()) next.mobile = 'Mobile is required'
    else if (!/^\d{10}$/.test(formData.mobile.trim())) next.mobile = 'Mobile must be 10 digits'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: '', message: '' })

    if (!validate()) return

    const token = localStorage.getItem('token')
    if (!token) {
      setStatus({ type: 'error', message: 'You are not logged in. Please login again.' })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
        }),
      })

      // 🔥 HANDLE AUTH PROPERLY
      if (res.status === 401) {
        localStorage.removeItem('token')
        setStatus({ type: 'error', message: 'Session expired. Please login again.' })
        return
      }

      if (res.status === 403) {
        setStatus({ type: 'error', message: 'You are not allowed to update profile.' })
        return
      }

      if (!res.ok) {
        let message = 'Profile update failed. Please try again.'
        try {
          const data = await res.json()
          message = data.message || message
        } catch {}
        setStatus({ type: 'error', message })
        return
      }

      const data = await res.json()
      setStatus({ type: 'success', message: data.message || 'Profile updated successfully' })
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-modal" style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="auth-header">
        <h2 className="auth-title">Profile</h2>
        <p className="auth-subtitle">Update your details (username cannot be changed)</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
          }}
        >
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className={`form-input ${errors.fullName ? 'form-input-error' : ''}`}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username (read-only)
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Managed by your account"
              readOnly
              disabled
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="mobile">
              Mobile
            </label>
            <input
              id="mobile"
              name="mobile"
              type="text"
              className={`form-input ${errors.mobile ? 'form-input-error' : ''}`}
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile"
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>
        </div>

        <div style={{ height: 8 }} />

        {status.message && (
          <div
            className="error-message"
            style={{
              textAlign: 'center',
              color: status.type === 'success' ? '#28a745' : undefined,
              marginBottom: 16,
            }}
          >
            {status.message}
          </div>
        )}

        <button className="auth-submit-btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}


