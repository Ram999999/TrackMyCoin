import React, { useContext } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import arrow_icon from '../../assets/arrow_icon.png';
import { CoinContext } from '../../context/CoinContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);
  const { user, setUser } = useAuth(); //Access user from info

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd":
        setCurrency({ name: "usd", symbol: "$" });
        break;
      case "eur":
        setCurrency({ name: "eur", symbol: "Ē" });
        break;
      case "inr":
        setCurrency({ name: "inr", symbol: "₹" });
        break;
      default:
        setCurrency({ name: "usd", symbol: "$" });
    }
  };
  
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
  navigate('/signin');
};


  return (
    <div className='navbar'>
      <Link to='/' className='nav-logo'>
        <img src={logo} alt="CryptoTracker Logo" className='logo-img' />
      </Link>
    <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to="/blog">Blog</Link></li>
      </ul>



      <div className='nav-right'>
        <select onChange={currencyHandler}>
          <option value="inr">INR</option>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
        </select>

        {user ? (
          <>
            <span style={{ marginRight: '10px' }}>Hi, {user.name?.split(' ')[0]}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/signup" className="signup-link">
            <button>
              Sign Up <img src={arrow_icon} alt='Arrow Icon' />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
