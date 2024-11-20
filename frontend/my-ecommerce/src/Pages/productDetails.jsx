import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa"; // Importing heart icon for wishlist
import { useNavigate, useParams } from "react-router-dom";
import Product from "../Components/productListcomponents/Product";
import AboutCompany from "../Components/productListcomponents/companyContent";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1); // Add state for quantity selection

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/seller/details/${productId}`
        );
        const data = await response.json();
        if (response.ok) {
          setProduct(data);
          fetchSimilarProducts(data.name);
        } else {
          setError(data.message || "Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Error fetching product details");
      }
    };

    const fetchSimilarProducts = async (productName) => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/seller/get-similar-products?name=${encodeURIComponent(
            productName
          )}`
        );
        setSimilarProducts(response.data);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleAddToWishlist = async () => {
    try {
      await axios.post(`http://localhost:5000/api/wishlist/add`, {
        userId,
        productId,
      });
      alert("Product added to wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("Failed to add to wishlist");
    }
  };

  const handleAddToCart = async () => {
    try {
      // Send the selected quantity with the product to the cart
      await axios.post(`http://localhost:5000/api/cart/add-to-cart`, {
        userId,
        items: [{ productId, quantity }],
      });
      alert(`${product.name} added to cart with quantity ${quantity}`);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  // Update quantity using + and - buttons
  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      {error && <p className="text-red-500 text-center">{error}</p>}
      {product ? (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={`http://localhost:5000${product.image}`}
                alt={product.name}
                className="rounded-lg shadow-md w-full h-auto"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  {product.name}
                </h3>
                <FaRegHeart
                  onClick={handleAddToWishlist}
                  className="text-red-600  cursor-pointer"
                  size={24}
                />
              </div>
              <p className="text-xl font-semibold text-gray-700 mb-4">
                Price: <span>₹{product.price.toLocaleString()}</span>
              </p>
              <p className="text-gray-600 mb-2">Size: {product.size}</p>
              <p className="text-gray-600 mb-4">
                Quantity:{" "}
                {product.quantity > 0 ? (
                  <span className=" font-semibold">
                    {product.quantity}{" "}
                    <span className="text-green-500">Available</span>
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    Out of stock
                  </span>
                )}
              </p>

              <p className="text-gray-600 mb-4">Category: {product.category}</p>
              <p className="text-gray-600 mb-4">
                Subcategory: {product.subcategory}
              </p>
              <p className="text-gray-600 mb-6">{product.description}</p>

              {product.quantity > 0 && (
                <div className="flex items-center mb-6">
                  <label className="block text-gray-700 font-semibold mr-4">
                    Select Quantity:
                  </label>
                  <button
                    onClick={decreaseQuantity}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md h-8 flex items-center justify-center"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(e.target.value, product.quantity))
                      )
                    }
                    min="1"
                    max={product.quantity}
                    className="text-center border border-gray-300 rounded-lg mx-2 h-8"
                    disabled
                  />
                  <button
                    onClick={increaseQuantity}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md h-8 flex items-center justify-center"
                    disabled={quantity >= product.quantity}
                  >
                    +
                  </button>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  className="bg-gradient-to-r  from-red-500 to-red-600 text-white py-2 px-40 rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">Specifications:</h3>
            {product.specifications?.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="text-gray-700">
                    <strong className="text-gray-900">{spec.key}:</strong>{" "}
                    {spec.value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No specifications available.</p>
            )}
          </div>
          <AboutCompany />
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-4">Related products</h3>
            {similarProducts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {similarProducts.map((similarProduct) => (
                  <Product key={similarProduct._id} product={similarProduct} />
                ))}
              </div>
            ) : (
              <p className="text-gray-700">No similar products found.</p>
            )}
          </div>
        </>
      ) : (
        !error && (
          <p className="text-center text-xl">Loading product details...</p>
        )
      )}
    </div>
  );
};

export default ProductDetails;
