import React from "react";

function Cartproduct({
  cart,
  handleQuantityChange,
  handleRemoveFromCart,
  handleCheckout,
}) {
  return (
    <div
      key={cart._id}
      className="bg-white shadow-sm rounded-lg p-6 mb-6 border border-gray-200 transition duration-300"
    >
      <span className="text-xl font-semibold text-gray-800 mb-4">Product</span>

      {cart.items.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between mb-4 border-b pb-4"
        >
          <img
            src={`http://localhost:5000${item.productId.image}`}
            alt={item.productId.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1 ml-4">
            {/* Align Product Name and Total */}
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-800">
                {item.productId.name}
              </span>
              <p className="text-gray-600 font-semibold">
                Total: ₹{(item.productId.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <p className="text-gray-600">Price: {item.productId.price}</p>
            <p className="text-gray-600 ">
              Quantity:
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(cart._id, item._id, -1)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                >
                  -
                </button>
                <span className="mx-4">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(cart._id, item._id, 1)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                >
                  +
                </button>
              </div>
            </p>
            {/* Align Sold By and Remove */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-gray-600">
                Sold By: {item.productId.saleType}
              </p>
              <button
                onClick={() => handleRemoveFromCart(cart._id, item._id)}
                className="underline text-red-500 hover:text-red-700 transition duration-300"
              >
                Remove from cart
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* <div className="flex justify-between mt-6">
        <button
          onClick={() => handleCheckout(cart._id)}
          className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
        >
          Proceed to Checkout
        </button>
      </div> */}
    </div>
  );
}

export default Cartproduct;
