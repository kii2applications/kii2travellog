
import React from 'react';
import { ReelCard } from '@/components/ReelCard';

const mockReels = [
  {
    id: 1,
    username: 'dance_moves',
    avatar: '/placeholder.svg',
    video: '/placeholder.svg',
    caption: 'New dance trend! 💃 #dance #viral',
    likes: 12500,
    comments: 847,
    shares: 234,
  },
  {
    id: 2,
    username: 'cooking_tips',
    avatar: '/placeholder.svg',
    video: '/placeholder.svg',
    caption: '60-second pasta recipe 🍝 #cooking #quick',
    likes: 8934,
    comments: 523,
    shares: 189,
  },
];

export const ReelsPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-black min-h-screen">
      <div className="space-y-0">
        {mockReels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </div>
  );
};
