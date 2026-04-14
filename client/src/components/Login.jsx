import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [authData, setAuthData] = useState(null); // { token, user }
  const [copied, setCopied]     = useState(false);

  const clearError = () => setError('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAuthData(null);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });

      // ── The money line the mission requires ──────────
      console.log('🎉 SUCCESS — JWT Token:', data.token);
      console.log('👤 User Info:', data.user);
      
      // Store in localStorage for persistence
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setAuthData(data);
      
      // Redirect to dashboard after a short delay or directly
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(authData.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  const resetForm = () => {
    setAuthData(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  /* ── Token Reveal (post-login success screen) ─────── */
  if (authData) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="brand-flag">🇮🇳</span>
            <h1 className="brand-name">Bharat-Setu</h1>
          </div>

          <div className="token-reveal">
            {/* Header */}
            <div className="token-header">
              <span className="token-badge">✅</span>
              <div>
                <h3 className="token-title">
                  Welcome back, {authData.user?.name}!
                </h3>
                <p className="token-desc">
                  Login successful. Your JWT token has been generated and
                  printed to the browser console.
                </p>
              </div>
            </div>

            {/* Token Box */}
            <div className="token-box">
              <span className="token-label">🔑 JWT Token</span>
              <code id="jwt-token-value" className="token-value">
                {authData.token}
              </code>
              <div className="token-footer">
                <span className="token-hint">Expires in 1 hour · Role: {authData.user?.role}</span>
                <button
                  id="copy-token-btn"
                  className={`token-copy-btn${copied ? ' copied' : ''}`}
                  onClick={copyToken}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>

            {/* Back */}
            <button
              id="sign-in-another-btn"
              className="btn-secondary btn-block"
              onClick={resetForm}
            >
              ← Sign in as another user
            </button>
          </div>

          <p className="auth-switch">
            New to Bharat-Setu?{' '}
            <Link to="/register" className="auth-link">Create an account</Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── Login Form ─────────────────────────────────────── */
  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <span className="brand-flag">🇮🇳</span>
          <h1 className="brand-name">Bharat-Setu</h1>
        </div>
        <p className="auth-subtitle">Sign in to your account</p>

        <form id="login-form" onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError(); }}
              placeholder="arjun@example.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError(); }}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>⚠️</span> {error}
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            className="btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? <span className="btn-loading"><span className="spinner" /> Signing in…</span>
              : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          New to Bharat-Setu?{' '}
          <Link to="/register" className="auth-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;