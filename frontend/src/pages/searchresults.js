import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import { toast } from "react-toastify";
import Header from "../components/header";
import Profilebar from "../components/Profile/Profilebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faMessage } from "@fortawesome/free-solid-svg-icons"; 
import { useUserContext } from "../context/userContext";
import ChatWithUsers from "../components/chatswithuser";

const SearchResults = () => {
  const { query } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [chatUser, setChatUser] = useState(null);


  const currentUser = user; 
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axiosInstance.get(`/others/search/${query}`);
        if (res.status === 200) {
          setUsers(res.data.users);
          setPosts(res.data.posts);
        } else if (res.status === 204) {
          setUsers([]);
          setPosts([]);
        }
      } catch (err) {
        toast.error("Failed to fetch search results.");
      }
    };

    fetchResults();
  }, [query]);

  const handleUserClick = (user) => {
    navigate(`/viewProfile/${user._id}`, {
      state: {
        userData: user,
      },
    });
  };


  const handleMessageClick = (user) => {
    if (chatUser ) {
      setChatUser(null);
    }else {
      setChatUser(user);
    }

  };

  const goBack = () => {
    navigate(-1);
  }
  

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <span>
           <button onClick={goBack} className="text-purple-700 font-bold mb-6">
                      <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
        </span>
        <div className="border bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] border-gray-200 rounded-lg shadow-lg bg-white p-6">
          <h1 className="text-2xl font-bold mb-6 text-white">
            Search Results for: <span className="underline">{query}</span>
          </h1>

          {users.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Users</h2>
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => handleUserClick(u)}
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
                    <span
                      className="ml-auto pr-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessageClick(u);
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faMessage}
                        className="text-purple-500 hover:text-gray-100 transition duration-200 w-min-full h-[30px] cursor-pointer"
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {chatUser && (
            <ChatWithUsers
              sender={currentUser}
              receiver={chatUser}
              goBack={() => setChatUser(null)}
            />
          )}

          {posts.length > 0 && (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
              </div>
              <div className="relative mx-auto max-w-4xl border border-black bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-8">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="border-b-4 pb-6 relative rounded-lg"
                    >
                      {/* Author Info */}
                      <div className="flex justify-between items-center px-2 mb-4">
                        <div className="flex gap-4 items-center">
                          <img
                            className="h-12 w-12 border-2 border-black rounded-full object-cover"
                            src={
                              post.author?.coverImage || "/default-avatar.png"
                            }
                            alt="Profile"
                          />
                          <h2 className="text-xl font-medium">
                            {post.author?.username || "Unknown User"}
                          </h2>
                        </div>
                      </div>

                      {/* Media */}
                      {post.multimedia && post.multimedia.endsWith(".mp4") ? (
                        <video
                          className="w-full rounded-lg shadow-lg mb-4"
                          controls
                        >
                          <source src={post.multimedia} type="video/mp4" />
                        </video>
                      ) : post.multimedia ? (
                        <img
                          src={post.multimedia}
                          className="w-full rounded-lg shadow-lg mb-4"
                          alt="Post Multimedia"
                        />
                      ) : null}

                      {/* Content */}
                      <p className="text-gray-700 mb-6">{post.content}</p>

                      {/* View Full Post */}
                      <div className="border-2 border-[#7b2cbf] flex justify-center items-center bg-gradient-to-r from-[#9c4f96] to-[#7b2cbf] text-white rounded-xl px-6 py-3 transition duration-300 hover:scale-105 hover:shadow-lg">
                        <Link
                          to={`/post/${post._id}`}
                          className="text-lg font-semibold tracking-wide hover:underline hover:text-black"
                        >
                          View full post →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {users.length === 0 && posts.length === 0 && (
            <p className="text-gray-100 text-lg mt-6">No results to display.</p>
          )}
        </div>
      </div>

      <Profilebar />
    </>
  );
};

export default SearchResults;
