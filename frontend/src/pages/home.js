import React, { useState } from 'react'
import Header from '../components/header'
import PostPage from '../components/posts/postpage.js';

import Searchbar from '../components/searchbar';
import PostShare from '../components/posts/postshare.js';

import FypPosts from '../components/fyp.js';
import Profilebar from "../components/Profile/Profilebar.js";
import AllPosts from '../components/allposts.js';




const Home = () => {

 
  const [isfyp, sefyp] = useState(false);
  

  return (
    <>
      <Header />
      <Searchbar />
      <PostShare />
      <div className="flex justify-center my-4 w-full bg-gray-800">
        <div
          className={`w-1/2 border-r-2 cursor-pointer ${
            isfyp ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => sefyp(true)}
        >
          <h2 className="text-center text-xl font-bold my-4">For You</h2>
        </div>
        <div
          className={`w-1/2 cursor-pointer mx-1/2 ${
            !isfyp ? "bg-gray-200" : "bg-white"
          }`}
          onClick={() => sefyp(false)}
        >
          <h2 className="text-center text-xl font-bold my-4">All Posts</h2>
        </div>
      </div>

      {isfyp ? <FypPosts /> : <AllPosts />}

      <Profilebar />
    </>
  );
}

export default Home
