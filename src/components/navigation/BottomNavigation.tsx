
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, PlusSquare, Heart, User } from 'lucide-react';
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
    title: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export const BottomNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 safe-area-bottom">
      <nav className="flex px-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center px-3 py-3 min-h-[68px] flex-1 transition-smooth rounded-xl mx-1 my-2",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
