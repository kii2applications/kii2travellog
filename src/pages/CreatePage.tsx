
import React from 'react';
import { Camera, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CreatePage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto bg-black min-h-screen p-4">
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-8">Create New Post</h2>
        
        <div className="space-y-4">
          <Button className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white">
            <Camera className="h-6 w-6 mr-3" />
            Take Photo
          </Button>
          
          <Button className="w-full h-14 bg-purple-500 hover:bg-purple-600 text-white">
            <Image className="h-6 w-6 mr-3" />
            Choose from Gallery
          </Button>
          
          <Button className="w-full h-14 bg-pink-500 hover:bg-pink-600 text-white">
            <Video className="h-6 w-6 mr-3" />
            Record Video
          </Button>
        </div>
      </div>
    </div>
  );
};
