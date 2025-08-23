import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import 'react-tooltip/dist/react-tooltip.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import FormBuilder from './pages/FormBuilder';
import FormView from './pages/FormView';
import ResponseDashboard from './pages/ResponseDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/form/:formId" element={<FormView />} />
          <Route path="/builder/:formId?" element={<FormBuilder />} />
          <Route path="/responses/:formId" element={<ResponseDashboard />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
