import React, { useState, useEffect } from 'react';
import cityService from '../../services/cityService';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import applicationService from '../../services/applicationService';
import './FranchiseApplicationPage.css';

// ======================================================
// Franchise Application Page Component
// Separate page for franchise application form
// ======================================================

const FranchiseApplicationPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [states, setStates] = useState([]);
const [selectedState, setSelectedState] = useState('');
const [stateCities, setStateCities] = useState([]);
const [loadingCities, setLoadingCities] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
  fetchStates();
}, []);

const fetchStates = async () => {
  try {
    const statesData = await cityService.getStatesByCountry('IN');
    setStates(statesData);
  } catch (err) {
    console.error('Error fetching states:', err);
  }
};

const fetchCitiesByState = async (stateCode) => {
  setLoadingCities(true);
  try {
    const cities = await cityService.getCitiesByState(stateCode);
    setStateCities(cities.map(c => c.name).sort());
  } catch (err) {
    console.error('Error fetching cities:', err);
  } finally {
    setLoadingCities(false);
  }
};

const handleStateChange = (e) => {
  const stateCode = e.target.value;
  setSelectedState(stateCode);
  if (stateCode) {
    fetchCitiesByState(stateCode);
  } else {
    setStateCities([]);
  }
};


  const qualifications = [
    '10th Pass',
    '12th Pass',
    'Diploma',
    'Graduate',
    'Post Graduate'
  ];

  // eslint-disable-next-line no-unused-vars
  const showToastMessage = (message, isSuccess = true) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      const applicationData = {
        ...data,
        age: parseInt(data.age),
        netWorth: parseFloat(data.netWorth) * 100000,
        liquidCapital: parseFloat(data.liquidCapital) * 100000,
        graduationYear: parseInt(data.graduationYear),
        previousOwnership: data.previousOwnership === 'true',
        willingToTrain: data.willingToTrain === 'true'
      };

      await applicationService.submitApplication(applicationData);
      reset();
      showToastMessage('✅ Application submitted successfully! We will contact you within 3-5 business days.', true);
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      showToastMessage('❌ Failed to submit application. Please try again.', false);
      console.error('Error submitting application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="franchise-application-page">
      {/* Toast Notification */}
      {showToast && (
        <div className="franchise-application-page__toast">
          <span className="franchise-application-page__toast-icon">
            {toastMessage.includes('✅') ? '✅' : '❌'}
          </span>
          <span className="franchise-application-page__toast-message">
            {toastMessage.replace('✅ ', '').replace('❌ ', '')}
          </span>
        </div>
      )}

      {/* Hero Section */}
      <section className="franchise-application-page__hero">
        <div className="franchise-application-page__hero-content container">
          <Link to="/own-franchise" className="franchise-application-page__back-link">
            ← Back to Franchise Info
          </Link>
          <h1 className="franchise-application-page__hero-title animate-fade-in-down">
            Franchise <span className="franchise-application-page__hero-highlight">Application</span>
          </h1>
          <p className="franchise-application-page__hero-subtitle animate-fade-in-up">
            Fill out the form below to start your journey with MAC's
          </p>
        </div>
      </section>

      <div className="franchise-application-page__container container">
        <div className="franchise-application-page__form-container">
          <div className="franchise-application-page__form-header">
            <h2 className="franchise-application-page__form-title">Application Form</h2>
            <p className="franchise-application-page__form-subtitle">
              Please fill in all the details accurately. Fields marked with * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="franchise-application-page__form">
            {/* Personal Information */}
            <div className="franchise-application-page__form-block">
              <h3 className="franchise-application-page__form-block-title">Personal Information</h3>
              
              <div className="franchise-application-page__form-row">
                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className={`franchise-application-page__form-input ${errors.fullName ? 'franchise-application-page__form-input--error' : ''}`}
                    placeholder="Enter your full name"
                    {...register('fullName', { 
                      required: 'Full name is required',
                      minLength: {
                        value: 3,
                        message: 'Name must be at least 3 characters'
                      }
                    })}
                  />
                  {errors.fullName && (
                    <span className="franchise-application-page__form-error-message">{errors.fullName.message}</span>
                  )}
                </div>

                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    Age *
                  </label>
                  <input
                    type="number"
                    className={`franchise-application-page__form-input ${errors.age ? 'franchise-application-page__form-input--error' : ''}`}
                    placeholder="Your age"
                    {...register('age', { 
                      required: 'Age is required',
                      min: {
                        value: 21,
                        message: 'You must be at least 21 years old'
                      },
                      max: {
                        value: 65,
                        message: 'Age must be less than 65'
                      }
                    })}
                  />
                  {errors.age && (
                    <span className="franchise-application-page__form-error-message">{errors.age.message}</span>
                  )}
                </div>
              </div>

              <div className="franchise-application-page__form-row">
                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className={`franchise-application-page__form-input ${errors.email ? 'franchise-application-page__form-input--error' : ''}`}
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
                    <span className="franchise-application-page__form-error-message">{errors.email.message}</span>
                  )}
                </div>

                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className={`franchise-application-page__form-input ${errors.phone ? 'franchise-application-page__form-input--error' : ''}`}
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
                    <span className="franchise-application-page__form-error-message">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              <div className="franchise-application-page__form-group">
                <label className="franchise-application-page__form-label">
                  Current Address *
                </label>
                <textarea
                  rows="3"
                  className={`franchise-application-page__form-textarea ${errors.address ? 'franchise-application-page__form-input--error' : ''}`}
                  placeholder="Your complete address"
                  {...register('address', { 
                    required: 'Address is required'
                  })}
                ></textarea>
                {errors.address && (
                  <span className="franchise-application-page__form-error-message">{errors.address.message}</span>
                )}
              </div>
            </div>

            {/* Education Details */}
            <div className="franchise-application-page__form-block">
              <h3 className="franchise-application-page__form-block-title">Education Details</h3>
              
              <div className="franchise-application-page__form-row">
                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    Highest Qualification *
                  </label>
                  <select
                    className={`franchise-application-page__form-select ${errors.qualification ? 'franchise-application-page__form-input--error' : ''}`}
                    {...register('qualification', { 
                      required: 'Please select your qualification'
                    })}
                  >
                    <option value="">Select Qualification</option>
                    {qualifications.map(q => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <span className="franchise-application-page__form-error-message">{errors.qualification.message}</span>
                  )}
                </div>

                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    className="franchise-application-page__form-input"
                    placeholder="Name of institution"
                    {...register('institution')}
                  />
                </div>
              </div>

              <div className="franchise-application-page__form-group">
                <label className="franchise-application-page__form-label">
                  Year of Graduation
                </label>
                <input
                  type="number"
                  className="franchise-application-page__form-input"
                  placeholder="YYYY"
                  {...register('graduationYear', {
                    min: {
                      value: 1950,
                      message: 'Please enter a valid year'
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: 'Year cannot be in the future'
                    }
                  })}
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="franchise-application-page__form-block">
              <h3 className="franchise-application-page__form-block-title">Financial Information</h3>
              
              <div className="franchise-application-page__form-row">
                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    Net Worth (in lakhs) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`franchise-application-page__form-input ${errors.netWorth ? 'franchise-application-page__form-input--error' : ''}`}
                    placeholder="e.g., 50"
                    {...register('netWorth', { 
                      required: 'Net worth is required',
                      min: {
                        value: 50,
                        message: 'Minimum net worth required is ₹50 lakhs'
                      }
                    })}
                  />
                  {errors.netWorth && (
                    <span className="franchise-application-page__form-error-message">{errors.netWorth.message}</span>
                  )}
                </div>

                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    Liquid Capital (in lakhs) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`franchise-application-page__form-input ${errors.liquidCapital ? 'franchise-application-page__form-input--error' : ''}`}
                    placeholder="e.g., 20"
                    {...register('liquidCapital', { 
                      required: 'Liquid capital is required',
                      min: {
                        value: 20,
                        message: 'Minimum liquid capital required is ₹20 lakhs'
                      }
                    })}
                  />
                  {errors.liquidCapital && (
                    <span className="franchise-application-page__form-error-message">{errors.liquidCapital.message}</span>
                  )}
                </div>
              </div>

              <div className="franchise-application-page__form-group">
                <label className="franchise-application-page__form-label">
                  Source of Funds *
                </label>
                <input
                  type="text"
                  className={`franchise-application-page__form-input ${errors.sourceOfFunds ? 'franchise-application-page__form-input--error' : ''}`}
                  placeholder="e.g., Personal savings, Bank loan, etc."
                  {...register('sourceOfFunds', { 
                    required: 'Source of funds is required'
                  })}
                />
                {errors.sourceOfFunds && (
                  <span className="franchise-application-page__form-error-message">{errors.sourceOfFunds.message}</span>
                )}
              </div>
            </div>

            {/* Business Interest */}
<div className="franchise-application-page__form-block">
  <h3 className="franchise-application-page__form-block-title">Business Interest</h3>
  
  {/* State Selection - NEW */}
  <div className="franchise-application-page__form-group">
    <label className="franchise-application-page__form-label">
      Select State *
    </label>
    <select
      className="franchise-application-page__form-select"
      value={selectedState}
      onChange={handleStateChange}
    >
      <option value="">Select State</option>
      {states.map(state => (
        <option key={state.iso2} value={state.iso2}>
          {state.name}
        </option>
      ))}
    </select>
  </div>

  {/* City Selection - MODIFIED to use dynamic cities from API */}
  <div className="franchise-application-page__form-group">
    <label className="franchise-application-page__form-label">
      Preferred City/Location *
    </label>
    <select
      className={`franchise-application-page__form-select ${errors.preferredCity ? 'franchise-application-page__form-input--error' : ''}`}
      {...register('preferredCity', { 
        required: 'Please select a preferred city'
      })}
      disabled={!selectedState || loadingCities}
    >
      <option value="">
        {loadingCities ? 'Loading cities...' : 'Select City'}
      </option>
      {stateCities.map(city => (
        <option key={city} value={city}>{city}</option>
      ))}
    </select>
    {errors.preferredCity && (
      <span className="franchise-application-page__form-error-message">{errors.preferredCity.message}</span>
    )}
  </div>

  {/* Reason for choosing MAC's brand - KEEP THIS AS IS */}
  <div className="franchise-application-page__form-group">
    <label className="franchise-application-page__form-label">
      Reason for choosing MAC's brand *
    </label>
    <textarea
      rows="3"
      className={`franchise-application-page__form-textarea ${errors.reasonForInterest ? 'franchise-application-page__form-input--error' : ''}`}
      placeholder="Tell us why you want to own a MAC's franchise..."
      {...register('reasonForInterest', { 
        required: 'Please tell us your reason for interest',
        minLength: {
          value: 20,
          message: 'Please provide a detailed reason (at least 20 characters)'
        }
      })}
    ></textarea>
    {errors.reasonForInterest && (
      <span className="franchise-application-page__form-error-message">{errors.reasonForInterest.message}</span>
    )}
  </div>
</div>

            {/* Commitment */}
            <div className="franchise-application-page__form-block">
              <h3 className="franchise-application-page__form-block-title">Commitment</h3>
              
              <div className="franchise-application-page__form-group">
                <label className="franchise-application-page__form-label">
                  Previous Business Ownership Experience? *
                </label>
                <div className="franchise-application-page__radio-group">
                  <label className="franchise-application-page__radio-label">
                    <input
                      type="radio"
                      value="true"
                      {...register('previousOwnership', { 
                        required: 'Please select an option'
                      })}
                    />
                    Yes
                  </label>
                  <label className="franchise-application-page__radio-label">
                    <input
                      type="radio"
                      value="false"
                      {...register('previousOwnership', { 
                        required: 'Please select an option'
                      })}
                    />
                    No
                  </label>
                </div>
                {errors.previousOwnership && (
                  <span className="franchise-application-page__form-error-message">{errors.previousOwnership.message}</span>
                )}
              </div>

              <div className="franchise-application-page__form-group">
                <label className="franchise-application-page__form-label">
                  If yes, please provide details
                </label>
                <textarea
                  rows="2"
                  className="franchise-application-page__form-textarea"
                  placeholder="Brief description of your business experience"
                  {...register('ownershipDetails')}
                ></textarea>
              </div>

              <div className="franchise-application-page__form-group">
                <label className="franchise-application-page__form-label">
                  Willing to complete training program? *
                </label>
                <div className="franchise-application-page__radio-group">
                  <label className="franchise-application-page__radio-label">
                    <input
                      type="radio"
                      value="true"
                      {...register('willingToTrain', { 
                        required: 'Please select an option'
                      })}
                    />
                    Yes
                  </label>
                  <label className="franchise-application-page__radio-label">
                    <input
                      type="radio"
                      value="false"
                      {...register('willingToTrain', { 
                        required: 'Please select an option'
                      })}
                    />
                    No
                  </label>
                </div>
                {errors.willingToTrain && (
                  <span className="franchise-application-page__form-error-message">{errors.willingToTrain.message}</span>
                )}
              </div>
            </div>

            {/* Legal Documents */}
            <div className="franchise-application-page__form-block">
              <h3 className="franchise-application-page__form-block-title">Legal Documents (Numbers only)</h3>
              
              <div className="franchise-application-page__form-row">
                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    className={`franchise-application-page__form-input ${errors.panNumber ? 'franchise-application-page__form-input--error' : ''}`}
                    placeholder="ABCDE1234F"
                    {...register('panNumber', { 
                      required: 'PAN number is required',
                      pattern: {
                        value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                        message: 'Enter a valid PAN number (e.g., ABCDE1234F)'
                      }
                    })}
                  />
                  {errors.panNumber && (
                    <span className="franchise-application-page__form-error-message">{errors.panNumber.message}</span>
                  )}
                </div>

                <div className="franchise-application-page__form-group">
                  <label className="franchise-application-page__form-label">
                    Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    className={`franchise-application-page__form-input ${errors.aadhaarNumber ? 'franchise-application-page__form-input--error' : ''}`}
                    placeholder="123456789012"
                    {...register('aadhaarNumber', { 
                      required: 'Aadhaar number is required',
                      pattern: {
                        value: /^\d{12}$/,
                        message: 'Enter a valid 12-digit Aadhaar number'
                      }
                    })}
                  />
                  {errors.aadhaarNumber && (
                    <span className="franchise-application-page__form-error-message">{errors.aadhaarNumber.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="franchise-application-page__form-actions">
              <Link to="/own-franchise" className="franchise-application-page__cancel-button">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="franchise-application-page__submit-button"
              >
                {submitting ? (
                  <>
                    <span className="franchise-application-page__submit-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FranchiseApplicationPage;