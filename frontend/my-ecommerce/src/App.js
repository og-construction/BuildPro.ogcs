import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar.jsx';
import OrderPage from './Components/OrderPage';
import Onexvideo from './Pages/Onexvideo';
import Buyerschoice from './Pages/Buyerschoice'; // Correct capitalization
import SimilarProduct from './Pages/SimilarProducts.jsx';
import Checkout from './Pages/Checkout'; // Import the Checkout component
import Footer from './Components/Footer';
import Cart from './Pages/Cart';
import Wishlist from './Components/Wishlist';
import ProductList from './Pages/ProductList.jsx';
import ProductDetails from './Pages/productDetails.jsx'; // Corrected import

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Onexvideo />
                <Buyerschoice />
              </>
            }
          />
          <Route path="/Buyerschoice" element={<Buyerschoice />} />
          <Route path="/order" element={<OrderPage />} />
          {/* <Route path="/similar/:categoryId/:itemId" element={<SimilarProduct/>} /> */}
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/similar-products" element={<SimilarProduct />} />
          <Route path="/products/:subcategoryId" element={<ProductList />} />
          <Route path="/product/details/:productId" element={<ProductDetails />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
