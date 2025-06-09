
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  Plane, 
  Plus, 
  TrendingUp, 
  User, 
  BarChart3 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: BarChart3,
  },
  {
    title: 'Flights',
    href: '/flights',
    icon: Plane,
  },
  {
    title: 'Add',
    href: '/add-flight',
    icon: Plus,
  },
  {
    title: 'Recommendations',
    href: '/recommendations',
    icon: TrendingUp,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export const MobileNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden safe-area-bottom shadow-lg">
      <nav className="flex">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center px-2 py-3 min-h-[68px] flex-1 transition-colors font-system",
                isActive
                  ? "text-blue-500 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
              )
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
