/**
 * OmniRent v1.0 - Peer-to-Peer Marketplace
 * Developed by Islam Pashazade
 * * This project is open-source under the MIT License.
 * Attribution is required for all re-distributions.
 */




import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Browse from './pages/Browse';
import ListItem from './pages/ListItem';
import ItemDetail from './pages/ItemDetail';
import PublicProfile from './pages/PublicProfile';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/AdminDashboard';
import Legal from './pages/Legal';
import About from './pages/About';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Footer from './components/Footer';

// Import your guards
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-bg-primary text-text-primary font-sans transition-colors duration-300">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* 1. Open Routes (Anyone can see) */}
              <Route path="/" element={<Home />} />
              <Route path="/user/:id" element={<PublicProfile />} />
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<Legal />} />

              {/* 2. Public-Only Routes (Redirect to Profile if logged in) */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path="/forgot-password" element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              } />
              <Route path="/reset-password" element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              } />

              <Route path="/browse" element={<Browse />} />

              <Route path="/item/:id" element={<ItemDetail />} />


              <Route path="/list-item" element={
                <PrivateRoute>
                  <ListItem />
                </PrivateRoute>
              } />

              {/* 3. Private Routes (Redirect to Login if logged out) */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/messages" element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

