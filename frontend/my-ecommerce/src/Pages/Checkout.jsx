import React, { useState } from 'react';
//import './Checkout.css';
import Style from "../Components/Style/Checkout.module.css"
 

const Checkout = () => {
    const [formData, setFormData] = useState({
        mobileNumber: '',
        pincode: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        townCity: '',
        state: 'Maharashtra', 
        paymentMethod: "card", 
    });

    const [showForm, setShowForm] = useState(false); // Add state for toggling form visibility

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Address submitted:', formData);
        alert('Address has been saved successfully!');
    };

    return (

        <div>
            <h1 className={Style["page-title"]}>Checkout</h1>
         
            <div className={Style["shipping-container"]}>
                {/* Add Address Button */}
                <button
                    className={Style["add-address-btn"]}
                    onClick={() => setShowForm(!showForm)}
                >
                    + Add a New Address
                </button>
                </div>

        <div className={Style["shipping-container"]}>
            <div className={Style["form-section"]}>
                <h2 className={Style["form-title"]}> Shipping Address</h2>
                <form onSubmit={handleSubmit}>
                    <div className={Style["form-group"]}>
                        <label>Mobile Number</label>
                        <input
                            type="text"
                            name="mobileNumber"
                            placeholder="Mobile number"
                            value={formData.mobileNumber}
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className={Style["form-group"]}>
                        <label>Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            placeholder="Pincode"
                            value={formData.pincode}
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className={Style["form-group"]}>
                        <label>House no./ Building/ Company/ Apartment</label>
                        <input
                            type="text"
                            name="addressLine1"
                            placeholder="House no./ Building/ Company/ Apartment"
                            value={formData.addressLine1}
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className={Style["form-group"]}>
                        <label>Area/ Street/ Sector/ Village</label>
                        <input
                            type="text"
                            name="addressLine2"
                            placeholder="Area/ Street/ Sector/ Village"
                            value={formData.addressLine2}
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className={Style["form-group"]}>
                        <label>Landmark</label>
                        <input
                            type="text"
                            name="landmark"
                            placeholder="Landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={Style["form-group"]}>
                        <label>Town/City</label>
                        <input
                            type="text"
                            name="townCity"
                            placeholder="Town/City"
                            value={formData.townCity}
                            required
                            onChange={handleChange}
                        />
                    </div>
                    <div className={Style["form-group"]}>
                        <label>State</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                        >
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Haryana">Haryana</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Telangana">Telangana</option>
                        </select>
                    </div>
                    <button type="submit" className={Style["submit-btn"]}>
                        Save Address
                    </button>
                </form>
            </div>
            <div className={Style["order-summary"]}>
                <h2>Order Summary</h2>
                <p>Items: ₹0.00</p>
                <p>Delivery: ₹0.00</p>
                <p className="total">
                    <strong>Order Total: ₹0.00</strong>
                </p>
                <p className="savings">Your Savings: ₹0.00</p>
                <button className={Style["place-order-btn"]}>Place your order</button>
            </div>
        </div>

         
        </div>
    );
};

export default Checkout;
