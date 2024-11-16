import React, { useState, useEffect } from 'react'; // Removed useEffect
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import logo from './Assets/buillogo6.png';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [location, setLocation] = useState('Select your location');
  const [isLocationDropdownVisible, setIsLocationDropdownVisible] = useState(false);
  const [isSignInView, setIsSignInView] = useState(true);
  const [isSellerLogin, setIsSellerLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [locations, setLocations] = useState([]);
  const [type, setType] = useState('B2C'); // Added type state
  const [gstNumber, setGstNumber] = useState(''); // Added GST Number state
  const navigate = useNavigate();


  // Fetch locations or use mock data when the component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      // Mock data for testing
      const mockLocations = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'];
      setLocations(mockLocations);

      // Uncomment below lines when you have a valid API
      /*
      try {
        const response = await axios.get('https://example.com/api/locations'); // Replace with your API endpoint
        setLocations(response.data); // Assuming the response is an array of district names
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
      */
    };

    fetchLocations();
  }, []);



  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/seller/get-similar-products?name=${searchTerm}`);
      console.log('Response from backend:', response.data);
      navigate('/similar-products', { state: { products: response.data } });
    } catch (error) {
      console.error("Error fetching similar products:", error);
    }
    setSearchTerm('');
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
    setIsLocationDropdownVisible(false);
    setSearchTerm('');
  };


  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsSignInView(true);
    setEmail('');
    setPassword('');
    setName('');
    setMobile('');
    setOtp('');
    setIsOtpSent(false);
    setErrorMessage('');
    setSuccessMessage('');
    setType('B2C'); // Reset type
    setGstNumber(''); // Reset GST Number
  };

  const handleSellerButtonClick = () => {
    setIsModalVisible(true);
    setIsSellerLogin(true);
  };

  const openWishlist = () => {
    navigate('/wishlist');
  };
  const loginUserCtrl = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    try {
        const response = await axios.post('http://localhost:5000/api/user/login', {
            email: trimmedEmail,
            password: trimmedPassword
        });

        if (response.status === 200) {
            const { user, token } = response.data;
            
            // Save userId and token in localStorage or context
            localStorage.setItem("userId", user._id);
            localStorage.setItem("token", token);

            setIsModalVisible(false); // Close the modal on successful login
        }
    } catch (error) {
        setErrorMessage(error.response?.data.message || 'Something went wrong');
    }
};


  const createUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', { name, email, password, mobile,type,
        gstNumber: type === 'B2B' ? gstNumber : undefined // Only send GST Number if B2B
       });
      console.log('User registered:', response.data);
      setIsOtpSent(true);
    } catch (error) {
      setErrorMessage(error.response?.data.message || error.message);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const user = await axios.post('http://localhost:5000/api/user/verify-otp', { email, otp });
      console.log('OTP verification response:', user.data);
      setIsModalVisible(false);
      setSuccessMessage('OTP verified successfully!');
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'OTP verification failed');
    }
  };

  // Filtered locations based on search term
  const filteredLocations = locations.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <nav className='navbar'>
      <img src={logo} alt="Logo" className='navbar-logo' />
      <div className='navbar-location'>
        <div className='location-selector' onClick={() => setIsLocationDropdownVisible(!isLocationDropdownVisible)}>
          <span>{location}</span>
          <span className='arrow-down'>&#9662;</span>
        </div>
        {isLocationDropdownVisible && (
          <div className='location-dropdown'>
            <div className='dropdown-header'>Select your location</div>
            <input
              type="text"
              placeholder="Search location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='location-search-input'
            />
            {filteredLocations.length === 0 ? (
              <div className='dropdown-item'>No locations found</div>
            ) : (
              filteredLocations.map((loc, index) => (
                <div key={index} className='dropdown-item' onClick={() => handleLocationChange(loc)}>
                  {loc}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <form className='navbar-search' onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div className='navbar-links'>
        <button className='signButton' onClick={() => setIsModalVisible(true)}>
          <i className="bi bi-person-fill"></i> login
        </button>
        <button className='sellerButton' onClick={handleSellerButtonClick}>
          <i className="bi bi-person-plus-fill"></i> Seller
        </button>
        <button className='orderButton' onClick={() => navigate('/order')}>
          <i className="bi bi-cart-fill"></i> Order
        </button>
      </div>
      {/* Add Cart Icon */}
  <button className='cartButton' onClick={() => navigate('/cart')}>
    <i className="bi bi-cart">cart</i>
  </button>
  <div className='navbar-heart'>
        <button onClick={openWishlist} className="wishlist-button">
          <i className="bi bi-heart-fill"></i> Wishlist
        </button>
      </div>
      {isModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleModalClose}>&times;</span>
            {isSignInView ? (
              <>
                <h2>{isSellerLogin ? 'Seller Sign In' : 'Sign In'}</h2>
                <form onSubmit={loginUserCtrl}>
                  <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="submit">Sign In</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>Don't have an account? <button onClick={() => setIsSignInView(false)}>Register</button></p>
              </>
            ) : isOtpSent ? (
              <>
                <h2>Verify OTP</h2>
                <form onSubmit={verifyOtp}>
                  <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  <button type="submit">Verify</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
                <p>Didn't receive the OTP? <button onClick={createUser}>Resend</button></p>
              </>
            ) : (
              <>
                <h2>Register</h2>
                <form onSubmit={createUser}>
                  <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <input type="text" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="B2C">B2C</option>
                    <option value="B2B">B2B</option>
                  </select>
                  
                  {type === 'B2B' && (
                    <input
                      type="text"
                      placeholder="GST Number"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                    />
                  )}
                  <button type="submit">Register</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>Already have an account? <button onClick={() => setIsSignInView(true)}>Sign In</button></p>
              </>
            )}
          </div>
        </div>
        )}  </nav>
  );
};

export default Navbar;
