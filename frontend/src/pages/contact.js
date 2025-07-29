import React from 'react'
import Header from '../components/header'
import Contactlayout from '../layouts/contactlayout';
import Searchbar from '../components/searchbar';

import { useUserContext } from "../context/userContext.js";
import Profilebar from "../components/Profile/Profilebar.js";


const Contact = () => {

  return (
    <>
      <Header />
      <Searchbar />
      <Contactlayout />
      <Profilebar/>
    </>
  );
}

export default Contact