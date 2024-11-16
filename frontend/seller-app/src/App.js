import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import CreateAccountForm from './components/CreateAccountForm';
import Payment from './components/Payment.jsx';
import AboutPage from './components/Seller/AboutPage';
import Deposit from './components/Seller/Deposit';
import DirectSale from './components/Seller/DirectSale';
import HomePage from './components/Seller/HomePage.jsx';
import OgcsSale from './components/Seller/OgcsSale';
import SellerPage from './components/Seller/SellerPage.jsx';
import VisibilityDetailsPage from './components/Seller/VisibilityDetailsPage';
import SignIn from "./components/SignIn.jsx";
import VerifyOtp from './components/VerifyOtp.jsx';


const NotFound = () => <h2>404 - Page Not Found</h2>;

function App() {
  return (
    <Router>
      <ToastContainer/>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/seller" element={<SellerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/sign-in" element={<SignIn />} />
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
