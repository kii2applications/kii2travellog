
import React from 'react';
import { Settings, Grid3X3, Bookmark, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-black min-h-screen">
      {/* Profile Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">your_username</h2>
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-gray-800">
            <Settings className="h-6 w-6" />
          </Button>
        </div>

        {/* Profile Stats */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-0.5">
            <img
              src="/placeholder.svg"
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />
          </div>
          
          <div className="flex-1 flex justify-around">
            <div className="text-center">
              <div className="text-lg font-bold text-white">123</div>
              <div className="text-xs text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">1.2K</div>
              <div className="text-xs text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-white">456</div>
              <div className="text-xs text-gray-400">Following</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-white font-semibold">Your Name</p>
          <p className="text-gray-300 text-sm">📍 Your Location</p>
          <p className="text-gray-300 text-sm">✨ Your bio here</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          <Button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white">
            Edit Profile
          </Button>
          <Button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white">
            Share Profile
          </Button>
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-gray-800">
            <UserCheck className="h-5 w-5" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800">
          <button className="flex-1 py-3 text-white border-b-2 border-white">
            <Grid3X3 className="h-6 w-6 mx-auto" />
          </button>
          <button className="flex-1 py-3 text-gray-400">
            <Bookmark className="h-6 w-6 mx-auto" />
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-800">
            <img
              src="/placeholder.svg"
              alt="Post"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
