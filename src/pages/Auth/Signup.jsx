import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { Link } from 'react-router-dom';


const Signup = () => {
  const [step, setStep] = useState(1); // step 1: send otp, step 2: verify
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const res = await fetch("http://localhost:5000/api/auth/send-otp", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email })
    });
    const data = await res.json();
    if (res.ok) {
      alert("OTP sent to your email!");
      setStep(2);
    } else {
      alert(data.message || "Error sending OTP");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/signup-with-otp", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      alert("Signup successful!");
      navigate('/');
    } else {
      alert(data.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>👋 Welcome! Sign up</h2>
      <form onSubmit={step === 1 ? sendOTP : handleSignup}>
        {step === 1 && (
          <>
            <input type="text" name="name" placeholder="Full Name" required value={formData.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required value={formData.confirmPassword} onChange={handleChange} />
          </>
        )}
        {step === 2 && (
          <>
            <input type="text" name="otp" placeholder="Enter OTP" required value={formData.otp} onChange={handleChange} />
          </>
        )}
        <button type="submit">{step === 1 ? 'Send OTP' : 'Verify & Sign Up'}</button>
      </form>
      <p className="auth-toggle">
  Already have an account? <Link to="/signin">Sign in</Link>
</p>

    </div>
  );
};

export default Signup;
