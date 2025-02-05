import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface VideoCardProps {
  username: string;
  description: string;
  videoUrl: string;
  likes: number;
  comments: number;
  shares: number;
}

const VideoCard: React.FC<VideoCardProps> = ({
  username,
  description,
  videoUrl,
  likes,
  comments,
  shares,
}) => {
  return (
    <div className="relative h-screen max-h-[calc(100vh-4rem)] border-b border-gray-800">
      <video
        className="w-full h-full object-cover"
        src={videoUrl}
        loop
        muted
        playsInline
        controls
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <h3 className="font-bold">@{username}</h3>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
          <div className="flex flex-col gap-4 items-center">
            <button className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Heart size={24} />
              </div>
              <span className="text-xs mt-1">{likes}</span>
            </button>
            <button className="flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <MessageCircle size={24} />
              </div>
              <span className="text-xs mt-1">{comments}</span>
            </button>
            <button 
              className="flex flex-col items-center"
              onClick={async () => {
                try {
                  const shareData = {
                    title: username,
                    text: description,
                    url: videoUrl
                  };

                  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                    await navigator.share(shareData);
                  } else {
                    await navigator.clipboard.writeText(`${username}: ${description}\n${videoUrl}`);
                    alert('Content copied to clipboard!');
                  }
                } catch (error) {
                  console.error('Share failed:', error);
                  try {
                    await navigator.clipboard.writeText(`${username}: ${description}\n${videoUrl}`);
                    alert('Content copied to clipboard!');
                  } catch (clipboardError) {
                    console.error('Clipboard failed:', clipboardError);
                    alert('Unable to share or copy content');
                  }
                }
              }}
            >
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                <Share2 size={24} />
              </div>
              <span className="text-xs mt-1">{shares}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;