
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Plane } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { MainNavigation } from '@/components/navigation/MainNavigation';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold text-gray-900">
              Flight Tracker
            </span>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-6">
            <MainNavigation className="flex flex-row space-y-0 space-x-6" />
          </nav>

          {/* Right side - User actions and mobile menu */}
          <div className="flex items-center gap-4">
            {/* User info and sign out */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Mobile menu - Only visible on desktop for sidebar */}
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-8">
                      <Plane className="h-6 w-6 text-blue-500" />
                      <span className="text-lg font-bold">Flight Tracker</span>
                    </div>
                    
                    <MainNavigation 
                      className="flex-1"
                      onNavigate={() => setIsSheetOpen(false)}
                    />
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="text-sm text-gray-600 mb-3">
                        {user?.email}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="w-full justify-start text-gray-600 hover:text-gray-900"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
