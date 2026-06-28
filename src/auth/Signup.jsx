import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { signupUser } from '../api/authApi';
import { validation } from '../utils/validation';
import { alertSuccess, alertApiError } from '../utils/alerts';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validate individual fields
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    
    if (fieldName === 'name') {
      if (!validation.isRequired(value)) {
        newErrors.name = 'Name is required';
      } else if (!validation.minLength(value, 2)) {
        newErrors.name = 'Name must be at least 2 characters';
      } else if (!validation.maxLength(value, 50)) {
        newErrors.name = 'Name must not exceed 50 characters';
      } else {
        delete newErrors.name;
      }
    } else if (fieldName === 'email') {
      if (!validation.isRequired(value)) {
        newErrors.email = 'Email is required';
      } else if (!validation.isValidEmail(value)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    } else if (fieldName === 'password') {
      const strength = validation.getPasswordStrength(value);
      if (strength.score < 3) {
        newErrors.password = strength.message;
      } else {
        delete newErrors.password;
      }
    }
    
    return newErrors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors(validateField(name, value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, password: true });
    
    // Validate all fields
    const newErrors = {
      ...validateField('name', name),
      ...validateField('email', email),
      ...validateField('password', password),
    };
    
    setErrors(newErrors);
    
    // Prevent submit if there are errors
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await signupUser({ name: name.trim(), email: email.trim(), password });
      await alertSuccess('Account created!', 'You can now log in with your credentials.');
      navigate('/login');
    } catch (error) {
      alertApiError(error, 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold mb-1 text-gray-800">Create an account</h1>
        <p className="text-sm text-gray-500 mb-6">Sign up to get started</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (touched.name) {
                  setErrors(validateField('name', e.target.value));
                }
              }}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={`w-full border rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                errors.name && touched.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && touched.name && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {errors.name}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) {
                  setErrors(validateField('email', e.target.value));
                }
              }}
              onBlur={handleBlur}
              placeholder="you@example.com"
              className={`w-full border rounded-lg px-3 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                errors.email && touched.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && touched.email && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
              <span className="text-xs font-normal text-gray-500 ml-1">
                (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    setErrors(validateField('password', e.target.value));
                  }
                }}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${
                  errors.password && touched.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && touched.password && (
              <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition shadow-sm"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;