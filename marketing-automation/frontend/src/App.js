import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import LandingPages from './pages/LandingPages';
import WorkflowBuilder from './pages/WorkflowBuilder';
import SocialMedia from './pages/SocialMedia';
import EmailTemplates from './pages/EmailTemplates';
import Products from './pages/Products';
import Campaigns from './pages/Campaigns';
import Settings from './pages/Settings';
import OAuthCallback from './components/oauth/OAuthCallback';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.css';
import './styles/enhanced.css';
import './styles/workflow.css';
import Workflows from './pages/Workflows';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/oauth/callback/:platform" element={<OAuthCallback />} />

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="landing-pages" element={<LandingPages />} />
          <Route path="workflows" element={<Workflows />} />
          <Route path="workflow-builder" element={<WorkflowBuilder />} />
          <Route path="workflow-builder/:id" element={<WorkflowBuilder />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="social-media" element={<SocialMedia />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="products" element={<Products />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="card"
      />
    </Router>
  );
};

export default App; 