import React, { useState } from 'react';
import './Checkout.css';

const Checkout = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'credit'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Order submitted:', formData);
        alert('Your order has been placed successfully!');
    };

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">Checkout</h1>
            <form onSubmit={handleSubmit}>
                <h2 className="section-title">Personal Information</h2>
                <div className="form-group">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        required
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        required
                        onChange={handleChange}
                    />
                </div>
                <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    required
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    required
                    onChange={handleChange}
                />
                <div className="form-group">
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        required
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        required
                        onChange={handleChange}
                    />
                </div>

                <h2 className="section-title">Payment Method</h2>
                <div className="payment-options">
                    {['credit', 'debit', 'paypal'].map((method) => (
                        <label key={method} className="payment-label">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={formData.paymentMethod === method}
                                onChange={handleChange}
                            />
                            {method.charAt(0).toUpperCase() + method.slice(1)}
                        </label>
                    ))}
                </div>

                <button type="submit" className="submit-btn">Place Order</button>
            </form>
        </div>
    );
};

export default Checkout;
