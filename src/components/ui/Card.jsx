import React from 'react';
import './Card.css';

// ======================================================
// Reusable Card Component
// Supports multiple variants, padding options, and hover effects
// Used throughout the application for consistent card layouts
// ======================================================

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  clickable = false,
  bordered = true,
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--padding-${padding}`,
    bordered ? 'card--bordered' : '',
    hoverable ? 'card--hoverable' : '',
    clickable ? 'card--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses} 
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header Component
const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`card__header ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Body Component
const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`card__body ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`card__footer ${className}`} {...props}>
      {children}
    </div>
  );
};

// Card Title Component
const CardTitle = ({ children, as = 'h3', className = '', ...props }) => {
  const Component = as;
  return (
    <Component className={`card__title ${className}`} {...props}>
      {children}
    </Component>
  );
};

// Card Subtitle Component
const CardSubtitle = ({ children, className = '', ...props }) => {
  return (
    <p className={`card__subtitle ${className}`} {...props}>
      {children}
    </p>
  );
};

// Card Image Component
const CardImage = ({ src, alt, position = 'top', className = '', ...props }) => {
  return (
    <div className={`card__image card__image--${position} ${className}`}>
      <img src={src} alt={alt} {...props} />
    </div>
  );
};

// Attach sub-components to Card for easier imports
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Image = CardImage;

// Usage examples:
// <Card variant="elevated" hoverable>
//   <Card.Image src="/image.jpg" alt="Description" />
//   <Card.Header>
//     <Card.Title>Card Title</Card.Title>
//     <Card.Subtitle>Card Subtitle</Card.Subtitle>
//   </Card.Header>
//   <Card.Body>
//     <p>Card content goes here</p>
//   </Card.Body>
//   <Card.Footer>
//     <Button>Action</Button>
//   </Card.Footer>
// </Card>

// Variants: default, elevated, outlined, flat
// Padding: none, sm, md, lg
// Features: hoverable, clickable, bordered

export default Card;