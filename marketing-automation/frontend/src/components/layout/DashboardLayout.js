import React, { useState } from 'react';
import { useLocation, Outlet, useNavigate } from 'react-router-dom';
import ResizableSidebar from './ResizableSidebar';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(256);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Campaigns', path: '/campaigns', icon: 'campaign' },
    { name: 'Workflows', path: '/workflows', icon: 'account_tree' },
    { name: 'Products', path: '/products', icon: 'inventory_2' },
    { name: 'Landing Pages', path: '/landing-pages', icon: 'web' },
    { name: 'Social Media', path: '/social-media', icon: 'share' },
    { name: 'Email Templates', path: '/email-templates', icon: 'email' },
    { name: 'Analytics', path: '/analytics', icon: 'analytics' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ];

  const handleSidebarWidthChange = (newWidth) => {
    setSidebarWidth(newWidth);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <ResizableSidebar 
        navigation={navigation} 
        onWidthChange={handleSidebarWidthChange}
      />

      {/* Main Content */}
      <div 
        className="flex-1 transition-all duration-200"
        style={{ marginLeft: sidebarWidth }}
      >
        {/* Top Navigation Bar */}
        <div 
          className="fixed top-0 right-0 bg-[#6366F1] shadow-sm z-10 transition-all duration-200"
          style={{ left: sidebarWidth, height: '64px' }}
        >
          <div className="flex items-center justify-between h-full px-6">
            {/* Back/Forward Navigation */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Go back"
              >
                <span className="material-icons text-white/90">arrow_back</span>
              </button>
              <button 
                onClick={() => navigate(1)} 
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Go forward"
              >
                <span className="material-icons text-white/90">arrow_forward</span>
              </button>
            </div>

            {/* Page Title */}
            <h1 className="text-lg font-semibold text-white">
              {navigation.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 text-white/90 hover:bg-white/10 rounded-lg transition-colors">
                <span className="material-icons text-white/90">help_outline</span>
                <span className="text-sm">Help</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white text-[#6366F1] hover:bg-white/90 rounded-lg transition-colors">
                <span className="material-icons">add</span>
                <span className="text-sm font-medium">New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="w-full p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
