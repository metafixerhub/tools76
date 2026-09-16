import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './pages/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Submissions from './pages/Submissions';
import './index.css';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="export" element={<div style={{padding: '2rem'}}>Export Data Feature coming soon...</div>} />
            <Route path="settings" element={<div style={{padding: '2rem'}}>Form Settings coming soon...</div>} />
          </Route>
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
  );
}

export default App;
