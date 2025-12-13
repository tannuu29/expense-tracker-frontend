import React, { useState, useEffect } from 'react'
import photo from '../assets/expense_logo.png'
import './LandingPage.css'
import Login from './Login'
import SignUp from './SignUp'

export default function LandingPage() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    return savedTheme
  })
  const [showLogin, setShowLogin] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [selectedUserType, setSelectedUserType] = useState('Employees')
  const [openFaq, setOpenFaq] = useState(null)
  const [emailOrPhone, setEmailOrPhone] = useState('')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    document.body.style.backgroundColor = theme === 'dark' ? '#1a3e2e' : '#f5f5f5'
    document.body.style.color = theme === 'dark' ? 'rgba(255, 255, 255, 0.87)' : '#1a1a1a'
  }, [theme])

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    document.documentElement.setAttribute('data-theme', savedTheme)
    document.body.style.backgroundColor = savedTheme === 'dark' ? '#1a3e2e' : '#f5f5f5'
    document.body.style.color = savedTheme === 'dark' ? 'rgba(255, 255, 255, 0.87)' : '#1a1a1a'
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  const handleLoginClick = () => {
    setShowLogin(true)
    setShowSignUp(false)
  }

  const handleSignUpClick = () => {
    setShowSignUp(true)
    setShowLogin(false)
  }

  const handleCloseAuth = () => {
    setShowLogin(false)
    setShowSignUp(false)
  }

  const switchToSignUp = () => {
    setShowLogin(false)
    setShowSignUp(true)
  }

  const switchToLogin = () => {
    setShowSignUp(false)
    setShowLogin(true)
  }

  const handleGetStarted = () => {
    if (emailOrPhone) {
      handleSignUpClick()
    } else {
      handleSignUpClick()
    }
  }

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    { q: "What is MoneyMap?", a: "MoneyMap is a comprehensive expense tracking application that helps you manage your personal and business expenses efficiently. Track every transaction, filter by payment mode, and monitor your spending patterns." },
    { q: "Who is MoneyMap for?", a: "MoneyMap is perfect for individuals, employees, business owners, and finance teams who want to take control of their expenses and track their spending accurately." },
    { q: "What kind of expenses can I track?", a: "You can track any type of expense - from daily purchases to business expenses. Categorize them by payment mode including Cash, Card, UPI, and Net Banking." },
    { q: "Can I use MoneyMap if my company doesn't use it?", a: "Yes! MoneyMap is available for personal use. You can sign up individually and start tracking your expenses right away." },
    { q: "How quickly can I get set up?", a: "Getting started with MoneyMap takes less than a minute. Simply sign up, and you can immediately start adding and tracking your expenses." },
    { q: "What does MoneyMap integrate with?", a: "MoneyMap is a standalone expense management solution. All your data is securely stored and accessible through our intuitive dashboard." },
    { q: "Can MoneyMap help with compliance?", a: "Yes! MoneyMap helps you maintain detailed expense records with dates, amounts, and payment methods, making it easier to track expenses for tax and compliance purposes." },
    { q: "How do I upload expenses?", a: "Adding expenses is simple! Just click 'Add Expense' on your dashboard, fill in the description, amount, payment mode, and date. Your expenses are saved instantly." },
    { q: "How much does it cost?", a: "MoneyMap offers a free tier for basic expense tracking. Check our pricing page for more details on premium features." },
    { q: "How do I get started?", a: "Click the 'Sign Up' button at the top of the page, create your account, and you'll be ready to start tracking expenses immediately!" }
  ]

  return (
    <div className="landing-container">
      <header className="landing-header-bar">
        <div className="top-logo-container">
          <div className="logo-wrapper">
            <img src={photo} alt="MoneyMap Logo" className="top-logo" />
          </div>
          <h1 className="top-logo-name">MoneyMap</h1>
        </div>
        
        <div className="landing-header-buttons">
          <button type="button" className="btn btn-outline-light login-btn" onClick={handleLoginClick}>Login</button>
          <button type="button" className="btn btn-success signup-btn" onClick={handleSignUpClick}>Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Try MoneyMap free for 30 days</h1>
          <div className="user-type-selector">
            <button 
              className={`user-type-btn ${selectedUserType === 'Personal Use' ? 'active' : ''}`}
              onClick={() => setSelectedUserType('Personal Use')}
            >
              Personal Use
            </button>
            <button 
              className={`user-type-btn ${selectedUserType === 'Business owners' ? 'active' : ''}`}
              onClick={() => setSelectedUserType('Business owners')}
            >
              Business owners
            </button>
            {/* <button 
              className={`user-type-btn ${selectedUserType === 'Finance/Accounting' ? 'active' : ''}`}
              onClick={() => setSelectedUserType('Finance/Accounting')}
            >
              Finance/Accounting
            </button> */}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <div className="step-card">
            <div className="step-icon receipt-icon">📝</div>
            <h3>Add Expenses</h3>
            <p>Quickly add expenses through our intuitive dashboard. Enter description, amount, payment mode, and date - it's that simple!</p>
          </div>
          <div className="step-card">
            <div className="step-icon report-icon">📊</div>
            <h3>Track & Filter</h3>
            <p>Filter expenses by payment mode (Cash, Card, UPI, Net Banking), date range, or amount. Get insights into your spending patterns.</p>
          </div>
          <div className="step-card">
            <div className="step-icon reimburse-icon">💰</div>
            <h3>Monitor Spending</h3>
            <p>View your total expenses at a glance. Edit or delete expenses as needed and keep your financial records up to date.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-hero-section">
        <div className="cta-hero-content">
          <div className="cta-text">
            <h2>Ready to simplify your receipt and expense management process?</h2>
            <p>Enter your email or phone number to make your company's money go further with MoneyMap's time-saving expense management tools.</p>
          </div>
          <div className="cta-input-section">
            <input
              type="text"
              placeholder="Enter your email or phone number"
              className="cta-input"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
            />
            <button className="cta-button" onClick={handleGetStarted}>Get Started</button>
            <div className="google-signin">
              <span>Or get started with</span>
              <div className="google-logo">G</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3>Expense Management</h3>
            <p>Create, edit, and delete expenses effortlessly. Track every transaction with detailed descriptions and payment modes.</p>
            <a href="#features" className="learn-more">Learn More</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Payment Mode Tracking</h3>
            <p>Track expenses across multiple payment methods - Cash, Card, UPI, and Net Banking. Filter and analyze spending by payment type.</p>
            <a href="#features" className="learn-more">Learn More</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Filtering</h3>
            <p>Filter expenses by payment mode, date range, or amount. Find exactly what you're looking for with powerful search capabilities.</p>
            <a href="#features" className="learn-more">Learn More</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Date Range Filtering</h3>
            <p>View expenses from specific date ranges. Perfect for monthly reports, tax preparation, and financial planning.</p>
            <a href="#features" className="learn-more">Learn More</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💵</div>
            <h3>Amount Filtering</h3>
            <p>Filter expenses by minimum and maximum amounts. Identify high-value transactions and analyze spending patterns.</p>
            <a href="#features" className="learn-more">Learn More</a>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Total Expense Tracking</h3>
            <p>Monitor your total expenses in real-time. Get an instant overview of your spending with our dashboard summary.</p>
            <a href="#features" className="learn-more">Learn More</a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2 className="section-title">FAQ</h2>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.q}</span>
                <span className="faq-icon">{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index && (
                <div className="faq-answer">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">Highly rated, easy to use</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-quote">"MoneyMap has completely transformed how I track my expenses. The filtering features are incredible!"</p>
            <p className="testimonial-desc">I can now easily see where my money is going and filter by payment mode or date. Highly recommend!</p>
            <div className="testimonial-author">
              <div className="author-avatar">JS</div>
              <div>
                <div className="author-name">John Smith</div>
                <div className="author-title">Small Business Owner</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-quote">"Simple, intuitive, and exactly what I needed for expense tracking."</p>
            <p className="testimonial-desc">The dashboard is clean and easy to use. Adding expenses takes seconds, and the filtering options are perfect for my needs.</p>
            <div className="testimonial-author">
              <div className="author-avatar">MJ</div>
              <div>
                <div className="author-name">Maria Johnson</div>
                <div className="author-title">Freelancer</div>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-quote">"Perfect for keeping track of all my expenses in one place."</p>
            <p className="testimonial-desc">Love the ability to filter by payment mode and date range. Makes tax time so much easier!</p>
            <div className="testimonial-author">
              <div className="author-avatar">RW</div>
              <div>
                <div className="author-name">Robert Williams</div>
                <div className="author-title">Employee</div>
              </div>
            </div>
          </div>
        </div>
        <div className="rating-summary">
          <div className="rating-stats">
            <div className="rating-number">4.5</div>
            <div className="rating-stars">★★★★★</div>
            <div className="rating-count">(4,889 reviews)</div>
          </div>
          <div className="rating-badges">
            <div className="badge">TOP RATED - 2025</div>
            <div className="badge">USER FAVORITE</div>
            <div className="badge">EASY TO USE</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Features</h4>
            <ul>
              <li><a href="#features">Expense Management</a></li>
              <li><a href="#features">Payment Mode Tracking</a></li>
              <li><a href="#features">Smart Filtering</a></li>
              <li><a href="#features">Date Range Filtering</a></li>
              <li><a href="#features">Amount Filtering</a></li>
              <li><a href="#features">Total Expense Tracking</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#support">Support</a></li>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Learn more</h4>
            <ul>
              <li><a href="#about">About MoneyMap</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
            <div className="social-links">
              <a href="#twitter" aria-label="Twitter">🐦</a>
              <a href="#facebook" aria-label="Facebook">📘</a>
              <a href="#linkedin" aria-label="LinkedIn">💼</a>
              <a href="#instagram" aria-label="Instagram">📷</a>
            </div>
          </div>
          <div className="footer-column">
            <h4>Get Started</h4>
            <ul>
              <li><a href="#" onClick={handleSignUpClick}>Create a new account</a></li>
              <li><a href="#" onClick={handleLoginClick}>Log in</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>©2024-2025 MoneyMap, Inc. All rights reserved.</p>
        </div>
      </footer>

      {showLogin && <Login onClose={handleCloseAuth} onSwitchToSignUp={switchToSignUp} />}
      {showSignUp && <SignUp onClose={handleCloseAuth} onSwitchToLogin={switchToLogin} />}
    </div>
  )
}
