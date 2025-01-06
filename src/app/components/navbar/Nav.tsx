import { Link } from 'react-router-dom';
import './nav.css';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../../features/authSlice';

const Nav = () => {
  const dispatch = useAppDispatch();
  const { userProfile, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !userProfile) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
        <Link to="/add" className="nav-link">New Poll</Link>
      </div>
      <div className="user-info">
        <div className="user-profile">
          <img 
            src={userProfile.avatarURL} 
            alt={`Avatar of ${userProfile.name}`} 
            className="avatar" 
          />
          <span className="username">{userProfile.name}</span>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Nav;