
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusSquare, Play, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Search',
    href: '/search',
    icon: Search,
  },
  {
    title: 'Create',
    href: '/create',
    icon: PlusSquare,
  },
  {
    title: 'Reels',
    href: '/reels',
    icon: Play,
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export const BottomNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <nav className="flex">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center px-4 py-2 min-h-[64px] flex-1 transition-colors",
                isActive
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-200 active:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={cn(
                    "h-6 w-6 mb-1",
                    isActive ? "fill-current" : ""
                  )} 
                />
                <span className="text-xs font-medium">{item.title}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
