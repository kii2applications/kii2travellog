
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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 safe-area-top shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 font-system">
              Flight Tracker
            </span>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-2">
            <MainNavigation className="flex flex-row space-y-0 space-x-2" />
          </nav>

          {/* Right side - User actions and mobile menu */}
          <div className="flex items-center gap-3">
            {/* User info and sign out */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-gray-600 font-system">
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
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-white">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Plane className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-lg font-bold font-system">Flight Tracker</span>
                    </div>
                    
                    <MainNavigation 
                      className="flex-1"
                      onNavigate={() => setIsSheetOpen(false)}
                    />
                    
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="text-sm text-gray-600 mb-3 font-system">
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
