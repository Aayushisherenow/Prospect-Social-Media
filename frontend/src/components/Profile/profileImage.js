import React from 'react'
import defaultProfile from "../../uploads/blank_profile.png";
import { useUserContext } from '../../context/userContext';
import axios from "axios";



const ProfileImage = () => {



  const { user } = useUserContext(); 
 
  
  
  return (
    <div>
      <div className="border p-1 rounded-full">
        <img
          className="h-16 w-16 rounded-full object-cover"
         src={user.coverImage}
                //  src={defaultProfile}
                 alt={defaultProfile}
        />
          </div>
          
      </div>
      
  );
}

export default ProfileImage
