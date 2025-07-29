import React from "react";
import ProfileImage from "./profileImage.js";
import { useNavigate } from "react-router-dom";

const Profilecard = ({ followers, following }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user._id) {
    return <div>Loading...</div>;
  }

 const handleViewProfile = () => {
   navigate(`/viewProfile/${user._id}`, {
     state: {
       followers, 
       following,
     },
   });
 };

  return (
    <div className="profilecard fixed top-0 right-0 w-44 bg-white text-black border rounded-l-lg p-4 shadow-lg h-screen flex flex-col items-center space-y-4">
      {/* Profile Image */}
      <ProfileImage />

      {/* Username */}
      <div className="profilename text-center font-semibold text-lg">
        <span>{user.username}</span>
      </div>

      <h2
        onClick={handleViewProfile}
        className="text-blue text-sm cursor-pointer"
      >
        View Profile
      </h2>

      {/* Follower Status */}
      <div className="followerstatus w-full">
        <hr className="mb-2" />
        <div className="flex items-center justify-between text-xs font-medium">
          <div className="flex flex-col items-center w-1/2">
            <span>{following.length}</span>
            <span className="text-gray-500">Followings</span>
          </div>
          <div className="h-10 w-px bg-gray-300"></div>
          <div className="flex flex-col items-center w-1/2">
            <span>{followers.length}</span>
            <span className="text-gray-500">Followers</span>
          </div>
        </div>
        <hr className="mt-2" />
      </div>
    </div>
  );
};

export default Profilecard;
