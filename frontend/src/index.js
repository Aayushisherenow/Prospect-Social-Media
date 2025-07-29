import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Contact from "./pages/contact";
import Home from "./pages/home";
import About from "./pages/about";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Messages from "./pages/messages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import { UserProvider } from "./context/userContext.js";
import NotFoundPage from "./pages/notfound";
import ProtectedRoute from "./components/protectedroute.js";
import AllPosts from "./components/allposts.js";
import PostPage from "./components/posts/postpage.js";
import Detailedpost from "./pages/detailedpost.js";
import ViewProfileUser from "./pages/viewprofileuser.js";
import UpdatePostForm from "./components/updatepost.js";  
import UpdateProfileForm from "./components/updateprofile.js";
import ChatPage from "./pages/chatpage.js";
import SearchResults from "./pages/searchresults.js";


const root = ReactDOM.createRoot(document.getElementById("root"));

const allRoutes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/about",
    element: (
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    ),
  },
  {
    path: "/contact",
    element: (
      <ProtectedRoute>
        <Contact />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update-post/:postId",
    element: (
      <ProtectedRoute>
        <UpdatePostForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/update-profile/:userId",
    element: (
      <ProtectedRoute>
        <UpdateProfileForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:userId1/:userId2",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/directMessage",
    element: (
      <ProtectedRoute>
        <Messages />
      </ProtectedRoute>
    ),
  },
  {
    path: "/viewProfile/:userId",
    element: (
      <ProtectedRoute>
        <ViewProfileUser />
      </ProtectedRoute>
    ),
  },
  {
    path: "/search/:query",
    element: (
      <ProtectedRoute>
        <SearchResults />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: <Signup />, // Public
  },
  {
    path: "/login",
    element: <Login />, // Public
  },
  {
    path: "*",
    element: <NotFoundPage />, // Public
  },
  {
    path: "/post/:postId",
    element: (
      <ProtectedRoute>
        <Detailedpost />
      </ProtectedRoute>
    ),
  },
]);
root.render(
  <React.StrictMode>
    <UserProvider>
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />

      <RouterProvider router={allRoutes} />
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
