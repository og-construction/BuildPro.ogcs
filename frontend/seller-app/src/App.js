import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Seller/HomePage.jsx'; 
import SellerPage from './components/Seller/SellerPage.jsx'; 
import DirectSale from './components/Seller/DirectSale';
import OgcsSale from './components/Seller/OgcsSale';
import VisibilityDetailsPage from './components/Seller/VisibilityDetailsPage';
import SignInForm from './components/SignInForm';
import AboutPage from './components/Seller/AboutPage';
import Deposit from './components/Seller/Deposit'; 
import CreateAccountForm from './components/CreateAccountForm'; 
import VerifyOtp from './components/VerifyOtp.jsx';
import Payment from './components/Payment.jsx';

const NotFound = () => <h2>404 - Page Not Found</h2>;

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/seller" element={<SellerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/create-account" element={<CreateAccountForm />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path="/direct-sale" element={<DirectSale />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/visibility-details" element={<VisibilityDetailsPage />} />
          <Route path="/sales-with-ogcs" element={<OgcsSale />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
