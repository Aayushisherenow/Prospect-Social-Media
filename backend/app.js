import cors from "cors";
import cookieParser from "cookie-parser";
import { DB_NAME } from "./constants.js";
import express from "express"



import {app ,server} from "./socket/socket.js"
app.use(
  cors({
    origin: "http://localhost:5678", // allow frontend origin
    credentials: true, // if using cookies or auth headers
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));





//message routes
import messageRoutes from "./routes/message.routes.js";
app.use("/api/v1/messages", messageRoutes);


//routes import
import userRoutes from "./routes/user.routes.js";
app.use('/api/v1/users', userRoutes);



//other routes
import otherRoutes from "./routes/other.routes.js";
app.use("/api/v1/others", otherRoutes);


//posts routes
import postRoutes from "./routes/post.routes.js";
app.use("/api/v1/posts", postRoutes);






export { app, server };