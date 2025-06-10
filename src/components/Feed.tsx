
import React from 'react';
import { PostCard } from '@/components/PostCard';

const mockPosts = [
  {
    id: 1,
    username: 'travel_photographer',
    avatar: '/placeholder.svg',
    location: 'Paris, France',
    image: '/placeholder.svg',
    likes: 1234,
    caption: 'Beautiful sunset at the Eiffel Tower 🌅 #Paris #Travel',
    timeAgo: '2h',
  },
  {
    id: 2,
    username: 'food_enthusiast',
    avatar: '/placeholder.svg',
    location: 'New York, NY',
    image: '/placeholder.svg',
    likes: 856,
    caption: 'The best pizza in town! 🍕 Highly recommend this place',
    timeAgo: '4h',
  },
  {
    id: 3,
    username: 'nature_lover',
    avatar: '/placeholder.svg',
    location: 'Yosemite National Park',
    image: '/placeholder.svg',
    likes: 2103,
    caption: 'Hiking through paradise 🏔️ Nature never fails to amaze me',
    timeAgo: '6h',
  },
];

export const Feed: React.FC = () => {
  return (
    <div className="space-y-0">
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
