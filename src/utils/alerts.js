/**
 * Centralized SweetAlert2 wrapper functions for consistent UX
 */
import Swal from 'sweetalert2';

// Default config for all alerts
const defaultConfig = {
  confirmButtonColor: '#2563eb',
  cancelButtonColor: '#ef4444',
  customClass: {
    popup: 'rounded-lg',
    title: 'text-xl font-bold',
    htmlContainer: 'text-gray-700',
  },
};

/**
 * Show success alert
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {object} options - Additional SweetAlert options
 */
export const alertSuccess = (title = 'Success', message = '', options = {}) => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    timer: 1500,
    showConfirmButton: false,
    ...defaultConfig,
    ...options,
  });
};

/**
 * Show error alert
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {object} options - Additional SweetAlert options
 */
export const alertError = (title = 'Error', message = '', options = {}) => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'OK',
    ...defaultConfig,
    ...options,
  });
};

/**
 * Show info alert
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {object} options - Additional SweetAlert options
 */
export const alertInfo = (title = 'Information', message = '', options = {}) => {
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'OK',
    ...defaultConfig,
    ...options,
  });
};

/**
 * Show warning alert
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {object} options - Additional SweetAlert options
 */
export const alertWarning = (title = 'Warning', message = '', options = {}) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonText: 'OK',
    ...defaultConfig,
    ...options,
  });
};

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmText - Confirm button text
 * @param {object} options - Additional SweetAlert options
 */
export const confirmAction = (title = 'Are you sure?', message = '', confirmText = 'Confirm', options = {}) => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    ...defaultConfig,
    ...options,
  });
};

/**
 * Show delete confirmation dialog
 * @param {string} itemName - Name of item being deleted
 * @param {object} options - Additional SweetAlert options
 */
export const confirmDelete = (itemName = 'this item', options = {}) => {
  return Swal.fire({
    icon: 'warning',
    title: 'Delete ' + itemName + '?',
    text: `This action cannot be undone.`,
    showCancelButton: true,
    confirmButtonText: 'Delete',
    confirmButtonColor: '#ef4444',
    cancelButtonText: 'Cancel',
    ...defaultConfig,
    ...options,
  });
};

/**
 * Show loading alert (toast)
 * @param {string} message - Loading message
 */
export const showLoading = (message = 'Loading...') => {
  Swal.fire({
    title: message,
    html: '<div class="flex items-center justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    ...defaultConfig,
  });
};

/**
 * Close loading alert
 */
export const hideLoading = () => {
  Swal.close();
};

/**
 * Show API error with user-friendly message
 * @param {Error} error - Error object from API
 * @param {string} fallbackMessage - Fallback message if no error details
 */
export const alertApiError = (error, fallbackMessage = 'An error occurred. Please try again.') => {
  let title = 'Request Failed';
  let message = fallbackMessage;

  if (error?.response?.status === 401) {
    title = 'Session Expired';
    message = 'Your session has expired. Please log in again.';
  } else if (error?.response?.status === 403) {
    title = 'Access Denied';
    message = error?.response?.data?.message || 'You do not have permission to perform this action.';
  } else if (error?.response?.status === 404) {
    title = 'Not Found';
    message = error?.response?.data?.message || 'The requested resource was not found.';
  } else if (error?.response?.status === 409) {
    title = 'Conflict';
    message = error?.response?.data?.message || 'This action conflicts with existing data.';
  } else if (error?.response?.status === 422) {
    title = 'Validation Error';
    message = error?.response?.data?.message || 'Please check your input and try again.';
  } else if (error?.response?.status >= 500) {
    title = 'Server Error';
    message = error?.response?.data?.message || 'The server encountered an error. Please try again later.';
  } else if (error?.response?.data?.message) {
    message = error.response.data.message;
  }

  return alertError(title, message);
};

/**
 * Show toast notification (top-right, auto-close)
 * @param {string} message - Notification message
 * @param {string} type - 'success', 'error', 'info', 'warning'
 */
export const showToast = (message, type = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast rounded-lg',
    },
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  const iconMap = {
    success: 'success',
    error: 'error',
    info: 'info',
    warning: 'warning',
  };

  return Toast.fire({
    icon: iconMap[type] || 'info',
    title: message,
  });
};

/**
 * Show form validation error
 * @param {string} fieldName - Name of field with error
 * @param {string} errorMessage - Error message
 */
export const alertValidationError = (fieldName, errorMessage) => {
  return alertError('Validation Error', `${fieldName}: ${errorMessage}`);
};

const alerts = {
  alertSuccess,
  alertError,
  alertInfo,
  alertWarning,
  confirmAction,
  confirmDelete,
  showLoading,
  hideLoading,
  alertApiError,
  showToast,
  alertValidationError,
};

export default alerts;
