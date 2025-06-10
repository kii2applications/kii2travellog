
import React from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Reel {
  id: number;
  username: string;
  avatar: string;
  video: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
}

interface ReelCardProps {
  reel: Reel;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  return (
    <div className="relative h-screen bg-black">
      {/* Video Background */}
      <div className="absolute inset-0">
        <img
          src={reel.video}
          alt="Reel"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-black/20">
            <Heart className="h-7 w-7" />
          </Button>
          <span className="text-xs text-white font-medium">{reel.likes.toLocaleString()}</span>
        </div>

        <div className="flex flex-col items-center">
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-black/20">
            <MessageCircle className="h-7 w-7" />
          </Button>
          <span className="text-xs text-white font-medium">{reel.comments}</span>
        </div>

        <div className="flex flex-col items-center">
          <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-black/20">
            <Share className="h-7 w-7" />
          </Button>
          <span className="text-xs text-white font-medium">{reel.shares}</span>
        </div>

        <Button variant="ghost" size="sm" className="p-2 text-white hover:bg-black/20">
          <MoreHorizontal className="h-7 w-7" />
        </Button>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-4 left-4 right-16">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={reel.avatar}
            alt={reel.username}
            className="w-8 h-8 rounded-full object-cover border-2 border-white"
          />
          <span className="text-white font-semibold">{reel.username}</span>
          <Button variant="outline" size="sm" className="h-6 px-3 text-xs border-white text-white bg-transparent hover:bg-white hover:text-black">
            Follow
          </Button>
        </div>
        <p className="text-white text-sm">{reel.caption}</p>
      </div>
    </div>
  );
};
