
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, PlusSquare, Heart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Flights',
    href: '/flights',
    icon: Map,
  },
  {
    title: 'Add Flight',
    href: '/add-flight',
    icon: PlusSquare,
  },
  {
    title: 'Recommendations',
    href: '/recommendations',
    icon: Heart,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export const BottomNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <nav className="flex">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center px-2 py-2 min-h-[64px] flex-1 transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={cn(
                    "h-5 w-5 mb-1",
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
