import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import ManageTrains from './pages/ManageTrains';
import ManageUsers from './pages/ManageUsers';
import ManageBookings from './pages/ManageBookings';
import ManageTransactions from './pages/ManageTransactions';
import TrainDetails from './pages/TrainDetails';
import PaymentPage from './pages/PaymentPage';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-railway-surface">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-10 h-10 border-3 border-railway-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-railway-silver text-sm font-semibold">Loading...</span>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-railway-surface flex flex-col font-outfit">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/train/:id" element={<TrainDetails />} />
              <Route path="/payment/:bookingId" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="trains" element={<ManageTrains />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="bookings" element={<ManageBookings />} />
                <Route path="transactions" element={<ManageTransactions />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
