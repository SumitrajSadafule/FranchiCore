import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './AdminSettings.css';

// ======================================================
// Admin Settings Page Component
// Super admin interface for system configuration
// Manages settings, preferences, and system options
// ======================================================

const AdminSettings = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Settings state
  const [settings, setSettings] = useState({
    general: {
      siteName: 'MAC\'s Franchise Portal',
      siteUrl: 'https://macs.com',
      adminEmail: 'admin@macs.com',
      supportEmail: 'support@macs.com',
      timezone: 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      language: 'en'
    },
    franchise: {
      minNetWorth: 5000000,
      minLiquidCapital: 2000000,
      minAge: 21,
      maxAge: 65,
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Bank Statement'],
      trainingDuration: '4 weeks',
      franchiseFee: 1000000,
      royaltyFee: 8
    },
    jobs: {
      maxOpenJobs: 10,
      applicationDeadline: 30,
      autoCloseAfterDays: 45,
      requireResume: false,
      allowMultipleApplications: true,
      notifyOnApplication: true
    },
    feedback: {
      requireBillNumber: true,
      allowAnonymous: false,
      moderateFeedback: true,
      autoReplyEnabled: false,
      ratingScale: 5
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      newApplicationAlert: true,
      newFeedbackAlert: true,
      newJobApplicationAlert: true,
      dailyDigest: true,
      weeklyReport: true
    },
    security: {
      passwordMinLength: 8,
      passwordRequireUppercase: true,
      passwordRequireLowercase: true,
      passwordRequireNumbers: true,
      passwordRequireSpecial: true,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      twoFactorAuth: false
    }
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCheckboxChange = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default settings logic
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'franchise', label: 'Franchise', icon: '🏪' },
    { id: 'jobs', label: 'Jobs', icon: '💼' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' }
  ];

  return (
    <div className="admin-settings">
      {/* Header */}
      <div className="admin-settings__header">
        <div>
          <h1 className="admin-settings__title">System Settings</h1>
          <p className="admin-settings__subtitle">
            Configure system preferences and options
          </p>
        </div>
        <div className="admin-settings__header-actions">
          <button
            onClick={handleReset}
            className="admin-settings__reset-button"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="admin-settings__save-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="admin-settings__spinner-small"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="admin-settings__success">
          <span>✅</span>
          <p>{successMessage}</p>
        </div>
      )}
      
      {errorMessage && (
        <div className="admin-settings__error">
          <span>❌</span>
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-settings__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`admin-settings__tab ${activeTab === tab.id ? 'admin-settings__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="admin-settings__tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="admin-settings__content">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="admin-settings__section">
            <h2 className="admin-settings__section-title">General Settings</h2>
            
            <div className="admin-settings__form">
              <div className="admin-settings__form-row">
                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Site Name</label>
                  <input
                    type="text"
                    value={settings.general.siteName}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                    className="admin-settings__form-input"
                  />
                </div>

                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Site URL</label>
                  <input
                    type="url"
                    value={settings.general.siteUrl}
                    onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
                    className="admin-settings__form-input"
                  />
                </div>
              </div>

              <div className="admin-settings__form-row">
                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Admin Email</label>
                  <input
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
                    className="admin-settings__form-input"
                  />
                </div>

                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Support Email</label>
                  <input
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => handleInputChange('general', 'supportEmail', e.target.value)}
                    className="admin-settings__form-input"
                  />
                </div>
              </div>

              <div className="admin-settings__form-row">
                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Timezone</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                    className="admin-settings__form-select"
                  >
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="Asia/Dubai">Dubai (GST)</option>
                    <option value="Asia/Singapore">Singapore (SGT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Language</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                    className="admin-settings__form-select"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                    <option value="bn">Bengali</option>
                  </select>
                </div>
              </div>

              <div className="admin-settings__form-row">
                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Date Format</label>
                  <select
                    value={settings.general.dateFormat}
                    onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                    className="admin-settings__form-select"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Time Format</label>
                  <select
                    value={settings.general.timeFormat}
                    onChange={(e) => handleInputChange('general', 'timeFormat', e.target.value)}
                    className="admin-settings__form-select"
                  >
                    <option value="24h">24 Hour</option>
                    <option value="12h">12 Hour</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Franchise Settings */}
        {activeTab === 'franchise' && (
          <div className="admin-settings__section">
            <h2 className="admin-settings__section-title">Franchise Requirements</h2>
            
            <div className="admin-settings__form">
              <div className="admin-settings__form-row">
                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Minimum Net Worth (₹)</label>
                  <input
                    type="number"
                    value={settings.franchise.minNetWorth}
                    onChange={(e) => handleInputChange('franchise', 'minNetWorth', parseInt(e.target.value))}
                    className="admin-settings__form-input"
                  />
                  <small>Current: ₹{(settings.franchise.minNetWorth / 100000).toFixed(1)} Lakhs</small>
                </div>

                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Minimum Liquid Capital (₹)</label>
                  <input
                    type="number"
                    value={settings.franchise.minLiquidCapital}
                    onChange={(e) => handleInputChange('franchise', 'minLiquidCapital', parseInt(e.target.value))}
                    className="admin-settings__form-input"
                  />
                  <small>Current: ₹{(settings.franchise.minLiquidCapital / 100000).toFixed(1)} Lakhs</small>
                </div>
              </div>

              <div className="admin-settings__form-row">
                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Minimum Age</label>
                  <input
                    type="number"
                    value={settings.franchise.minAge}
                    onChange={(e) => handleInputChange('franchise', 'minAge', parseInt(e.target.value))}
                    className="admin-settings__form-input"
                  />
                </div>

                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Maximum Age</label>
                  <input
                    type="number"
                    value={settings.franchise.maxAge}
                    onChange={(e) => handleInputChange('franchise', 'maxAge', parseInt(e.target.value))}
                    className="admin-settings__form-input"
                  />
                </div>
              </div>

              <div className="admin-settings__form-row">
                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Franchise Fee (₹)</label>
                  <input
                    type="number"
                    value={settings.franchise.franchiseFee}
                    onChange={(e) => handleInputChange('franchise', 'franchiseFee', parseInt(e.target.value))}
                    className="admin-settings__form-input"
                  />
                </div>

                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Royalty Fee (%)</label>
                  <input
                    type="number"
                    value={settings.franchise.royaltyFee}
                    onChange={(e) => handleInputChange('franchise', 'royaltyFee', parseFloat(e.target.value))}
                    className="admin-settings__form-input"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="admin-settings__form-group">
                <label className="admin-settings__form-label">Training Duration</label>
                <input
                  type="text"
                  value={settings.franchise.trainingDuration}
                  onChange={(e) => handleInputChange('franchise', 'trainingDuration', e.target.value)}
                  className="admin-settings__form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Jobs Settings */}
        {activeTab === 'jobs' && (
          <div className="admin-settings__section">
            <h2 className="admin-settings__section-title">Job Settings</h2>
            
            <div className="admin-settings__form">
              <div className="admin-settings__form-row">
                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Maximum Open Jobs per Franchise</label>
                  <input
                    type="number"
                    value={settings.jobs.maxOpenJobs}
                    onChange={(e) => handleInputChange('jobs', 'maxOpenJobs', parseInt(e.target.value))}
                    className="admin-settings__form-input"
                  />
                </div>

                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Application Deadline (days)</label>
                  <input
                    type="number"
                    value={settings.jobs.applicationDeadline}
                    onChange={(e) => handleInputChange('jobs', 'applicationDeadline', parseInt(e.target.value))}
                    className="admin-settings__form-input"
                  />
                </div>
              </div>

              <div className="admin-settings__form-group">
                <label className="admin-settings__form-label">Auto-close Jobs After (days)</label>
                <input
                  type="number"
                  value={settings.jobs.autoCloseAfterDays}
                  onChange={(e) => handleInputChange('jobs', 'autoCloseAfterDays', parseInt(e.target.value))}
                  className="admin-settings__form-input"
                />
              </div>

              <div className="admin-settings__checkbox-group">
                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.jobs.requireResume}
                    onChange={() => handleCheckboxChange('jobs', 'requireResume')}
                  />
                  Require Resume
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.jobs.allowMultipleApplications}
                    onChange={() => handleCheckboxChange('jobs', 'allowMultipleApplications')}
                  />
                  Allow Multiple Applications
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.jobs.notifyOnApplication}
                    onChange={() => handleCheckboxChange('jobs', 'notifyOnApplication')}
                  />
                  Notify on New Application
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Settings */}
        {activeTab === 'feedback' && (
          <div className="admin-settings__section">
            <h2 className="admin-settings__section-title">Feedback Settings</h2>
            
            <div className="admin-settings__form">
              <div className="admin-settings__form-group">
                <label className="admin-settings__form-label">Rating Scale</label>
                <select
                  value={settings.feedback.ratingScale}
                  onChange={(e) => handleInputChange('feedback', 'ratingScale', parseInt(e.target.value))}
                  className="admin-settings__form-select"
                >
                  <option value="5">5 Stars</option>
                  <option value="10">10 Points</option>
                </select>
              </div>

              <div className="admin-settings__checkbox-group">
                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.feedback.requireBillNumber}
                    onChange={() => handleCheckboxChange('feedback', 'requireBillNumber')}
                  />
                  Require Bill Number
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.feedback.allowAnonymous}
                    onChange={() => handleCheckboxChange('feedback', 'allowAnonymous')}
                  />
                  Allow Anonymous Feedback
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.feedback.moderateFeedback}
                    onChange={() => handleCheckboxChange('feedback', 'moderateFeedback')}
                  />
                  Moderate Feedback Before Publishing
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.feedback.autoReplyEnabled}
                    onChange={() => handleCheckboxChange('feedback', 'autoReplyEnabled')}
                  />
                  Enable Auto-reply
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="admin-settings__section">
            <h2 className="admin-settings__section-title">Notification Preferences</h2>
            
            <div className="admin-settings__form">
              <div className="admin-settings__checkbox-group">
                <h3 className="admin-settings__checkbox-title">Channels</h3>
                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={() => handleCheckboxChange('notifications', 'emailNotifications')}
                  />
                  Email Notifications
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsNotifications}
                    onChange={() => handleCheckboxChange('notifications', 'smsNotifications')}
                  />
                  SMS Notifications
                </label>
              </div>

              <div className="admin-settings__checkbox-group">
                <h3 className="admin-settings__checkbox-title">Alerts</h3>
                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newApplicationAlert}
                    onChange={() => handleCheckboxChange('notifications', 'newApplicationAlert')}
                  />
                  New Franchise Application
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newFeedbackAlert}
                    onChange={() => handleCheckboxChange('notifications', 'newFeedbackAlert')}
                  />
                  New Customer Feedback
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifications.newJobApplicationAlert}
                    onChange={() => handleCheckboxChange('notifications', 'newJobApplicationAlert')}
                  />
                  New Job Application
                </label>
              </div>

              <div className="admin-settings__checkbox-group">
                <h3 className="admin-settings__checkbox-title">Reports</h3>
                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifications.dailyDigest}
                    onChange={() => handleCheckboxChange('notifications', 'dailyDigest')}
                  />
                  Daily Digest
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.notifications.weeklyReport}
                    onChange={() => handleCheckboxChange('notifications', 'weeklyReport')}
                  />
                  Weekly Report
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="admin-settings__section">
            <h2 className="admin-settings__section-title">Security Settings</h2>
            
            <div className="admin-settings__form">
              <div className="admin-settings__form-group">
                <label className="admin-settings__form-label">Password Minimum Length</label>
                <input
                  type="number"
                  value={settings.security.passwordMinLength}
                  onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
                  className="admin-settings__form-input"
                  min="6"
                  max="20"
                />
              </div>

              <div className="admin-settings__checkbox-group">
                <h3 className="admin-settings__checkbox-title">Password Requirements</h3>
                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordRequireUppercase}
                    onChange={() => handleCheckboxChange('security', 'passwordRequireUppercase')}
                  />
                  Require Uppercase Letters
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordRequireLowercase}
                    onChange={() => handleCheckboxChange('security', 'passwordRequireLowercase')}
                  />
                  Require Lowercase Letters
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordRequireNumbers}
                    onChange={() => handleCheckboxChange('security', 'passwordRequireNumbers')}
                  />
                  Require Numbers
                </label>

                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.security.passwordRequireSpecial}
                    onChange={() => handleCheckboxChange('security', 'passwordRequireSpecial')}
                  />
                  Require Special Characters
                </label>
              </div>

              <div className="admin-settings__form-row">
                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="admin-settings__form-input"
                    min="5"
                    max="480"
                  />
                </div>

                <div className="admin-settings__form-group">
                  <label className="admin-settings__form-label">Max Login Attempts</label>
                  <input
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="admin-settings__form-input"
                    min="3"
                    max="10"
                  />
                </div>
              </div>

              <div className="admin-settings__checkbox-group">
                <label className="admin-settings__checkbox">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={() => handleCheckboxChange('security', 'twoFactorAuth')}
                  />
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;