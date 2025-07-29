import React, { createContext, useState, useContext, useEffect } from "react";
import { axiosInstance } from "../utils/axios";
import socket from "../utils/socket";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : {
          isLoggedIn: false,
          username: "",
          email: "",
          coverImage: "",
          _id: "",
        };
  });

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  // Store user in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // Socket connect
  const connectSocket = () => {
    if (!socket.connected) {
      socket.connect();
      console.log("Socket connected:", socket.id);
    }
  };

  // Socket disconnect
  const disconnectSocket = () => {
    if (socket.connected) {
      socket.disconnect();
      console.log("Socket disconnected");
    }
  };

  // Login
  const login = (userData) => {
    setUser({
      isLoggedIn: true,
      ...userData,
    });
    connectSocket();
  };


  // Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/users/logout");
    } catch (err) {
      console.warn(
        "Logout request failed. Proceeding with client-side logout."
      );
    }

    localStorage.removeItem("user");

    setUser({
      isLoggedIn: false,
      username: "",
      email: "",
      coverImage: "",
      _id: "",
    });

    setFollowers([]);
    setFollowing([]);
    disconnectSocket();
  };

  // Refresh User Data
  const refreshUser = async () => {
    try {
      const userRes = await axiosInstance.get(`/users/${user._id}`);
      const followersRes = await axiosInstance.get(
        `/users/${user._id}/followers`
      );
      const followingRes = await axiosInstance.get(
        `/users/${user._id}/following`
      );

      setUser({
        isLoggedIn: true,
        ...userRes.data.user,
      });

      setFollowers(followersRes.data.followers || []);
      setFollowing(followingRes.data.following || []);
      connectSocket();
    } catch (err) {
      console.error("Failed to refresh user context:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        refreshUser,
        followers,
        following,
        setFollowers,
        setFollowing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
