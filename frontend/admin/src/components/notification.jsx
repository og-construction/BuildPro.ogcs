import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './notification.css'; 

const socket = io("http://localhost:5000");  

const Notification = ({ incrementNotificationCount }) => {
    useEffect(() => {
        socket.on('newProduct', (data) => {
            toast.info(`New product added: ${data.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            if (data.product) {  // Check if data.product is defined
                incrementNotificationCount(data.product); // Pass the product data to AdminPage
            }
        });
        
        return () => {
            socket.off('newProduct');
        };
    }, [incrementNotificationCount]);

    return (
        <div>
            <ToastContainer />
        </div>
    );
};

export default Notification;
