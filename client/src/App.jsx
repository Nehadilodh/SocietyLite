import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Notice from './pages/Notice';
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Residents from './pages/admin/Residents';
import Guards from './pages/admin/Guards';
import Visitors from './pages/admin/Visitors';
import Bills from './pages/admin/Bills';
import AdminComplaints from './pages/admin/Complaints';
import ComplaintDetail from './pages/admin/ComplaintDetail';
import Notices from './pages/admin/Notices';
import Inquiries from './pages/admin/Inquiries';

// Guard Pages
import GuardDashboard from './pages/guard/Dashboard';
import VisitorEntry from './pages/guard/VisitorEntry';
import TodaysLog from './pages/guard/TodaysLog';
import GuardHistory from './pages/guard/History';

// Resident Pages
import ResidentDashboard from './pages/resident/Dashboard';
import MyProfile from './pages/resident/MyProfile';
import MyBills from './pages/resident/MyBills';
import ResidentComplaints from './pages/resident/Complaints';
import ResidentComplaintDetail from './pages/resident/ComplaintDetail';
import ResidentNotice from './pages/resident/Notice';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-gray-100 bg-white text-slate-900 transition-colors duration-300">
            <main className="flex-grow flex flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/notice" element={<Notice />} />
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/resident" element={<ProtectedRoute role="resident"><ResidentDashboard /></ProtectedRoute>} />
                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/residents" element={<ProtectedRoute role="admin"><Residents /></ProtectedRoute>} />
                  <Route path="/admin/guards" element={<ProtectedRoute role="admin"><Guards /></ProtectedRoute>} />
                  <Route path="/admin/visitors" element={<ProtectedRoute role="admin"><Visitors /></ProtectedRoute>} />
                  <Route path="/admin/bills" element={<ProtectedRoute role="admin"><Bills /></ProtectedRoute>} />
                  <Route path="/admin/complaints" element={<ProtectedRoute role="admin"><AdminComplaints /></ProtectedRoute>} />
                  <Route path="/admin/complaints/:id" element={<ProtectedRoute role="admin"><ComplaintDetail /></ProtectedRoute>} />
                  <Route path="/admin/notices" element={<ProtectedRoute role="admin"><Notices /></ProtectedRoute>} />
                  <Route path="/admin/inquiries" element={<ProtectedRoute role="admin"><Inquiries /></ProtectedRoute>} />

                  {/* Guard Routes */}
                  <Route path="/guard" element={<GuardDashboard />} />
                  <Route path="/guard/entry" element={<ProtectedRoute role="guard"><VisitorEntry /></ProtectedRoute>} />
                  <Route path="/guard/log" element={<ProtectedRoute role="guard"><TodaysLog /></ProtectedRoute>} />
                  <Route path="/guard/history" element={<ProtectedRoute role="guard"><GuardHistory /></ProtectedRoute>} />

                  {/* Resident Routes */}
                  <Route path="/resident/dashboard" element={<ProtectedRoute role="resident"><ResidentDashboard /></ProtectedRoute>} />
                  <Route path="/resident/profile" element={<ProtectedRoute role="resident"><MyProfile /></ProtectedRoute>} />
                  <Route path="/resident/bills" element={<ProtectedRoute role="resident"><MyBills /></ProtectedRoute>} />
                  <Route path="/resident/complaints" element={<ProtectedRoute role="resident"><ResidentComplaints /></ProtectedRoute>} />
                  <Route path="/resident/complaints/:id" element={<ProtectedRoute role="resident"><ResidentComplaintDetail /></ProtectedRoute>} />
                  <Route path="/resident/notice" element={<ProtectedRoute role="resident"><ResidentNotice /></ProtectedRoute>} />

                  {/* Fallback */}
                  <Route path="/" element={<ProtectedRoute><ResidentDashboard /></ProtectedRoute>} />
                </Route>
              </Routes>
            </main>

            <Toaster
              position="top-center"
              toastOptions={{
                duration: 2000,
                error: {
                  iconTheme: {
                    primary: '#ef4444', // Red 500
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
