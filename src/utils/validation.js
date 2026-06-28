/**
 * Comprehensive validation utilities for forms
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Common validation functions
export const validation = {
  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    if (!email || typeof email !== 'string') return false;
    return EMAIL_REGEX.test(email.trim());
  },

  /**
   * Validate password strength
   * Requirements: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
   */
  isStrongPassword: (password) => {
    if (!password || password.length < PASSWORD_MIN_LENGTH) return false;
    return PASSWORD_REGEX.test(password);
  },

  /**
   * Check if password meets minimum requirements
   */
  getPasswordStrength: (password) => {
    if (!password) return { score: 0, message: 'Password is required' };
    if (password.length < PASSWORD_MIN_LENGTH) {
      return { score: 1, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
    }
    if (!PASSWORD_REGEX.test(password)) {
      return { score: 2, message: 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)' };
    }
    return { score: 3, message: 'Password is strong' };
  },

  /**
   * Validate that two passwords match
   */
  passwordsMatch: (password, confirmPassword) => {
    return password === confirmPassword && password !== '';
  },

  /**
   * Validate required field (not empty, not whitespace-only)
   */
  isRequired: (value) => {
    return value && typeof value === 'string' && value.trim().length > 0;
  },

  /**
   * Validate minimum length
   */
  minLength: (value, min) => {
    return value && value.trim().length >= min;
  },

  /**
   * Validate maximum length
   */
  maxLength: (value, max) => {
    return !value || value.trim().length <= max;
  },

  /**
   * Validate string length range
   */
  lengthRange: (value, min, max) => {
    if (!value) return false;
    const len = value.trim().length;
    return len >= min && len <= max;
  },

  /**
   * Validate alphabetic characters only
   */
  isAlphabetic: (value) => {
    return /^[a-zA-Z\s]*$/.test(value.trim());
  },

  /**
   * Validate alphanumeric (letters, numbers, spaces)
   */
  isAlphanumeric: (value) => {
    return /^[a-zA-Z0-9\s]*$/.test(value.trim());
  },

  /**
   * Validate number
   */
  isNumber: (value) => {
    return !isNaN(value) && value !== '';
  },

  /**
   * Validate positive number
   */
  isPositiveNumber: (value) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  },

  /**
   * Validate URL
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate phone number (basic)
   */
  isValidPhone: (phone) => {
    return /^[\d\s\-+()]{10,}$/.test(phone.trim());
  },

  /**
   * Trim whitespace from value
   */
  trim: (value) => {
    return typeof value === 'string' ? value.trim() : value;
  },

  /**
   * Normalize whitespace (remove extra spaces)
   */
  normalizeWhitespace: (value) => {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : value;
  },

  /**
   * Check if value has leading/trailing whitespace
   */
  hasWhitespace: (value) => {
    return typeof value === 'string' && value !== value.trim();
  },

  /**
   * Format error message with context
   */
  formatError: (fieldName, rule, params = {}) => {
    const messages = {
      required: `${fieldName} is required`,
      email: `Please enter a valid email address`,
      password: `Password must be at least ${params.min || PASSWORD_MIN_LENGTH} characters with uppercase, lowercase, number, and special character`,
      minLength: `${fieldName} must be at least ${params.min} characters`,
      maxLength: `${fieldName} must not exceed ${params.max} characters`,
      match: `${fieldName} does not match`,
      numeric: `${fieldName} must be a number`,
      alphabetic: `${fieldName} can only contain letters and spaces`,
      alphanumeric: `${fieldName} can only contain letters, numbers, and spaces`,
      phone: `Please enter a valid phone number`,
      url: `Please enter a valid URL`,
    };
    return messages[rule] || `Invalid ${fieldName}`;
  },
};

/**
 * Validate a form object against validation rules
 * Returns object with field errors
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = data[field];
    const fieldRules = rules[field];

    for (const rule of fieldRules) {
      let isValid = false;

      if (typeof rule === 'function') {
        isValid = rule(value);
      } else if (typeof rule === 'object') {
        const { type, params } = rule;
        switch (type) {
          case 'required':
            isValid = validation.isRequired(value);
            break;
          case 'email':
            isValid = validation.isValidEmail(value);
            break;
          case 'password':
            isValid = validation.isStrongPassword(value);
            break;
          case 'minLength':
            isValid = validation.minLength(value, params.min);
            break;
          case 'maxLength':
            isValid = validation.maxLength(value, params.max);
            break;
          case 'lengthRange':
            isValid = validation.lengthRange(value, params.min, params.max);
            break;
          case 'match':
            isValid = validation.passwordsMatch(value, data[params.field]);
            break;
          case 'numeric':
            isValid = validation.isNumber(value);
            break;
          case 'positiveNumber':
            isValid = validation.isPositiveNumber(value);
            break;
          case 'alphabetic':
            isValid = validation.isAlphabetic(value);
            break;
          case 'alphanumeric':
            isValid = validation.isAlphanumeric(value);
            break;
          case 'phone':
            isValid = validation.isValidPhone(value);
            break;
          case 'url':
            isValid = validation.isValidUrl(value);
            break;
          default:
            isValid = true;
        }

        if (!isValid && !errors[field]) {
          errors[field] = validation.formatError(field, type, params);
        }
      }

      if (!isValid && !errors[field]) {
        errors[field] = `Invalid ${field}`;
      }
    }
  });

  return errors;
};

export default validation;
