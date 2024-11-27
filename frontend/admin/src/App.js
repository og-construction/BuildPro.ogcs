import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import LoginPage from './components/LoginPage';
import SellerManagement from './components/sellerManagement';
import SellerDetails from './components/SellerDetails';
import ProductDetails from './components/ProductDetails';
import Notification from './components/notification';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPage />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="sellers" element={<SellerManagement />} />
                    <Route path="sellers/:id" element={<SellerDetails />} />
                    <Route path="product/:productId" element={<ProductDetails />} />
                    <Route path="notifications" element={<Notification />} /> {/* Updated component name */}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
