import { useState, useEffect } from "react";
import { useUserContext } from "../context/userContext";
import { axiosInstance } from "../utils/axios";
import ChatWithUsers from "./chatswithuser";

const Chatusers = () => {
  const { user } = useUserContext();
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (user?._id) fetchAllUsers();
  }, [user?._id]);

  const fetchAllUsers = async () => {
    try {
      const res = await axiosInstance.get("/users/allusers");
      const users = res.data.allusers || res.data.users || res.data.data || [];
      setAllUsers(users.filter((u) => u._id !== user._id));
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const filteredUsers = allUsers.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedUser) {
    return (
      <ChatWithUsers
        sender={user}
        receiver={selectedUser}
        goBack={() => setSelectedUser(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6 border border-purple-100">
        <h2 className="text-3xl font-bold text-center mb-4">💬 Start a Chat</h2>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />

        <div className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className="flex items-center p-3 bg-gray-50 hover:bg-purple-300 border border-gray-100 rounded-lg cursor-pointer transition duration-200"
              >
                <img
                  src={u.coverImage || "/default-avatar.png"}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover mr-4 border border-purple-300"
                />
                <span className="text-gray-800 font-medium text-lg">
                  {u.username}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-4">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatusers;
