
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
    title: 'Flights History',
    href: '/flights',
    icon: Plane,
  },
  {
    title: 'Add Flight',
    href: '/add-flight',
    icon: Plus,
  },
  {
    title: 'Travel Recommendations',
    href: '/recommendations',
    icon: TrendingUp,
  },
  {
    title: 'My Profile',
    href: '/profile',
    icon: User,
  },
];

interface MainNavigationProps {
  className?: string;
  onNavigate?: () => void;
}

export const MainNavigation: React.FC<MainNavigationProps> = ({ 
  className, 
  onNavigate 
}) => {
  return (
    <nav className={cn("space-y-2", className)}>
      {navigationItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
};
