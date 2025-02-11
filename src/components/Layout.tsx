import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Megaphone, 
  Users, 
  LogOut,
  QrCode
} from 'lucide-react';
import QRScanner from './QRScanner';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [showScanner, setShowScanner] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    { name: 'Registrations', href: '/admin/registrations', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex h-16 items-center justify-center border-b">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <nav className="mt-6">
            <div className="space-y-1 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center rounded-md px-2 py-2 text-sm font-medium`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={() => setShowScanner(true)}
                className="w-full text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center rounded-md px-2 py-2 text-sm font-medium"
              >
                <QrCode className="mr-3 h-5 w-5" />
                Scan QR
              </button>
            </div>
          </nav>
          <div className="absolute bottom-0 w-64 border-t p-4">
            <button
              onClick={logout}
              className="flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6">{children}</main>
        </div>
      </div>

      {showScanner && <QRScanner onClose={() => setShowScanner(false)} />}
    </div>
  );
};

export default Layout;