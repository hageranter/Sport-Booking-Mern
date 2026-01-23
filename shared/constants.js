// Sport Types
const SPORT_TYPES = {
  FOOTBALL: 'Football',
  TENNIS: 'Tennis',
  BASKETBALL: 'Basketball',
  PADDLE: 'Paddle'
};

// User Roles
const USER_ROLES = {
  USER: 'User',
  COURT_OWNER: 'CourtOwner',
  ADMIN: 'Admin'
};

// Booking Status
const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
};

// Match Status
const MATCH_STATUS = {
  OPEN: 'Open',
  FULL: 'Full',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

// Match Type
const MATCH_TYPE = {
  PUBLIC: 'Public',
  PRIVATE: 'Private'
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  REFUNDED: 'Refunded'
};

// Payment Methods
const PAYMENT_METHODS = {
  STRIPE: 'Stripe',
  PAYPAL: 'PayPal',
  APPLE_PAY: 'ApplePay',
  GOOGLE_PAY: 'GooglePay'
};

// Notification Types
const NOTIFICATION_TYPES = {
  EMAIL: 'Email',
  SMS: 'SMS',
  PUSH: 'Push',
  IN_APP: 'InApp'
};

// Languages
const LANGUAGES = {
  ARABIC: 'ar',
  ENGLISH: 'en'
};

// Currency
const CURRENCIES = {
  EGP: 'EGP',
  USD: 'USD',
  EUR: 'EUR'
};

module.exports = {
  SPORT_TYPES,
  USER_ROLES,
  BOOKING_STATUS,
  MATCH_STATUS,
  MATCH_TYPE,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  NOTIFICATION_TYPES,
  LANGUAGES,
  CURRENCIES
};
