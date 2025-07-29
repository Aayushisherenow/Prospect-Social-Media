import React from 'react'
import Header from '../components/header'
import Messagesheader from '../components/messages/messagesheader';
import MessagePerson from "../components/messages/messageperson";
import MessagePage from "../components/messages/messages";

import Profilebar from "../components/Profile/Profilebar.js";

import { useUserContext } from '../context/userContext.js';
import Chatusers from '../components/chatusers.js';

const Messages = () => {

 
  
  return (
    <div>
      <Header />
      {/* <Messagesheader /> */}
      {/* <Profilebar /> */}
      {/* <MessagePerson/> */}
      {/* <MessagePage/> */}
      <Chatusers />
      <Profilebar/>
    </div>
  );
}

export default Messages
