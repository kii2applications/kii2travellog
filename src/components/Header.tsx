
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const { user, loading, signOut } = useAuth();

  // Don't render anything while loading or if no user is authenticated
  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <User className="h-5 w-5 text-blue-500" />
        <span className="text-gray-700">
          Welcome, {user?.user_metadata?.full_name || user?.email}
        </span>
      </div>
      <Button
        variant="outline"
        onClick={signOut}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};
