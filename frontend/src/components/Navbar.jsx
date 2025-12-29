import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link');

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to={isAuthenticated ? '/dashboard' : '/'}>Mini UMS</Link>
      </div>
      <nav className="navbar__links">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>
            <span className="navbar__user">{user?.fullName}</span>
            <button type="button" onClick={handleLogout} className="navbar__button">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
            <NavLink to="/signup" className={navLinkClass}>
              Signup
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
