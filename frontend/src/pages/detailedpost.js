import React from 'react'
import Header from '../components/header'
import PostPage from '../components/posts/postpage'
import Profilebar from '../components/Profile/Profilebar'
import Searchbar from '../components/searchbar'

const Detailedpost = () => {
  return (
      <>
           <Header />
                <Searchbar />
                <PostPage />
                <Profilebar />
      </>
  )
}

export default Detailedpost
