import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { Menu, Package2, Calendar, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  const menuItems = [
    { icon: Package2, label: 'Inventory', path: '/inventory' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="bg-white h-screen w-64 border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Menu className="w-6 h-6 text-indigo-600" />
          <span className="font-semibold text-xl">EventPrep</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 w-full rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {user?.fullName || 'User'}
            </span>
            <span className="text-xs text-gray-500">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}