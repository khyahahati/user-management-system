import { useEffect, useState } from 'react';
import { changePassword, updateProfile } from '../api/user.api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser, refreshUser } = useAuth();
  const [profileValues, setProfileValues] = useState({ fullName: '', email: '' });
  const [passwordValues, setPasswordValues] = useState({ currentPassword: '', newPassword: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileFeedback, setProfileFeedback] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [apiError, setApiError] = useState('');
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    setProfileValues({ fullName: user.fullName, email: user.email });
  }, [user]);

  const validateProfile = () => {
    const errors = {};
    if (!profileValues.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    }
    if (!profileValues.email.trim()) {
      errors.email = 'Email is required.';
    }
    return errors;
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordValues.currentPassword) {
      errors.currentPassword = 'Current password is required.';
    }
    if (!passwordValues.newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (passwordValues.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters.';
    }
    if (
      passwordValues.currentPassword &&
      passwordValues.newPassword &&
      passwordValues.currentPassword === passwordValues.newPassword
    ) {
      errors.newPassword = 'New password must be different from the current password.';
    }
    return errors;
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    setProfileFeedback('');
    const errors = validateProfile();
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsProfileSubmitting(true);
    try {
      const response = await updateProfile({
        fullName: profileValues.fullName.trim(),
        email: profileValues.email.trim(),
      });
      const updatedUser = response?.data?.data;
      if (updatedUser) {
        setUser(updatedUser);
      } else {
        await refreshUser();
      }
      setProfileFeedback('Profile updated successfully.');
    } catch (error) {
      const responseMessage = error?.response?.data?.message;
      setApiError(responseMessage || 'Unable to update profile.');
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    setPasswordFeedback('');
    const errors = validatePassword();
    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsPasswordSubmitting(true);
    try {
      await changePassword({
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
      });
      setPasswordFeedback('Password updated successfully.');
      setPasswordValues({ currentPassword: '', newPassword: '' });
    } catch (error) {
      const responseMessage = error?.response?.data?.message;
      setApiError(responseMessage || 'Unable to change password.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <section className="page">
      <h1 className="page__title">Profile</h1>
      <div className="page__grid">
        <div className="card">
          <h2 className="card__title">Account Details</h2>
          <form className="form" onSubmit={handleProfileSubmit} noValidate>
            <label className="form__field">
              <span>Full Name</span>
              <input
                type="text"
                name="fullName"
                value={profileValues.fullName}
                onChange={handleProfileChange}
                required
              />
              {profileErrors.fullName && <small className="form__error">{profileErrors.fullName}</small>}
            </label>
            <label className="form__field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={profileValues.email}
                onChange={handleProfileChange}
                required
              />
              {profileErrors.email && <small className="form__error">{profileErrors.email}</small>}
            </label>
            {profileFeedback && <div className="form__success">{profileFeedback}</div>}
            <button type="submit" className="button button--primary" disabled={isProfileSubmitting}>
              {isProfileSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
        <div className="card">
          <h2 className="card__title">Change Password</h2>
          <form className="form" onSubmit={handlePasswordSubmit} noValidate>
            <label className="form__field">
              <span>Current Password</span>
              <input
                type="password"
                name="currentPassword"
                value={passwordValues.currentPassword}
                onChange={handlePasswordChange}
                autoComplete="current-password"
                required
              />
              {passwordErrors.currentPassword && (
                <small className="form__error">{passwordErrors.currentPassword}</small>
              )}
            </label>
            <label className="form__field">
              <span>New Password</span>
              <input
                type="password"
                name="newPassword"
                value={passwordValues.newPassword}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                required
              />
              {passwordErrors.newPassword && (
                <small className="form__error">{passwordErrors.newPassword}</small>
              )}
            </label>
            {passwordFeedback && <div className="form__success">{passwordFeedback}</div>}
            <button type="submit" className="button button--primary" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
      {apiError && <div className="alert alert--error">{apiError}</div>}
    </section>
  );
};

export default Profile;
