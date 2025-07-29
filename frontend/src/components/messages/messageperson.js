import React from "react";

const messages = [
  {
    id: 1,
    name: "John Doe",
    photo: "https://via.placeholder.com/50",
    message: "Hey, how are you?",
  },
  {
    id: 2,
    name: "Jane Smith",
    photo: "https://via.placeholder.com/50",
    message: "Let's meet up tomorrow!",
  },
  {
    id: 3,
    name: "Alice Brown",
    photo: "https://via.placeholder.com/50",
    message: "Good morning! Have a great day!",
  },
];

const MessagePerson = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 bg-gray-100 rounded-lg shadow-lg mt-20 ">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="flex items-center p-4 bg-white shadow-md rounded-lg border border-gray-200"
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
    </div>
  );
};

export default MessagePerson;
