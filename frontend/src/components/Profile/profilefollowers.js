import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axios";
import { useUserContext } from "../../context/userContext";

const Profilefollowers = ({ setFollowers, setFollowing }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [followed, setFollowed] = useState({});
  const { user, refreshUser } = useUserContext();
  const userId = user?._id;

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await axiosInstance.get("/users/allusers");
        const users =
          res.data.allusers || res.data.users || res.data.data || [];

        const followedMap = {};
        users.forEach((u) => {
          if (u.followers?.includes(userId)) {
            followedMap[u._id] = true;
          }
        });

        setFollowed(followedMap);
        setAllUsers(users.filter((u) => u._id !== userId));
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    if (userId) fetchAllUsers();
  }, [userId]);

  const handleFollowToggle = async (targetId) => {
    const isFollowing = followed[targetId];
    setFollowed((prev) => ({ ...prev, [targetId]: !isFollowing }));

    try {
      const endpoint = isFollowing ? "/users/unfollow/" : "/users/follow/";
      await axiosInstance.post(`${endpoint}${targetId}`, { userId });

      const [followingRes, followersRes] = await Promise.all([
        axiosInstance.get(`/users/${userId}/following`),
        axiosInstance.get(`/users/${userId}/followers`),
      ]);

      setFollowing(followingRes.data.following);
      setFollowers(followersRes.data.followers);

      await refreshUser();
    } catch (err) {
      console.error("Follow/Unfollow error:", err);
    }
  };

  return (

    <div className="fixed top-1/3 right-0 w-44 bg-white text-black pl-2 rounded-l-lg shadow-lg pr-1 pt-2 h-screen mt-8">
      <h3 className="text-xl font-semibold mb-4 pl-2">People you may know</h3>
      <ul className="space-y-3">
        {allUsers.map((u) => (
          <li
            key={u._id}
            className="flex items-center rounded-lg justify-between gap-2 bg-gray-300 p-2"
          >
            <div className="flex items-center gap-2 w-full">
              <img
                src={u.coverImage || "/default-avatar.png"}
                alt={u.username}
                className="rounded-full w-8 h-8 object-cover"
              />
              <span className="text-sm text-black font-semibold w-full overflow-ellipsis overflow-hidden">
                {u.username}
              </span>
            </div>
            <button
              onClick={() => handleFollowToggle(u._id)}
              className={`text-white text-xs px-2 py-1 rounded-md transition ${
                followed[u._id]
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] hover:opacity-70"
              }`}
            >
              {followed[u._id] ? "Unfollow" : "Follow"}
            </button>
          </li>
        ))}
      </ul>
      </div>
  );
};

export default Profilefollowers;
