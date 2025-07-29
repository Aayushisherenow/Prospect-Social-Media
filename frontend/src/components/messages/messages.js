import React, { useState } from "react";

const messages = [
  {
    id: 1,
    name: "John Doe",
    photo: "https://via.placeholder.com/50",
    message: "Hey, how are you?",
    userId: 1,
  },
  {
    id: 2,
    name: "Jane Smith",
    photo: "https://via.placeholder.com/50",
    message: "Let's meet up tomorrow!",
    userId: 2,
  },
  {
    id: 3,
    name: "Alice Brown",
    photo: "https://via.placeholder.com/50",
    message: "Good morning! Have a great day!",
    userId: 3,
  },
];

const MessageBox = ({ user }) => {
  const [messagesWithUser, setMessagesWithUser] = useState([
    { sender: "Me", text: "Hey! How's it going?" },
    { sender: user.name, text: "I'm good, thanks!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    setMessagesWithUser((prevMessages) => [
      ...prevMessages,
      { sender: "Me", text: newMessage },
    ]);
    setNewMessage("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] rounded-lg shadow-lg mt-20">
      <div className="flex items-center p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <div className="w-14 h-14 mr-4 border-2 border-gray-300 rounded-full overflow-hidden">
          <img
            src={user.photo}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-lg text-gray-900">
            {user.name}
          </span>
        </div>
      </div>
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        {messagesWithUser.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "Me" ? "text-right" : "text-left"}
          >
            <div
              className={
                msg.sender === "Me"
                  ? "inline-block bg-blue-500 text-white p-2 rounded-lg"
                  : "inline-block bg-gray-300 text-gray-900 p-2 rounded-lg"
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          className="p-2 border border-gray-300 rounded-l-lg w-full"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const MessagePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4 bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] rounded-lg shadow-lg mt-20">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="flex items-center p-4 bg-white shadow-md rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-200"
          onClick={() => setSelectedUser(msg)}
        >
          <div className="w-14 h-14 mr-4 border-2 border-gray-300 rounded-full overflow-hidden">
            <img
              src={msg.photo}
              alt={msg.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-900">
              {msg.name}
            </span>
            <span className="text-gray-600 text-sm mt-1">{msg.message}</span>
          </div>
        </div>
      ))}

      {selectedUser && <MessageBox user={selectedUser} />}
    </div>
  );
};

export default MessagePage;
