import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'Student',
  city: '',
  institution: '',
  interests: '',
  skills: '',
};

const Register = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        interests: formData.role === 'Student' ? formData.interests.split(',').map(s => s.trim()) : [],
        skills: formData.role === 'Alumni' ? formData.skills.split(',').map(s => s.trim()) : []
      };
      const { data } = await axios.post('/api/auth/register', payload);
      console.log('✅ Registration Success:', data);
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ── Success Screen ─────────────────────────────────── */
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="success-state">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">Account Created!</h2>
            <p className="success-text">
              Welcome to Bharat-Setu, <strong>{formData.name}</strong>!
              Your account is ready — go ahead and sign in.
            </p>
            <Link to="/login" id="go-to-login" className="btn-primary btn-block">
              Go to Login →
            </Link>
          </div>
          <p className="auth-switch">
            <Link to="/register" className="auth-link" onClick={() => { setSuccess(false); setFormData(INITIAL_FORM); }}>
              Register another account
            </Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── Registration Form ──────────────────────────────── */
  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <span className="brand-flag">🇮🇳</span>
          <h1 className="brand-name">Bharat-Setu</h1>
        </div>
        <p className="auth-subtitle">Create your account to get started</p>

        <form id="register-form" onSubmit={handleSubmit} className="auth-form">

          {/* Row 1: Name + Role */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Arjun Sharma"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-role">Role</label>
              <select
                id="reg-role"
                className="form-input form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Student">🎓 Student</option>
                <option value="Alumni">👔 Alumni</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="arjun@example.com"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              minLength={8}
              required
            />
          </div>

          {/* Row 2: City + Institution */}
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="reg-city">City</label>
              <input
                id="reg-city"
                className="form-input"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Mumbai"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-institution">Institution</label>
              <input
                id="reg-institution"
                className="form-input"
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="IIT Bombay"
                required
              />
            </div>
          </div>
          
          {/* Row 3: Interests / Skills */}
          <div className="form-group">
            <label className="form-label" htmlFor="reg-tags">
              {formData.role === 'Student' ? 'Area of Interests (comma separated)' : 'Professional Skills (comma separated)'}
            </label>
            <textarea
              id="reg-tags"
              className="form-input"
              name={formData.role === 'Student' ? 'interests' : 'skills'}
              value={formData.role === 'Student' ? formData.interests : formData.skills}
              onChange={handleChange}
              placeholder={formData.role === 'Student' ? 'Python, Web Dev, AI' : 'Node.js, MongoDB, React'}
              rows="2"
              required
            ></textarea>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Submit */}
          <button
            id="reg-submit"
            type="submit"
            className="btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? <span className="btn-loading"><span className="spinner" /> Creating Account…</span>
              : 'Create Account 🚀'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;