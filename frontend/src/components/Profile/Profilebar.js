import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../utils/axios";
import Profilecard from "./profilecard";
import Profilefollowers from "./profilefollowers";
import { useUserContext } from "../../context/userContext";

const Profilebar = () => {
  const { user } = useUserContext();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetchFollowersAndFollowing();
    }
  }, [user?._id]);

  const fetchFollowersAndFollowing = async () => {
    try {
      const followingResponse = await axiosInstance.get(
        `/users/${user._id}/following`
      );
      const followersResponse = await axiosInstance.get(
        `/users/${user._id}/followers`
      );

      setFollowers(followersResponse.data.followers);
      setFollowing(followingResponse.data.following);
    } catch (err) {
      console.error("Error fetching followers and following:", err);
    }
  };

  return (
    <>

      <Profilecard
        followers={followers}
        following={following}
      />
      <Profilefollowers
        followers={followers}
        setFollowers={setFollowers}
        following={following}
        setFollowing={setFollowing}
        />
        
    </>
  );
};

export default Profilebar;
