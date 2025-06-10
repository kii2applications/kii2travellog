
import React from 'react';
import { Map, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TopHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-50">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center">
          <Map className="h-6 w-6 text-white mr-2" />
          <h1 className="text-xl font-bold text-white">TravelLog</h1>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-gray-800">
            <Settings className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-gray-800">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};
