import { useEffect, useState } from "react";
import { axiosInstance } from "../utils/axios";
import { faPaperPlane, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUserContext } from "../context/userContext";
import socket from "../utils/socket";

const ChatWithUsers = ({ sender, receiver, goBack }) => {
  const { user } = useUserContext();
  const myId = user._id;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  
 

  const fetchChatHistory = async () => {
    try {
      const res = await axiosInstance.get(
        `/messages/chathistory/${sender._id}/${receiver._id}`
      );
      setMessages(res.data.messages || res.data.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    if (sender?._id && receiver?._id) {
      fetchChatHistory();
    }
  }, [sender._id, receiver._id]);


  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log("Socket connected for Chat");
    }

    socket.emit("joinRoom", myId);

    // Listen for incoming messages when connected
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("newPrivateMessage", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the socket and listeners when the component unmounts
    return () => {
      socket.off("connect");
      socket.off("newPrivateMessage");
      socket.emit("leaveRoom", myId);

      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected from ChatWithUsers");
      }
    };
  }, [myId]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      message: inputMessage,
      sender: sender._id,
      receiver: receiver._id,
      createdAt: new Date().toISOString(), 
    };

    try {

      await axiosInstance.post(`/messages/sendMessage/${receiver._id}`, {
        message: inputMessage,
        senderId: sender._id,
        receiverId: receiver._id,
      });

      setInputMessage("");
      setMessages((prev) => [...prev, newMessage]); // Instantly show the sent message
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] p-6">
      <div className="max-w-3xl mx-auto mt-5 p-4 bg-gray-300 h-[90vh] shadow-lg rounded-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between space-x-4 mb-4">
          <button onClick={goBack} className="text-purple-700 font-bold">
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold">Chat with {receiver.username}</h2>
            <img
              src={receiver.coverImage || "/default-avatar.png"}
              alt={receiver.username}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 bg-gray-900 w-full rounded-lg p-4 flex flex-col overflow-y-scroll space-y-2">
          {messages.length === 0 ? (
            <div className="flex justify-center">
              <p className="text-gray-100 text-center">No messages yet.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg w-fit max-w-[70%] ${
                  msg.sender === myId
                    ? "self-end bg-green-100 text-black"
                    : "self-start bg-blue-100 text-black"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <small className="block text-gray-500 text-xs mt-1">
                  {new Date(msg.createdAt).toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                    day: "numeric",
                    month: "short",
                  })}
                </small>
              </div>
            ))
          )}
        </div>

        {/* Input Field and Send Button */}
        <div className="w-full bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] rounded-lg flex items-center px-2 py-2 space-x-2 mt-2">
          <form
            className="w-full bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] rounded-lg flex items-center px-2 py-2 space-x-2 mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Type something..."
              className="flex-1 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-md hover:bg-purple-100 transition flex gap-2 items-center">
              <FontAwesomeIcon icon={faPaperPlane} />
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatWithUsers;
