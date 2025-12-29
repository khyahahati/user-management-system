import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formValues.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    if (!formValues.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (!formValues.password) {
      errors.password = 'Password is required.';
    }
    if (formValues.password && formValues.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }
    if (!formValues.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = 'Passwords must match.';
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
      await signup({
        fullName: formValues.fullName.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
      });
      navigate('/login', { replace: true });
    } catch (error) {
      const responseMessage = error?.response?.data?.message;
      setApiError(responseMessage || 'Unable to register. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page">
      <div className="card form-card">
        <h1 className="page__title">Create Account</h1>
        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="form__field">
            <span>Full Name</span>
            <input
              type="text"
              name="fullName"
              value={formValues.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              required
            />
            {formErrors.fullName && <small className="form__error">{formErrors.fullName}</small>}
          </label>
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
              autoComplete="new-password"
              required
            />
            {formErrors.password && <small className="form__error">{formErrors.password}</small>}
          </label>
          <label className="form__field">
            <span>Confirm Password</span>
            <input
              type="password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              placeholder="StrongPass@123"
              autoComplete="new-password"
              required
            />
            {formErrors.confirmPassword && (
              <small className="form__error">{formErrors.confirmPassword}</small>
            )}
          </label>
          {apiError && <div className="form__error form__error--global">{apiError}</div>}
          <button type="submit" className="button button--primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="form__footer">
          Already have an account? <Link to="/login">Sign in</Link>.
        </p>
      </div>
    </section>
  );
};

export default Signup;
