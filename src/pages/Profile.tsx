import React from 'react';
import { Settings, Grid, Bookmark, Heart } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">@username</h1>
          <Settings size={24} />
        </div>

        <div className="flex justify-center mb-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 mx-auto mb-2">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="font-bold">124</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
              <div className="text-center">
                <div className="font-bold">8.5K</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold">23K</div>
                <div className="text-xs text-gray-400">Likes</div>
              </div>
            </div>
            <button className="bg-[#FE2C55] text-white px-8 py-2 rounded-md font-medium">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="flex justify-around border-b border-gray-800">
          <button className="flex-1 py-3 border-b-2 border-white">
            <Grid size={20} className="mx-auto" />
          </button>
          <button className="flex-1 py-3 text-gray-500">
            <Bookmark size={20} className="mx-auto" />
          </button>
          <button className="flex-1 py-3 text-gray-500">
            <Heart size={20} className="mx-auto" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 mt-1">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-800 relative"
            >
              <img
                src={`https://images.unsplash.com/photo-${1580000000000 + i}?w=300&q=80`}
                alt={`Post ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;