
import React from 'react';
import { Stories } from '@/components/Stories';
import { Feed } from '@/components/Feed';

export const HomePage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-black min-h-screen">
      {/* Stories Section */}
      <Stories />
      
      {/* Feed Section */}
      <Feed />
    </div>
  );
};
