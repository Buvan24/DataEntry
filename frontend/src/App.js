import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage       from './pages/HomePage';
import DataEntryPage  from './pages/DataEntryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import MasterPage     from './pages/MasterPage';
import ReportsPage    from './pages/ReportsPage';

const Protected = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style:{ fontFamily:'DM Sans,sans-serif', fontSize:'14px', borderRadius:'8px', border:'1px solid #ddd9ce' },
          success:{ iconTheme:{ primary:'#2d6a4f', secondary:'#fff' } },
        }}/>
        <Routes>
          <Route path="/"               element={<HomePage />} />
          <Route path="/data-entry"     element={<DataEntryPage />} />
          <Route path="/admin/login"    element={<AdminLoginPage />} />
          <Route path="/admin"          element={<Protected><AdminDashboard /></Protected>} />
          <Route path="/admin/master"   element={<Protected><MasterPage /></Protected>} />
          <Route path="/admin/reports"  element={<Protected><ReportsPage /></Protected>} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
