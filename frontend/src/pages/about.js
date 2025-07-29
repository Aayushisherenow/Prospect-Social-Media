import React from 'react';
import Header from '../components/header';
import Searchbar from '../components/searchbar';
import { useUserContext } from '../context/userContext.js';
import Aboutlayout from '../layouts/aboutlayout';
import Profilebar from "../components/Profile/Profilebar.js";


const About = () => {


  
  return (
    <>
      <Header />
      <Searchbar/>
      <Aboutlayout />
      <Profilebar/>



    

    </>
  );
}

export default About
