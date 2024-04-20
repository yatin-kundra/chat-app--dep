import express from 'express';
import dotenv from "dotenv"
import { chats } from './data/data.js';
import connectDB from "./config/db.js"
import colors from "colors"
import userRoutes from "./Routers/userRoutes.js"
import chatRoutes from "./Routers/chatRoutes.js"
import messageRoutes from "./Routers/messageRoutes.js"
import {errorHandler, notFound} from "./middleware/errorMiddleware.js"
import path from 'path'
import cors from 'cors'; // Import cors

dotenv.config()
connectDB()

const app = express()

app.use(express.json());
app.use(cors()); // Add this line to enable CORS for all routes

// const port = process.env.PORT || 1235

app.use("/api/chat",chatRoutes);
app.use('/api/user',userRoutes);
app.use("/api/messages", messageRoutes);

// --------------------Deployment------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res)=>{
    res.send("API is running.");
});
}

// --------------------Deployment------------

// error handling -- if user go to some other page 
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 11225;

const server = app.listen(port, console.log(`server is on PORT ${port}`.yellow.bold));

console.log("hello")

import { Server } from "socket.io";
import exp from 'constants';
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on("connection", (socket) => {
  console.log("socket is connected")

 socket.on("setup", (userData) => {
            socket.join(userData._id)
            console.log(userData._id)
            socket.emit("connected")
        })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("user has joined the room" + room)
    })

    socket.on('typing', (room) => {
        socket.in(room).emit("typing")
    })

    socket.on('stop typing', (room) => {
        socket.in(room).emit("stop typing")
    })

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if(!chat.users) return console.log("chat.users not defiend")

        chat.users.forEach(user => {
            if(user._id === newMessageRecieved.sender._id)
                return
            
            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })

    socket.off('setup', () => {
            console.log("user dissconnected")
            socket.leave(userData._id)
    })
});
