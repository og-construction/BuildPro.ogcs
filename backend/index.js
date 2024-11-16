const http = require('http');
const express = require('express');
const dotenv = require('dotenv').config();
const dbConnect = require('./config/dbConnect');
const userRoute = require("./routes/userRoute");
const adminRoutes = require('./routes/adminRoute');
const productRoute = require("./routes/productRoute");
const CategoryRoute = require("./routes/CategoryRoute"); 
const SubCategoryRoute = require('./routes/SubCategoryRoute.js');
const role = require("./routes/roleRoute");
const seller = require("./routes/sellerRoute");
const OrderRoute = require("./routes/OrderRoute");
const cart = require('./routes/CartRoute');
const payment = require('./routes/paymentRoute');
const wishlist = require('./routes/wishlistRoute'); // Correctly import
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
//const rateLimit = require('express-rate-limit');
const socket = require('./socket.js'); // Import socket helper

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Initialize Socket.IO through the socket helper
socket.init(server);

// Connect to database
dbConnect();

// Middleware Configuration
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true
}));

/* Helmet Configuration
app.use(helmet({
    crossOriginResourcePolicy: false // Allows resources to be accessed across origins
}));
*/
// Rate Limiting

/* Default limiter (global rate limit for all routes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'development' ? 1000 : 100,
    message: "Too many requests, please try again later.",
});
const highLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Set higher limit for these routes
    message: "Too many requests, please try again later.",
});

// Apply the global rate limiter to all routes
app.use(limiter);
*/
/*
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // e.g., 15 minutes
    max: 100, // e.g., limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
});
*/


// Either globally apply the rate limiter:
//app.use(limiter); // Global rate-limiting for all routes
// Routes
app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/category', CategoryRoute);
app.use('/api/subcategory',SubCategoryRoute);
app.use('/api/role', role);
app.use('/api/seller', seller);
app.use('/api/admin', adminRoutes);
app.use('/api/order', OrderRoute);
app.use('/api/cart', cart);
app.use('/api/payment', payment);
app.use('/api/wishlist', wishlist); // Properly set the base path

// Static File Serving with CORS Headers
app.use('/uploads', express.static('uploads', {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));


// Error Handling Middleware (Define these at the end)
app.use(notFound);
app.use(errorHandler);

// Server Initialization
server.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
