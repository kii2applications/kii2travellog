
import React from 'react';
import { Plus } from 'lucide-react';

const mockStories = [
  { id: 1, username: 'Your story', avatar: '/placeholder.svg', isOwn: true },
  { id: 2, username: 'john_doe', avatar: '/placeholder.svg' },
  { id: 3, username: 'jane_smith', avatar: '/placeholder.svg' },
  { id: 4, username: 'travel_diaries', avatar: '/placeholder.svg' },
  { id: 5, username: 'food_lover', avatar: '/placeholder.svg' },
];

export const Stories: React.FC = () => {
  return (
    <div className="bg-black border-b border-gray-800">
      <div className="flex gap-4 p-4 overflow-x-auto scrollbar-hide">
        {mockStories.map((story) => (
          <div key={story.id} className="flex flex-col items-center min-w-[70px]">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full p-0.5 ${story.isOwn ? 'bg-gray-600' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'}`}>
                <div className="w-full h-full bg-black rounded-full p-0.5">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              {story.isOwn && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                  <Plus className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs text-white mt-1 text-center truncate w-16">
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
