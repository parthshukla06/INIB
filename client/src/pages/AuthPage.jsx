import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { createDemoAccount, loginUser, registerUser } from '../services/taskApi';

const initialForm = {
  name: '',
  email: '',
  password: '',
};

export default function AuthPage({ mode = 'login', onAuthSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        ...(isRegister ? { name: formData.name } : {}),
        email: formData.email,
        password: formData.password,
      };

      const response = isRegister
        ? await registerUser(payload)
        : await loginUser(payload);

      onAuthSuccess(response.token, response.user);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const response = await createDemoAccount();
      onAuthSuccess(response.token, response.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create a demo account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark">IN</div>
          <div>
            <p className="brand-label">INIB</p>
            <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          </div>
        </div>

        <p className="auth-subtitle">
          {isRegister
            ? 'Set up your secure workspace to manage your tasks.'
            : 'Sign in to access your productivity dashboard.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              <span>Full name</span>
              <div className="input-with-icon">
                <UserRound size={16} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </label>
          )}

          <label>
            <span>Email</span>
            <div className="input-with-icon">
              <Mail size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="input-with-icon">
              <LockKeyhole size={16} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                minLength="6"
                required
              />
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="primary-button auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
            <ArrowRight size={16} />
          </button>

          {!isRegister && (
            <button
              type="button"
              className="secondary-button auth-submit"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
            >
              Try Demo Account
            </button>
          )}
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link to={isRegister ? '/login' : '/register'}>
            {isRegister ? 'Sign in' : 'Create one'}
          </Link>
        </p>
      </div>
    </div>
  );
}
