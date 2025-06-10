
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const SearchPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-black min-h-screen p-4">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-800">
            <img
              src="/placeholder.svg"
              alt="Search result"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
