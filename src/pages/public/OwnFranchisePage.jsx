import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import applicationService from '../../services/applicationService';
import './OwnFranchisePage.css';

// ======================================================
// Own Franchise Page Component
// Public-facing page with franchise information and application form
// Includes benefits, requirements, and detailed application form
// ======================================================

const OwnFranchisePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

    React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const benefits = [
    {
      icon: '💰',
      title: 'High ROI Potential',
      description: 'Join India\'s fastest-growing food chain with proven business model'
    },
    {
      icon: '🤝',
      title: 'Complete Support',
      description: 'From site selection to staff training - we guide you every step'
    },
    {
      icon: '🏆',
      title: 'Brand Recognition',
      description: 'Leverage our 50+ years of brand equity and customer trust'
    },
    {
      icon: '📈',
      title: 'Marketing Support',
      description: 'National and local marketing campaigns to drive traffic'
    },
    {
      icon: '🍔',
      title: 'Proven Menu',
      description: 'Access to our complete menu with regular innovations'
    },
    {
      icon: '🎓',
      title: 'Training Programs',
      description: 'Comprehensive training for you and your staff'
    }
  ];

  const requirements = [
    {
      title: 'Net Worth',
      value: '₹50 Lakhs+',
      icon: '💰'
    },
    {
      title: 'Liquid Capital',
      value: '₹20 Lakhs+',
      icon: '💵'
    },
    {
      title: 'Experience',
      value: 'Preferred but not mandatory',
      icon: '📚'
    },
    {
      title: 'Location',
      value: 'High-footfall areas',
      icon: '📍'
    },
    {
      title: 'Commitment',
      value: 'Full-time involvement',
      icon: '🤝'
    },
    {
      title: 'Space Required',
      value: '800-1200 sq. ft.',
      icon: '🏢'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Submit Application',
      description: 'Fill out the detailed application form with your details'
    },
    {
      number: '02',
      title: 'Initial Review',
      description: 'Our team reviews your application and financials'
    },
    {
      number: '03',
      title: 'Interview',
      description: 'Discussion with our franchise team'
    },
    {
      number: '04',
      title: 'Site Selection',
      description: 'We help you find the perfect location'
    },
    {
      number: '05',
      title: 'Training',
      description: 'Comprehensive training program'
    },
    {
      number: '06',
      title: 'Grand Opening',
      description: 'Launch your MAC\'s franchise with our support'
    }
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
    'Pune', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow',
    'Chandigarh', 'Bhopal', 'Indore', 'Nagpur', 'Patna'
  ];

  const qualifications = [
    '10th Pass',
    '12th Pass',
    'Diploma',
    'Graduate',
    'Post Graduate'
  ];

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError(null);

    try {
      const applicationData = {
        ...data,
        age: parseInt(data.age),
        netWorth: parseFloat(data.netWorth) * 100000, // Convert lakhs to rupees
        liquidCapital: parseFloat(data.liquidCapital) * 100000,
        graduationYear: parseInt(data.graduationYear),
        previousOwnership: data.previousOwnership === 'true',
        willingToTrain: data.willingToTrain === 'true'
      };

      await applicationService.submitApplication(applicationData);
      setSubmitSuccess(true);
      reset();
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to submit application. Please try again.');
      console.error('Error submitting application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="own-franchise-page">
        <div className="own-franchise-page__success">
          <div className="own-franchise-page__success-content">
            <span className="own-franchise-page__success-icon">🎉</span>
            <h1 className="own-franchise-page__success-title">Application Submitted Successfully!</h1>
            <p className="own-franchise-page__success-message">
              Thank you for your interest in owning a MAC's franchise. Our team will review your application 
              and contact you within 3-5 business days to discuss the next steps.
            </p>
            <div className="own-franchise-page__success-actions">
              <Link to="/" className="own-franchise-page__success-button own-franchise-page__success-button--primary">
                Go to Home
              </Link>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="own-franchise-page__success-button own-franchise-page__success-button--secondary"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="own-franchise-page">
      {/* Hero Section */}
      <section className="own-franchise-page__hero">
        <div className="own-franchise-page__hero-content container">
          <h1 className="own-franchise-page__hero-title animate-fade-in-down">
            Own a <span className="own-franchise-page__hero-highlight">MAC's</span> Franchise
          </h1>
          <p className="own-franchise-page__hero-subtitle animate-fade-in-up">
            Join India's most loved food chain. Be your own boss with our proven business model.
          </p>
          <Link 
  to="/franchise-application"
  className="own-franchise-page__hero-button animate-fade-in-up delay-200"
>
  Apply Now
</Link>
        </div>
      </section>

      <div className="own-franchise-page__container container">
        {/* Benefits Section */}
        <section className="own-franchise-page__benefits">
          <h2 className="own-franchise-page__section-title">Why Own a MAC's Franchise?</h2>
          <div className="own-franchise-page__benefits-grid">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="own-franchise-page__benefit-card animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="own-franchise-page__benefit-icon">{benefit.icon}</span>
                <h3 className="own-franchise-page__benefit-title">{benefit.title}</h3>
                <p className="own-franchise-page__benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements Section */}
        <section className="own-franchise-page__requirements">
          <h2 className="own-franchise-page__section-title">Minimum Requirements</h2>
          <div className="own-franchise-page__requirements-grid">
            {requirements.map((req, index) => (
              <div 
                key={index} 
                className="own-franchise-page__requirement-card animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="own-franchise-page__requirement-icon">{req.icon}</span>
                <div className="own-franchise-page__requirement-content">
                  <h3 className="own-franchise-page__requirement-title">{req.title}</h3>
                  <p className="own-franchise-page__requirement-value">{req.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="own-franchise-page__process">
          <h2 className="own-franchise-page__section-title">How It Works</h2>
          <div className="own-franchise-page__process-grid">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="own-franchise-page__process-card animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="own-franchise-page__process-number">{step.number}</span>
                <h3 className="own-franchise-page__process-title">{step.title}</h3>
                <p className="own-franchise-page__process-description">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Application Form */}
       

        {/* CTA Section (if form not shown) */}
        {!showForm && (
          <section className="own-franchise-page__cta">
            <h2 className="own-franchise-page__cta-title">Ready to Get Started?</h2>
            <p className="own-franchise-page__cta-subtitle">
              Take the first step towards owning your MAC's franchise today.
            </p>
            <Link 
  to="/franchise-application"
  className="own-franchise-page__cta-button"
>
  Apply Now
</Link>
          </section>
        )}
      </div>
    </div>
  );
};

export default OwnFranchisePage;