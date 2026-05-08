import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaFacebookSquare } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { TfiTwitter } from "react-icons/tfi";
import { TbBrandYoutube } from "react-icons/tb";
import { PiLinkedinLogoBold } from "react-icons/pi";




// ======================================================
// Footer Component
// Main footer for all pages
// Contains links, contact info, social media, and copyright
// ======================================================

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Menu', path: '/menu' },
    { name: 'Locations', path: '/locations' },
    { name: 'Careers', path: '/careers' },
    { name: 'Own a Franchise', path: '/own-franchise' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Our Story', path: '/story' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'News & Press', path: '/news' },
    { name: 'Investors', path: '/investors' }
  ];

  const supportLinks = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Accessibility', path: '/accessibility' },
    { name: 'Feedback', path: '/contact' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: <FaFacebookSquare />, url: 'https://facebook.com/macs' },
    { name: 'Instagram', icon: <IoLogoInstagram />, url: 'https://instagram.com/macs' },
    { name: 'Twitter', icon: <TfiTwitter />, url: 'https://twitter.com/macs' },
    { name: 'YouTube', icon: <TbBrandYoutube />, url: 'https://youtube.com/macs' },
    { name: 'LinkedIn', icon: <PiLinkedinLogoBold />, url: 'https://linkedin.com/company/macs' }
  ];

  const contactInfo = [
    { icon: '📍', text: 'FC-Road, Pune, India 411005' },
    { icon: '📞', text: '+91 8421709067' },
    { icon: '✉️', text: 'sumitrajsadafule@gmail.com' },
    { icon: '🕒', text: 'Mon-Sun: 10:00 AM - 11:00 PM' }
  ];

  return (
    <footer className="footer">
      <div className="footer__container container">
        {/* Main Footer Content */}
        <div className="footer__content">
          {/* Brand Section */}
          <div className="footer__section footer__section--brand">
            <Link to="/" className="footer__logo">
              <img src="src/assets/images/logo.png" alt="MAC's Franchise" className="header__logo-image" />
              <span className="footer__logo-text">MAC's</span>
            </Link>
            <p className="footer__description">
              Serving delicious food since 1955. Join our family and experience 
              the taste that brings people together.
            </p>
            
            {/* Contact Info */}
            <div className="footer__contact">
              {contactInfo.map((item, index) => (
                <div key={index} className="footer__contact-item">
                  <span className="footer__contact-icon">{item.icon}</span>
                  <span className="footer__contact-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4 className="footer__title">Quick Links</h4>
            <ul className="footer__links">
              {quickLinks.map((link, index) => (
                <li key={index} className="footer__link-item">
                  <Link to={link.path} className="footer__link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="footer__section">
            <h4 className="footer__title">Company</h4>
            <ul className="footer__links">
              {companyLinks.map((link, index) => (
                <li key={index} className="footer__link-item">
                  <Link to={link.path} className="footer__link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer__section">
            <h4 className="footer__title">Support</h4>
            <ul className="footer__links">
              {supportLinks.map((link, index) => (
                <li key={index} className="footer__link-item">
                  <Link to={link.path} className="footer__link">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & App Store */}
        <div className="footer__social">
          <div className="footer__social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label={social.name}
              >
                <span className="footer__social-icon">{social.icon}</span>
              </a>
            ))}
          </div>

          <div className="footer__apps">
            <a href="#" className="footer__app-link">
              <img src="/images/app-store.svg" alt="Download on App Store" />
            </a>
            <a href="#" className="footer__app-link">
              <img src="/images/google-play.svg" alt="Get it on Google Play" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            © {currentYear} MAC's Franchise. All rights reserved.
          </div>
          <div className="footer__bottom-links">
            <Link to="/privacy" className="footer__bottom-link">Privacy Policy</Link>
            <Link to="/terms" className="footer__bottom-link">Terms of Service</Link>
            <Link to="/sitemap" className="footer__bottom-link">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;