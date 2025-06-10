
import React, { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Post {
  id: number;
  username: string;
  avatar: string;
  location?: string;
  image: string;
  likes: number;
  caption: string;
  timeAgo: string;
}

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="bg-black border-b border-gray-800">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <img
            src={post.avatar}
            alt={post.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-white">{post.username}</p>
            {post.location && (
              <p className="text-xs text-gray-400">{post.location}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="p-1 text-white hover:bg-gray-800">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Post Image */}
      <div className="aspect-square">
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 text-white hover:bg-transparent"
              onClick={handleLike}
            >
              <Heart
                className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 text-white hover:bg-transparent">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 text-white hover:bg-transparent">
              <Share className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 text-white hover:bg-transparent"
            onClick={handleSave}
          >
            <Bookmark
              className={`h-6 w-6 ${isSaved ? 'fill-white' : ''}`}
            />
          </Button>
        </div>

        {/* Likes Count */}
        <p className="text-sm font-semibold text-white mb-2">
          {post.likes.toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="text-sm text-white mb-1">
          <span className="font-semibold">{post.username}</span>{' '}
          <span>{post.caption}</span>
        </div>

        {/* Time */}
        <p className="text-xs text-gray-400 uppercase">{post.timeAgo} ago</p>
      </div>
    </div>
  );
};
