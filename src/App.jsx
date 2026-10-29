import React, { useState, useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Phone,
  MapPin,
  MessageCircle,
  Calendar,
  ShieldCheck,
  Heart,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Sparkles,
  AlertCircle,
  Stethoscope,
  Smile,
  Navigation,
  ArrowRight,
  Send,
  Clock,
  Check
} from 'lucide-react'
import './App.css'

const CLINIC_INFO = {
  name: 'Dr. Kavitha Dental Care',
  phone: '+91 7396222120',
  phoneRaw: '+917396222120',
  whatsappRaw: '917396222120',
  address: 'Jaya Hospital, Kamareddy, Telangana, India',
  addressShort: 'Jaya Hospital, Kamareddy',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jaya+Hospital+Kamareddy+Telangana',
}

const SERVICES = [
  {
    id: 'general',
    title: 'General Dental Care',
    category: 'Essential Oral Health',
    description:
      'Comprehensive dental examinations, precision fillings, pain relief, and routine scaling to maintain healthy teeth and gums.',
    inclusions: [
      'Comprehensive oral examination',
      'Tooth fillings & restorations',
      'Gentle tooth pain management',
      'Ultrasonic cleaning & scaling',
    ],
    highlight: 'Daily preventative & restorative dentistry',
  },
  {
    id: 'preventive',
    title: 'Preventive Care',
    category: 'Proactive Protection',
    description:
      'Proactive care to protect your natural teeth and prevent oral complications before they cause discomfort.',
    inclusions: [
      'Routine dental wellness assessments',
      'Fluoride applications for enamel strength',
      'Gum & periodontal health evaluations',
      'Personalized at-home oral hygiene guidance',
    ],
    highlight: 'Long-term oral disease prevention',
  },
  {
    id: 'smile',
    title: 'Smile Care',
    category: 'Aesthetic Dentistry',
    description:
      'Aesthetic dental enhancements designed to restore harmony, balance, and natural brightness to your smile.',
    inclusions: [
      'Professional teeth brightening solutions',
      'Aesthetic composite bonding',
      'Gap closure & smile contouring',
      'Tooth shape & enamel rejuvenation',
    ],
    highlight: 'Natural & confident smile aesthetics',
  },
  {
    id: 'consultation',
    title: 'Consultations',
    category: 'Expert Evaluation',
    description:
      'One-on-one evaluations to listen to your dental concerns, discuss options transparently, and plan tailored care.',
    inclusions: [
      'Dedicated one-on-one doctor review',
      'Clear treatment plan explanations',
      'Second opinions on dental procedures',
      'Urgent evaluations for acute dental issues',
    ],
    highlight: 'Transparent guidance with zero pressure',
  },
]

export default function App() {
  const shouldReduceMotion = useReducedMotion()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedService, setSelectedService] = useState('General Dental Care')

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'General Dental Care',
    preferredTime: 'Any convenient time',
    notes: '',
  })
  const [errors, setErrors] = useState({})
  const [isCopied, setIsCopied] = useState(false)

  // Animation variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  }

  // Handle service pre-selection from service cards
  const handleSelectServiceFromCard = (serviceTitle) => {
    setSelectedService(serviceTitle)
    setFormData((prev) => ({ ...prev, service: serviceTitle }))
    const enquirySection = document.getElementById('enquiry')
    if (enquirySection) {
      enquirySection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Form field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}
    const trimmedName = formData.name.trim()
    const cleanPhone = formData.phone.replace(/[\s-]/g, '')

    if (!trimmedName) {
      newErrors.name = 'Please enter your full name.'
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.'
    }

    if (!cleanPhone) {
      newErrors.phone = 'Please enter your phone number.'
    } else {
      // Allow 10 digits or with +91 country code
      const phoneRegex = /^(\+91)?[6-9]\d{9}$/
      if (!phoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Generate WhatsApp message string
  const generateWhatsAppMessage = () => {
    const lines = [
      `*Appointment / Dental Enquiry*`,
      `Clinic: ${CLINIC_INFO.name}`,
      `Location: ${CLINIC_INFO.addressShort}`,
      `---------------------------------`,
      `*Patient Name:* ${formData.name.trim() || '[Your Name]'}`,
      `*Phone Number:* ${formData.phone.trim() || '[Your Phone]'}`,
      `*Service Requested:* ${formData.service}`,
      `*Preferred Time:* ${formData.preferredTime}`,
    ]

    if (formData.notes.trim()) {
      lines.push(`*Notes / Details:* ${formData.notes.trim()}`)
    }

    lines.push(`---------------------------------`)
    lines.push(`Hello, I would like to inquire about dental care at your Jaya Hospital clinic.`)

    return lines.join('\n')
  }

  // Handle form submission and launch WhatsApp
  const handleWhatsAppSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    const messageText = generateWhatsAppMessage()
    const encodedMessage = encodeURIComponent(messageText)
    const whatsappUrl = `https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodedMessage}`

    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const copyPhoneNumber = () => {
    navigator.clipboard?.writeText(CLINIC_INFO.phone)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2500)
  }

  return (
    <div className="clinic-app">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Top Banner Notice */}
      <div className="top-utility-bar">
        <div className="container utility-content">
          <div className="utility-badge">
            <span className="pulse-indicator" aria-hidden="true"></span>
            <span>Welcoming patients at Jaya Hospital, Kamareddy</span>
          </div>
          <div className="utility-contact">
            <a href={`tel:${CLINIC_INFO.phoneRaw}`} className="utility-phone">
              <Phone size={14} aria-hidden="true" />
              <span>Call: {CLINIC_INFO.phone}</span>
            </a>
            <span className="utility-divider">|</span>
            <a
              href={CLINIC_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="utility-map-link"
            >
              <MapPin size={14} aria-hidden="true" />
              <span>Jaya Hospital</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Header Navigation */}
      <header className="site-header">
        <div className="container header-container">
          <a href="#" className="clinic-brand" aria-label="Dr. Kavitha Dental Care Home">
            <div className="logo-wrapper">
              <img
                src="/logo.png"
                alt="Dr. Kavitha Dental Care Logo"
                className="clinic-logo-img"
                width="48"
                height="48"
              />
            </div>
            <div className="brand-text">
              <span className="brand-title">Dr. Kavitha</span>
              <span className="brand-subtitle">DENTAL CARE</span>
              <span className="brand-location">
                <MapPin size={11} aria-hidden="true" /> Kamareddy, Telangana
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="desktop-nav" aria-label="Primary Navigation">
            <a href="#services" className="nav-link">
              Services
            </a>
            <a href="#about" className="nav-link">
              About Clinic
            </a>
            <a href="#enquiry" className="nav-link">
              WhatsApp Enquiry
            </a>
            <a href="#contact" className="nav-link">
              Location & Contact
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="btn btn-primary-outline header-call-btn"
              aria-label={`Call clinic at ${CLINIC_INFO.phone}`}
            >
              <Phone size={16} aria-hidden="true" />
              <span>{CLINIC_INFO.phone}</span>
            </a>

            <a href="#enquiry" className="btn btn-teal header-book-btn">
              <MessageCircle size={16} aria-hidden="true" />
              <span>Enquire</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
            <div className="mobile-nav-inner">
              <nav className="mobile-links" aria-label="Mobile Navigation">
                <a
                  href="#services"
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Smile size={18} aria-hidden="true" />
                  <span>Services</span>
                </a>
                <a
                  href="#about"
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart size={18} aria-hidden="true" />
                  <span>About Clinic</span>
                </a>
                <a
                  href="#enquiry"
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  <span>WhatsApp Enquiry</span>
                </a>
                <a
                  href="#contact"
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MapPin size={18} aria-hidden="true" />
                  <span>Location & Contact</span>
                </a>
              </nav>

              <div className="mobile-cta-group">
                <a
                  href={`tel:${CLINIC_INFO.phoneRaw}`}
                  className="btn btn-primary-solid btn-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone size={18} aria-hidden="true" />
                  <span>Call {CLINIC_INFO.phone}</span>
                </a>
                <a
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Navigation size={18} aria-hidden="true" />
                  <span>Get Directions (Jaya Hospital)</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content">
        {/* HERO SECTION */}
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-ambient-glow" aria-hidden="true"></div>
          <div className="container hero-container">
            <motion.div
              className="hero-content"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <div className="hero-pill">
                <Sparkles size={16} className="pill-icon" aria-hidden="true" />
                <span>Dr. Kavitha Dental Care • Jaya Hospital, Kamareddy</span>
              </div>

              {/* Exact required heading */}
              <h1 id="hero-title" className="hero-title">
                A healthier smile starts with care.
              </h1>

              <p className="hero-lead">
                Providing gentle, personalized, and patient-first dentistry for you and your family
                at Jaya Hospital, Kamareddy. We focus on your comfort, clear communication, and
                comprehensive oral wellness.
              </p>

              <div className="hero-cta-group">
                <a href="#enquiry" className="btn btn-teal btn-lg">
                  <MessageCircle size={18} aria-hidden="true" />
                  <span>Book via WhatsApp</span>
                </a>
                <a
                  href={`tel:${CLINIC_INFO.phoneRaw}`}
                  className="btn btn-outline-dark btn-lg"
                  aria-label={`Call ${CLINIC_INFO.phone}`}
                >
                  <Phone size={18} aria-hidden="true" />
                  <span>Call: {CLINIC_INFO.phone}</span>
                </a>
                <a
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-lg hero-maps-btn"
                >
                  <MapPin size={18} aria-hidden="true" />
                  <span>Jaya Hospital</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              </div>

              {/* Reassurance Feature Highlights */}
              <div className="hero-highlights-list">
                <div className="highlight-item">
                  <CheckCircle2 size={18} className="highlight-icon" aria-hidden="true" />
                  <span>Patient-First Approach</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={18} className="highlight-icon" aria-hidden="true" />
                  <span>Hygienic Clinical Environment</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={18} className="highlight-icon" aria-hidden="true" />
                  <span>Central Kamareddy Facility</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual Card with Brand Logo */}
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="hero-card-frame">
                <div className="hero-logo-box">
                  <img
                    src="/logo.png"
                    alt="Dr. Kavitha Dental Care - Kamareddy, Telangana"
                    className="hero-logo-main"
                  />
                </div>

                <div className="hero-card-badge">
                  <div className="badge-icon-wrap">
                    <Heart size={20} aria-hidden="true" />
                  </div>
                  <div className="badge-details">
                    <span className="badge-title">Compassionate Dentistry</span>
                    <span className="badge-desc">Listening to every patient with care</span>
                  </div>
                </div>

                <div className="hero-card-location-badge">
                  <div className="location-icon-wrap">
                    <MapPin size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <span className="location-title">Jaya Hospital</span>
                    <span className="location-sub">Kamareddy, Telangana</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CORE VALUES / TRUST STRIP */}
        <section className="trust-strip-section" aria-label="Care commitments">
          <div className="container">
            <div className="trust-strip-grid">
              <div className="trust-card">
                <div className="trust-icon-box">
                  <Heart size={22} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="trust-heading">Gentle Patient Comfort</h3>
                  <p className="trust-text">
                    Prioritizing your ease and reassurance throughout every visit.
                  </p>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon-box">
                  <ShieldCheck size={22} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="trust-heading">Strict Sterilization</h3>
                  <p className="trust-text">
                    Maintaining high cleanliness and safety standards at Jaya Hospital.
                  </p>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon-box">
                  <CheckCircle2 size={22} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="trust-heading">Transparent Guidance</h3>
                  <p className="trust-text">
                    Clear explanations of treatments and options with no pressure.
                  </p>
                </div>
              </div>

              <div className="trust-card">
                <div className="trust-icon-box">
                  <MapPin size={22} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="trust-heading">Accessible in Kamareddy</h3>
                  <p className="trust-text">
                    Centrally situated inside Jaya Hospital for family dental care.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="services-section" aria-labelledby="services-title">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-eyebrow">Our Clinical Services</span>
              <h2 id="services-title" className="section-title">
                Comprehensive Dental Care Tailored to You
              </h2>
              <p className="section-subtitle">
                Thoughtful, individualized treatments designed to relieve discomfort, protect your
                natural teeth, and preserve your healthy smile.
              </p>
            </div>

            <motion.div
              className="services-grid"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {SERVICES.map((service) => (
                <motion.article
                  key={service.id}
                  className="service-card"
                  variants={fadeInVariants}
                >
                  <div className="service-card-top">
                    <span className="service-category">{service.category}</span>
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-description">{service.description}</p>
                  </div>

                  <div className="service-inclusions">
                    <span className="inclusions-label">Key Treatment Focus:</span>
                    <ul className="inclusions-list">
                      {service.inclusions.map((item, idx) => (
                        <li key={idx} className="inclusion-item">
                          <CheckCircle2 size={16} className="item-bullet" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="service-card-footer">
                    <button
                      type="button"
                      className="btn-service-action"
                      onClick={() => handleSelectServiceFromCard(service.title)}
                      aria-label={`Inquire about ${service.title} via WhatsApp`}
                    >
                      <span>Inquire About This Care</span>
                      <ChevronRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {/* Quick Consultation Callout */}
            <div className="consultation-callout">
              <div className="callout-content">
                <div className="callout-icon-wrap">
                  <Stethoscope size={28} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="callout-title">Not sure which treatment you need?</h3>
                  <p className="callout-text">
                    Schedule a dental consultation or reach out directly. We will evaluate your
                    symptoms and guide you through the most suitable options.
                  </p>
                </div>
              </div>
              <div className="callout-actions">
                <a href="#enquiry" className="btn btn-teal">
                  <MessageCircle size={16} aria-hidden="true" />
                  <span>Start WhatsApp Enquiry</span>
                </a>
                <a href={`tel:${CLINIC_INFO.phoneRaw}`} className="btn btn-outline-dark">
                  <Phone size={16} aria-hidden="true" />
                  <span>Call {CLINIC_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="about-section" aria-labelledby="about-title">
          <div className="container">
            <div className="about-grid">
              <motion.div
                className="about-image-column"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
              >
                <div className="about-visual-card">
                  <div className="about-logo-wrapper">
                    <img
                      src="/logo.png"
                      alt="Dr. Kavitha Dental Care Clinic Symbol"
                      className="about-logo-img"
                    />
                  </div>
                  <div className="about-badge-card">
                    <h4 className="about-badge-heading">Dr. Kavitha Dental Care</h4>
                    <p className="about-badge-sub">Jaya Hospital, Kamareddy</p>
                    <div className="about-badge-features">
                      <span>✓ Patient-first philosophy</span>
                      <span>✓ Clean & sanitized setup</span>
                      <span>✓ Honest medical guidance</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="about-content-column"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
              >
                <span className="section-eyebrow">About Dr. Kavitha Dental Care</span>
                <h2 id="about-title" className="section-title">
                  Patient-First Dentistry at Jaya Hospital
                </h2>

                <p className="about-paragraph">
                  At Dr. Kavitha Dental Care, we believe that visiting a dentist should be a
                  reassuring, gentle, and transparent experience. Centrally situated within Jaya
                  Hospital, Kamareddy, our clinic is committed to serving our local community with
                  compassionate oral healthcare.
                </p>

                <p className="about-paragraph">
                  Whether you require an immediate evaluation for tooth discomfort, routine
                  cleaning and cavity prevention, or thoughtful advice on smile enhancement, we take
                  the time to listen to your concerns and explain each procedure clearly.
                </p>

                {/* Core Pillars */}
                <div className="about-pillars">
                  <div className="pillar-item">
                    <div className="pillar-icon-box">
                      <Heart size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="pillar-title">Empathetic & Calm Care</h4>
                      <p className="pillar-desc">
                        We understand dental nervousness and take deliberate steps to ensure you feel
                        at ease throughout your appointment.
                      </p>
                    </div>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-icon-box">
                      <ShieldCheck size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="pillar-title">Sanitized & Safe Protocol</h4>
                      <p className="pillar-desc">
                        All dental instruments and procedural surfaces follow rigorous sterilization
                        and hygiene protocols.
                      </p>
                    </div>
                  </div>

                  <div className="pillar-item">
                    <div className="pillar-icon-box">
                      <MapPin size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="pillar-title">Convenient Kamareddy Location</h4>
                      <p className="pillar-desc">
                        Conveniently located inside Jaya Hospital, providing straightforward access
                        and parking for families.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="about-action-group">
                  <a href="#contact" className="btn btn-teal">
                    <span>Visit Our Clinic</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <a
                    href={`tel:${CLINIC_INFO.phoneRaw}`}
                    className="btn btn-outline-dark"
                  >
                    <Phone size={16} aria-hidden="true" />
                    <span>Call +91 7396222120</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* WHATSAPP ENQUIRY FORM SECTION */}
        <section id="enquiry" className="enquiry-section" aria-labelledby="enquiry-title">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-eyebrow">Direct Patient Communication</span>
              <h2 id="enquiry-title" className="section-title">
                WhatsApp Consultation & Appointment Enquiry
              </h2>
              <p className="section-subtitle">
                Fill out the form below to generate a pre-filled enquiry message. Review it, make
                any changes you like, and send it directly to Dr. Kavitha Dental Care via WhatsApp.
              </p>
            </div>

            <div className="enquiry-wrapper">
              {/* Form Column */}
              <motion.div
                className="enquiry-form-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
              >
                <form onSubmit={handleWhatsAppSubmit} noValidate>
                  {/* Name field */}
                  <div className="form-group">
                    <label htmlFor="patient-name" className="form-label">
                      Full Name <span className="required-star">*</span>
                    </label>
                    <input
                      id="patient-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Ramesh Kumar"
                      className={`form-input ${errors.name ? 'input-error' : ''}`}
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      required
                    />
                    {errors.name && (
                      <p id="name-error" className="form-error-msg" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="form-group">
                    <label htmlFor="patient-phone" className="form-label">
                      Mobile Number <span className="required-star">*</span>
                    </label>
                    <div className="phone-input-wrapper">
                      <span className="phone-prefix">+91</span>
                      <input
                        id="patient-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="7396222120"
                        maxLength={15}
                        className={`form-input phone-input ${errors.phone ? 'input-error' : ''}`}
                        aria-invalid={errors.phone ? 'true' : 'false'}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        required
                      />
                    </div>
                    {errors.phone && (
                      <p id="phone-error" className="form-error-msg" role="alert">
                        <AlertCircle size={14} aria-hidden="true" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                    <span className="input-hint">
                      We will connect with you on this WhatsApp number.
                    </span>
                  </div>

                  {/* Service selection */}
                  <div className="form-group">
                    <label htmlFor="patient-service" className="form-label">
                      Service / Reason for Visit
                    </label>
                    <select
                      id="patient-service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="General Dental Care">General Dental Care (Checkup, Scaling, Fillings)</option>
                      <option value="Preventive Care">Preventive Care (Routine check, Gum care)</option>
                      <option value="Smile Care">Smile Care (Whitening, Aesthetic enhancements)</option>
                      <option value="Consultations">Doctor Consultation / Second Opinion</option>
                      <option value="Tooth Pain / Emergency">Tooth Pain / Urgent Dental Concern</option>
                      <option value="Other Dental Enquiry">Other Dental Enquiry</option>
                    </select>
                  </div>

                  {/* Preferred Time Window */}
                  <div className="form-group">
                    <label htmlFor="patient-time" className="form-label">
                      Preferred Time of Day
                    </label>
                    <select
                      id="patient-time"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="Any convenient time">Any convenient time</option>
                      <option value="Morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>

                  {/* Additional notes */}
                  <div className="form-group">
                    <label htmlFor="patient-notes" className="form-label">
                      Additional Details or Questions (Optional)
                    </label>
                    <textarea
                      id="patient-notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Briefly describe your tooth issue, questions, or any specific requirements..."
                      className="form-textarea"
                    ></textarea>
                  </div>

                  {/* Direct submission */}
                  <button type="submit" className="btn btn-whatsapp btn-block btn-lg">
                    <Send size={18} aria-hidden="true" />
                    <span>Review & Open in WhatsApp</span>
                  </button>

                  {/* Clear privacy & non-storage disclosure */}
                  <div className="privacy-disclosure">
                    <ShieldCheck size={16} aria-hidden="true" />
                    <p>
                      <strong>Direct & Secure:</strong> Your message is not stored on any server or
                      database. Clicking above prepares your inquiry and opens WhatsApp directly on
                      your phone or browser for you to review and send to Dr. Kavitha Dental Care.
                    </p>
                  </div>
                </form>
              </motion.div>

              {/* Live Preview Column */}
              <motion.div
                className="enquiry-preview-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
              >
                <div className="preview-header">
                  <div className="preview-whatsapp-badge">
                    <MessageCircle size={18} aria-hidden="true" />
                    <span>WhatsApp Message Preview</span>
                  </div>
                  <span className="preview-status">Live Preview</span>
                </div>

                <div className="chat-preview-body">
                  <div className="chat-bubble">
                    <div className="chat-bubble-header">
                      <span className="chat-to">To: Dr. Kavitha Dental Care</span>
                      <span className="chat-number">+91 7396222120</span>
                    </div>
                    <pre className="chat-message-text">{generateWhatsAppMessage()}</pre>
                    <span className="chat-timestamp">Ready to send</span>
                  </div>
                </div>

                <div className="preview-footer-note">
                  <p>
                    Once WhatsApp opens, you can still edit or add more details before pressing
                    send. Our team will review your message and reply promptly.
                  </p>
                </div>

                <div className="direct-call-alternative">
                  <span>Prefer an immediate phone conversation?</span>
                  <a href={`tel:${CLINIC_INFO.phoneRaw}`} className="preview-phone-link">
                    <Phone size={15} aria-hidden="true" />
                    <span>Call +91 7396222120</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CONTACT & LOCATION SECTION */}
        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <div className="container">
            <div className="section-header text-center">
              <span className="section-eyebrow">Find Our Clinic</span>
              <h2 id="contact-title" className="section-title">
                Visit Dr. Kavitha Dental Care
              </h2>
              <p className="section-subtitle">
                Centrally located inside Jaya Hospital, Kamareddy, Telangana. Feel free to call us
                or message on WhatsApp before your visit.
              </p>
            </div>

            <div className="contact-grid">
              {/* Contact Details Cards */}
              <div className="contact-cards-col">
                {/* Phone Card */}
                <div className="contact-detail-card">
                  <div className="contact-icon-box">
                    <Phone size={24} aria-hidden="true" />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-label">Telephone & WhatsApp</span>
                    <h3 className="contact-heading">
                      <a href={`tel:${CLINIC_INFO.phoneRaw}`} className="tel-link">
                        {CLINIC_INFO.phone}
                      </a>
                    </h3>
                    <p className="contact-note">
                      Tap above to call immediately or enquire through WhatsApp.
                    </p>
                    <div className="contact-actions-row">
                      <a
                        href={`tel:${CLINIC_INFO.phoneRaw}`}
                        className="btn btn-sm btn-teal"
                        aria-label="Call clinic directly"
                      >
                        <Phone size={14} aria-hidden="true" />
                        <span>Call Now</span>
                      </a>
                      <button
                        type="button"
                        onClick={copyPhoneNumber}
                        className="btn btn-sm btn-ghost"
                        aria-label="Copy phone number to clipboard"
                      >
                        {isCopied ? <Check size={14} /> : null}
                        <span>{isCopied ? 'Copied!' : 'Copy Number'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Address Card */}
                <div className="contact-detail-card">
                  <div className="contact-icon-box">
                    <MapPin size={24} aria-hidden="true" />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-label">Clinic Location</span>
                    <h3 className="contact-heading">Jaya Hospital</h3>
                    <address className="clinic-address-text">
                      Kamareddy, Telangana, India
                    </address>
                    <p className="contact-note">
                      Located within Jaya Hospital campus. Easy accessibility and parking available.
                    </p>
                    <a
                      href={CLINIC_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-dark"
                    >
                      <Navigation size={14} aria-hidden="true" />
                      <span>Directions on Google Maps</span>
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </div>
                </div>

                {/* Quick Consultation Badge */}
                <div className="contact-detail-card highlight-card">
                  <div className="contact-icon-box teal-icon-box">
                    <MessageCircle size={24} aria-hidden="true" />
                  </div>
                  <div className="contact-detail-content">
                    <span className="contact-label">Have a Question?</span>
                    <h3 className="contact-heading">Chat Directly on WhatsApp</h3>
                    <p className="contact-note">
                      Send a brief query with your symptoms or preferred consultation time.
                    </p>
                    <a
                      href={`https://wa.me/${CLINIC_INFO.whatsappRaw}?text=${encodeURIComponent(
                        'Hello Dr. Kavitha Dental Care, I would like to inquire about dental care at Jaya Hospital, Kamareddy.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-whatsapp"
                    >
                      <Send size={14} aria-hidden="true" />
                      <span>Open WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Google Maps Search & Location Preview */}
              <div className="map-embed-col">
                <div className="map-container-frame">
                  <div className="map-header-bar">
                    <div className="map-info">
                      <MapPin size={16} className="text-teal" aria-hidden="true" />
                      <strong>Jaya Hospital, Kamareddy</strong>
                    </div>
                    <a
                      href={CLINIC_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-header-btn"
                    >
                      <span>Open Full Map</span>
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </div>

                  {/* Accessible Google Map Search embed */}
                  <div className="iframe-wrapper">
                    <iframe
                      title="Google Maps Location for Jaya Hospital, Kamareddy"
                      src="https://maps.google.com/maps?q=Jaya+Hospital+Kamareddy+Telangana&t=&z=15&ie=UTF8&iwloc=&output=embed"
                      width="100%"
                      height="380"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>

                  <div className="map-card-footer">
                    <p className="map-footer-text">
                      <MapPin size={14} aria-hidden="true" />
                      <span>Jaya Hospital, Kamareddy, Telangana</span>
                    </p>
                    <a
                      href={CLINIC_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-teal"
                    >
                      <Navigation size={14} aria-hidden="true" />
                      <span>Get Driving Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-container">
          <div className="footer-top-grid">
            {/* Branding Column */}
            <div className="footer-brand-col">
              <div className="footer-logo-row">
                <img
                  src="/logo.png"
                  alt="Dr. Kavitha Dental Care Logo"
                  className="footer-logo-img"
                  width="44"
                  height="44"
                />
                <div>
                  <h3 className="footer-brand-name">Dr. Kavitha</h3>
                  <span className="footer-brand-sub">DENTAL CARE</span>
                </div>
              </div>
              <p className="footer-about-text">
                Dedicated to providing gentle, patient-first dental care at Jaya Hospital,
                Kamareddy, Telangana. Your comfort and oral health are our highest priority.
              </p>
              <div className="footer-location-chip">
                <MapPin size={14} aria-hidden="true" />
                <span>Jaya Hospital, Kamareddy</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Navigation</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#about">About Clinic</a>
                </li>
                <li>
                  <a href="#enquiry">WhatsApp Enquiry</a>
                </li>
                <li>
                  <a href="#contact">Contact & Location</a>
                </li>
              </ul>
            </div>

            {/* Care Focus */}
            <div className="footer-links-col">
              <h4 className="footer-col-title">Dental Services</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="#services">General Dental Care</a>
                </li>
                <li>
                  <a href="#services">Preventive Care</a>
                </li>
                <li>
                  <a href="#services">Smile Care</a>
                </li>
                <li>
                  <a href="#services">Consultations</a>
                </li>
              </ul>
            </div>

            {/* Direct Contact */}
            <div className="footer-contact-col">
              <h4 className="footer-col-title">Get in Touch</h4>
              <p className="footer-contact-item">
                <Phone size={15} aria-hidden="true" />
                <a href={`tel:${CLINIC_INFO.phoneRaw}`}>{CLINIC_INFO.phone}</a>
              </p>
              <p className="footer-contact-item">
                <MapPin size={15} aria-hidden="true" />
                <span>Jaya Hospital, Kamareddy, Telangana, India</span>
              </p>
              <div className="footer-cta-box">
                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-whatsapp btn-block"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  <span>Connect on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p className="copyright-text">
              © {new Date().getFullYear()} Dr. Kavitha Dental Care. Jaya Hospital, Kamareddy. All
              rights reserved.
            </p>
            <p className="footer-disclaimer">
              Medical Notice: Dental information presented here is for general informational and
              scheduling purposes. Please consult directly for personalized clinical evaluation.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Quick Action Bar for Mobile Screens */}
      <div className="mobile-floating-bar" aria-label="Quick Mobile Actions">
        <a
          href={`tel:${CLINIC_INFO.phoneRaw}`}
          className="floating-action-btn call-action"
          aria-label="Call clinic now"
        >
          <Phone size={18} aria-hidden="true" />
          <span>Call Us</span>
        </a>
        <a
          href="#enquiry"
          className="floating-action-btn whatsapp-action"
          aria-label="Open WhatsApp enquiry form"
        >
          <MessageCircle size={18} aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
        <a
          href={CLINIC_INFO.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-action-btn maps-action"
          aria-label="Open location in Google Maps"
        >
          <MapPin size={18} aria-hidden="true" />
          <span>Location</span>
        </a>
      </div>
    </div>
  )
}
