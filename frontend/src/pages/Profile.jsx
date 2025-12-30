import { useCallback, useEffect, useMemo, useState } from 'react';
import { changePassword, getProfile, updateProfile } from '../api/user.api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [profileValues, setProfileValues] = useState({ fullName: '', email: '' });
  const [passwordValues, setPasswordValues] = useState({ currentPassword: '', newPassword: '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileFeedback, setProfileFeedback] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [profileApiError, setProfileApiError] = useState('');
  const [profileLoadError, setProfileLoadError] = useState('');
  const [passwordApiError, setPasswordApiError] = useState('');
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const syncProfileState = useCallback(
    (profile) => {
      if (!profile) {
        return;
      }
      setProfileData(profile);
      setProfileValues({
        fullName: profile.fullName ?? '',
        email: profile.email ?? '',
      });
      setUser(profile);
    },
    [setUser],
  );

  const fetchProfile = useCallback(async () => {
    setIsProfileLoading(true);
    setProfileLoadError('');
    try {
      const response = await getProfile();
      const currentProfile = response?.data?.data;
      syncProfileState(currentProfile);
      setProfileFeedback('');
      setProfileApiError('');
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to load profile.';
      setProfileLoadError(message);
    } finally {
      setIsProfileLoading(false);
    }
  }, [syncProfileState]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
    setProfileFeedback('');
    setProfileApiError('');
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordValues((prev) => ({ ...prev, [name]: value }));
    setPasswordFeedback('');
    setPasswordApiError('');
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileApiError('');
    setProfileFeedback('');
    const errors = validateProfile();
    setProfileErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsProfileSubmitting(true);
    try {
      const payload = {
        fullName: profileValues.fullName.trim(),
        email: profileValues.email.trim(),
      };

      const updateResponse = await updateProfile(payload);

      const refreshedProfileResponse = await getProfile();
      const refreshedProfile = refreshedProfileResponse?.data?.data;
      syncProfileState(refreshedProfile);

      setProfileErrors({});

      const successMessage = updateResponse?.data?.message || 'Profile updated successfully.';
      setProfileFeedback(successMessage);
    } catch (error) {
      const responseMessage = error?.response?.data?.message;
      setProfileApiError(responseMessage || 'Unable to update profile.');
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordApiError('');
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
      setPasswordErrors({});
      setPasswordValues({ currentPassword: '', newPassword: '' });
    } catch (error) {
      const responseMessage = error?.response?.data?.message;
      setPasswordApiError(responseMessage || 'Unable to change password.');
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handleProfileCancel = () => {
    if (!profileData) {
      return;
    }
    setProfileValues({
      fullName: profileData.fullName ?? '',
      email: profileData.email ?? '',
    });
    setProfileErrors({});
    setProfileApiError('');
    setProfileFeedback('');
  };

  const hasProfileChanges = useMemo(() => {
    if (!profileData) {
      return false;
    }
    return (
      profileData.fullName !== profileValues.fullName.trim() ||
      profileData.email !== profileValues.email.trim()
    );
  }, [profileData, profileValues.fullName, profileValues.email]);

  return (
    <section className="page">
      <h1 className="page__title">Profile</h1>
      <div className="page__grid">
        <div className="card">
          <h2 className="card__title">Account Details</h2>
          {profileLoadError && <div className="alert alert--error">{profileLoadError}</div>}
          <form className="form" onSubmit={handleProfileSubmit} noValidate>
            <label className="form__field">
              <span>Full Name</span>
              <input
                type="text"
                name="fullName"
                value={profileValues.fullName}
                onChange={handleProfileChange}
                disabled={isProfileLoading}
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
                disabled={isProfileLoading}
                required
              />
              {profileErrors.email && <small className="form__error">{profileErrors.email}</small>}
            </label>
            <div className="form__readonly">
              <span>Role</span>
              <p>{profileData?.role ?? user?.role ?? '—'}</p>
            </div>
            <div className="form__readonly">
              <span>Status</span>
              <p>{profileData?.status ?? user?.status ?? '—'}</p>
            </div>
            {profileApiError && <div className="alert alert--error">{profileApiError}</div>}
            {profileFeedback && <div className="form__success">{profileFeedback}</div>}
            <div className="form__actions">
              <button
                type="submit"
                className="button button--primary"
                disabled={isProfileSubmitting || isProfileLoading || !hasProfileChanges}
              >
                {isProfileSubmitting ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="button"
                onClick={handleProfileCancel}
                disabled={isProfileSubmitting || isProfileLoading || !hasProfileChanges}
              >
                Cancel
              </button>
            </div>
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
            {passwordApiError && <div className="alert alert--error">{passwordApiError}</div>}
            {passwordFeedback && <div className="form__success">{passwordFeedback}</div>}
            <button type="submit" className="button button--primary" disabled={isPasswordSubmitting}>
              {isPasswordSubmitting ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;
