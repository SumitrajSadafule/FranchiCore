import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import feedbackService from '../../services/feedbackService';
import franchiseService from '../../services/franchiseService';
import './ContactPage.css';
import MapView from '../../components/common/MapView';


window.debugFranchiseService = franchiseService;
// ======================================================
// Contact Page Component
// Public-facing page with contact form and feedback submission
// Includes location map, contact info, and feedback form
// ======================================================

const ContactPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [franchises, setFranchises] = useState([]);
  const [loadingFranchises, setLoadingFranchises] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const selectedFranchise = watch('franchiseId');

  // Fetch franchises on component mount
  React.useEffect(() => {
    fetchFranchises();
  }, []);

      React.useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  const fetchFranchises = async () => {
    setLoadingFranchises(true);
    try {
      const response = await franchiseService.getAllFranchises(0, 100, 'city', 'ASC');
      
      // FIX: The API is returning an array directly, not response.content
      if (Array.isArray(response)) {
        setFranchises(response);
        console.log('✅ Franchises loaded:', response.length);
      } else if (response && response.content && Array.isArray(response.content)) {
        setFranchises(response.content);
        console.log('✅ Franchises loaded:', response.content.length);
      } else {
        console.log('⚠️ Unexpected response format:', response);
        setFranchises([]);
      }
    } catch (err) {
      console.error('Error fetching franchises:', err);
      setError('Failed to load franchises');
    } finally {
      setLoadingFranchises(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);

    try {
      const feedbackData = {
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        billNumber: data.billNumber,
        rating: data.rating,
        comments: data.message,
        wouldRecommend: data.wouldRecommend === 'true',
        serviceRating: parseInt(data.serviceRating),
        foodRating: parseInt(data.foodRating),
        cleanlinessRating: parseInt(data.cleanlinessRating),
        valueRating: parseInt(data.valueRating),
        franchiseId: parseInt(data.franchiseId)
      };

      await feedbackService.submitFeedback(feedbackData);
      setSubmitSuccess(true);
      reset();
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: '📍',
      title: 'Head Office',
      details: ['123 Franchise Avenue', 'Mumbai, Maharashtra 400001', 'India']
    },
    {
      icon: '📞',
      title: 'Phone',
      details: ['+91 8421709067', '(24/7 Support)']
    },
    {
      icon: '✉️',
      title: 'Email',
      details: ['sumitrajsadafule@gmail.com']
    },
    {
      icon: '🕒',
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 8:00 PM', 'Saturday: 10:00 AM - 6:00 PM', 'Sunday: Closed']
    }
  ];

  const faqs = [
    {
      question: 'How can I provide feedback about my experience?',
      answer: 'You can use the feedback form on this page or speak directly to the manager at any MAC\'s location.'
    },
    {
      question: 'How do I apply for a franchise?',
      answer: 'Visit our "Own a Franchise" page and fill out the application form. Our team will contact you within 3-5 business days.'
    },
    {
      question: 'How can I report an issue with an order?',
      answer: 'Please contact the specific franchise location directly or use our feedback form with your bill number.'
    },
    {
      question: 'Do you accept franchise inquiries via email?',
      answer: 'Yes, you can email us at franchise@macs.com for any franchise-related queries.'
    }
  ];

  if (submitSuccess) {
    return (
      <div className="contact-page">
        <div className="contact-page__success">
          <div className="contact-page__success-content">
            <span className="contact-page__success-icon">✨</span>
            <h1 className="contact-page__success-title">Thank You for Your Feedback!</h1>
            <p className="contact-page__success-message">
              We appreciate you taking the time to share your experience with us. 
              Your feedback helps us serve you better.
            </p>
            <div className="contact-page__success-actions">
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="contact-page__success-button contact-page__success-button--primary"
              >
                Submit Another Feedback
              </button>
              <a 
                href="/" 
                className="contact-page__success-button contact-page__success-button--secondary"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-page__hero">
        <div className="contact-page__hero-content container">
          <h1 className="contact-page__hero-title animate-fade-in-down">
            Get in <span className="contact-page__hero-highlight">Touch</span>
          </h1>
          <p className="contact-page__hero-subtitle animate-fade-in-up">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      <div className="contact-page__container container">
        {/* Contact Info Grid */}
        <div className="contact-page__info-grid">
          {contactInfo.map((info, index) => (
            <div 
              key={index} 
              className="contact-page__info-card animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="contact-page__info-icon">{info.icon}</span>
              <h3 className="contact-page__info-title">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="contact-page__info-detail">{detail}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="contact-page__grid">
          {/* Feedback Form */}
          <div className="contact-page__form-container">
            <h2 className="contact-page__form-title">Send Us a Message</h2>
            <p className="contact-page__form-subtitle">
              Have questions or feedback? Fill out the form below.
            </p>

            {error && (
              <div className="contact-page__form-error">
                <span className="contact-page__form-error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="contact-page__form">
              {/* Personal Information */}
              <div className="contact-page__form-row">
                <div className="contact-page__form-group">
                  <label className="contact-page__form-label">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    className={`contact-page__form-input ${errors.name ? 'contact-page__form-input--error' : ''}`}
                    placeholder="Enter your full name"
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 3,
                        message: 'Name must be at least 3 characters'
                      }
                    })}
                  />
                  {errors.name && (
                    <span className="contact-page__form-error-message">{errors.name.message}</span>
                  )}
                </div>

                <div className="contact-page__form-group">
                  <label className="contact-page__form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className={`contact-page__form-input ${errors.email ? 'contact-page__form-input--error' : ''}`}
                    placeholder="your@email.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <span className="contact-page__form-error-message">{errors.email.message}</span>
                  )}
                </div>
              </div>

              <div className="contact-page__form-row">
                <div className="contact-page__form-group">
                  <label className="contact-page__form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className={`contact-page__form-input ${errors.phone ? 'contact-page__form-input--error' : ''}`}
                    placeholder="10-digit mobile number"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Enter a valid 10-digit mobile number'
                      }
                    })}
                  />
                  {errors.phone && (
                    <span className="contact-page__form-error-message">{errors.phone.message}</span>
                  )}
                </div>

                <div className="contact-page__form-group">
                  <label className="contact-page__form-label">
                    Bill Number (Optional)
                  </label>
                  <input
                    type="text"
                    className="contact-page__form-input"
                    placeholder="e.g., B12345"
                    {...register('billNumber')}
                  />
                </div>
              </div>

              {/* Franchise Selection */}
              <div className="contact-page__form-group">
                <label className="contact-page__form-label">
                  Which franchise did you visit? *
                </label>
                <select
                  className={`contact-page__form-select ${errors.franchiseId ? 'contact-page__form-input--error' : ''}`}
                  {...register('franchiseId', { 
                    required: 'Please select a franchise'
                  })}
                  disabled={loadingFranchises}
                >
                  <option value="">Select a franchise</option>
                  {franchises.map(franchise => (
                    <option key={franchise.id} value={franchise.id}>
                      {franchise.franchiseName} - {franchise.city}
                    </option>
                  ))}
                </select>
                {errors.franchiseId && (
                  <span className="contact-page__form-error-message">{errors.franchiseId.message}</span>
                )}
              </div>

              {/* Ratings */}
              {selectedFranchise && (
                <>
                  <div className="contact-page__form-section">
                    <h3 className="contact-page__form-section-title">Rate Your Experience</h3>
                    
                    <div className="contact-page__rating-grid">
                      <div className="contact-page__rating-group">
                        <label className="contact-page__rating-label">
                          Service (1-5) *
                        </label>
                        <select
                          className={`contact-page__rating-select ${errors.serviceRating ? 'contact-page__form-input--error' : ''}`}
                          {...register('serviceRating', { 
                            required: 'Please rate service',
                            min: 1,
                            max: 5
                          })}
                        >
                          <option value="">Select</option>
                          {[1,2,3,4,5].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? '⭐' : '⭐'.repeat(num)}</option>
                          ))}
                        </select>
                      </div>

                      <div className="contact-page__rating-group">
                        <label className="contact-page__rating-label">
                          Food Quality (1-5) *
                        </label>
                        <select
                          className={`contact-page__rating-select ${errors.foodRating ? 'contact-page__form-input--error' : ''}`}
                          {...register('foodRating', { 
                            required: 'Please rate food quality',
                            min: 1,
                            max: 5
                          })}
                        >
                          <option value="">Select</option>
                          {[1,2,3,4,5].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? '⭐' : '⭐'.repeat(num)}</option>
                          ))}
                        </select>
                      </div>

                      <div className="contact-page__rating-group">
                        <label className="contact-page__rating-label">
                          Cleanliness (1-5) *
                        </label>
                        <select
                          className={`contact-page__rating-select ${errors.cleanlinessRating ? 'contact-page__form-input--error' : ''}`}
                          {...register('cleanlinessRating', { 
                            required: 'Please rate cleanliness',
                            min: 1,
                            max: 5
                          })}
                        >
                          <option value="">Select</option>
                          {[1,2,3,4,5].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? '⭐' : '⭐'.repeat(num)}</option>
                          ))}
                        </select>
                      </div>

                      <div className="contact-page__rating-group">
                        <label className="contact-page__rating-label">
                          Value for Money (1-5) *
                        </label>
                        <select
                          className={`contact-page__rating-select ${errors.valueRating ? 'contact-page__form-input--error' : ''}`}
                          {...register('valueRating', { 
                            required: 'Please rate value for money',
                            min: 1,
                            max: 5
                          })}
                        >
                          <option value="">Select</option>
                          {[1,2,3,4,5].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? '⭐' : '⭐'.repeat(num)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="contact-page__form-group">
                    <label className="contact-page__form-label">
                      Overall Rating *
                    </label>
                    <select
                      className={`contact-page__form-select ${errors.rating ? 'contact-page__form-input--error' : ''}`}
                      {...register('rating', { 
                        required: 'Please select a rating'
                      })}
                    >
                      <option value="">Select rating</option>
                      <option value="ONE_STAR">⭐ Poor</option>
                      <option value="TWO_STARS">⭐⭐ Fair</option>
                      <option value="THREE_STARS">⭐⭐⭐ Good</option>
                      <option value="FOUR_STARS">⭐⭐⭐⭐ Very Good</option>
                      <option value="FIVE_STARS">⭐⭐⭐⭐⭐ Excellent</option>
                    </select>
                    {errors.rating && (
                      <span className="contact-page__form-error-message">{errors.rating.message}</span>
                    )}
                  </div>

                  <div className="contact-page__form-group">
                    <label className="contact-page__form-label">
                      Would you recommend us? *
                    </label>
                    <div className="contact-page__radio-group">
                      <label className="contact-page__radio-label">
                        <input
                          type="radio"
                          value="true"
                          {...register('wouldRecommend', { 
                            required: 'Please select an option'
                          })}
                        />
                        Yes
                      </label>
                      <label className="contact-page__radio-label">
                        <input
                          type="radio"
                          value="false"
                          {...register('wouldRecommend', { 
                            required: 'Please select an option'
                          })}
                        />
                        No
                      </label>
                    </div>
                    {errors.wouldRecommend && (
                      <span className="contact-page__form-error-message">{errors.wouldRecommend.message}</span>
                    )}
                  </div>
                </>
              )}

              {/* Message */}
              <div className="contact-page__form-group">
                <label className="contact-page__form-label">
                  Your Message *
                </label>
                <textarea
                  rows="5"
                  className={`contact-page__form-textarea ${errors.message ? 'contact-page__form-input--error' : ''}`}
                  placeholder="Tell us about your experience or ask us anything..."
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    }
                  })}
                ></textarea>
                {errors.message && (
                  <span className="contact-page__form-error-message">{errors.message.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="contact-page__submit-button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="contact-page__submit-spinner"></span>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="contact-page__faq">
            <h2 className="contact-page__faq-title">Frequently Asked Questions</h2>
            <div className="contact-page__faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="contact-page__faq-item">
                  <h3 className="contact-page__faq-question">{faq.question}</h3>
                  <p className="contact-page__faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="contact-page__social">
              <h3 className="contact-page__social-title">Connect With Us</h3>
              <div className="contact-page__social-links">
                <a href="#" className="contact-page__social-link" aria-label="Facebook">
                  📘
                </a>
                <a href="#" className="contact-page__social-link" aria-label="Instagram">
                  📷
                </a>
                <a href="#" className="contact-page__social-link" aria-label="Twitter">
                  🐦
                </a>
                <a href="#" className="contact-page__social-link" aria-label="LinkedIn">
                  💼
                </a>
                <a href="#" className="contact-page__social-link" aria-label="YouTube">
                  📺
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
               
        <section className="contact-page__map">
          <h2 className="contact-page__map-title">Our Franchise Locations</h2>
          <div className="contact-page__map-container">
            {loadingFranchises ? (
              <div style={{ 
                width: '100%', 
                height: '450px', 
                borderRadius: '12px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Loading map...
              </div>
            ) : franchises.length > 0 ? (
              <MapView 
                locations={franchises}
                zoom={5}
              />
            ) : (
              <div style={{ 
                width: '100%', 
                height: '450px', 
                borderRadius: '12px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</span>
                <p style={{ color: '#666' }}>No franchise locations available</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;