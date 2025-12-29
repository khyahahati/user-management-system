import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = useMemo(() => location.state?.from?.pathname || '/dashboard', [location.state]);

  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errors = {};
    if (!formValues.email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!formValues.password) {
      errors.password = 'Password is required.';
    }
    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setApiError('');
    setIsSubmitting(true);
    try {
      await login({ email: formValues.email.trim(), password: formValues.password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const responseMessage = error?.response?.data?.message;
      setApiError(responseMessage || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page">
      <div className="card form-card">
        <h1 className="page__title">Sign In</h1>
        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="form__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="user@example.com"
              autoComplete="email"
              required
            />
            {formErrors.email && <small className="form__error">{formErrors.email}</small>}
          </label>
          <label className="form__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="StrongPass@123"
              autoComplete="current-password"
              required
            />
            {formErrors.password && <small className="form__error">{formErrors.password}</small>}
          </label>
          {apiError && <div className="form__error form__error--global">{apiError}</div>}
          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="form__footer">
          Do not have an account? <Link to="/signup">Create one</Link>.
        </p>
      </div>
    </section>
  );
};

export default Login;
