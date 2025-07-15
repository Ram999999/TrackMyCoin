
import React from 'react';
import './index.css'; 
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar.jsx';
import Home from './pages/Home/Home.jsx';
import Features from './pages/Features.jsx';
import Pricing from './pages/Pricing.jsx';
import Blog from './pages/Blog.jsx';
import Coin from './pages/Coin/Coin.jsx';
import Footer from './components/Footer/Footer.jsx';
import Signup from './pages/Auth/Signup.jsx';
import Signin from './pages/Auth/Signin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 


const App = () => {
  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path='/pricing' element={<Pricing />} />
        <Route path="/blog" element={<Blog />} />
        <Route
          path='/coin/:coinId'
          element={
            <ProtectedRoute>
              <Coin />
            </ProtectedRoute>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

