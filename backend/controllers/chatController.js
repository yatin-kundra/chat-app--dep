// import { chats } from "../data/data";
import AsyncHandler from "express-async-handler"
import User from "../models/userModel.js";
import Chat from '../models/chatmodels.js';


// to create or get one on one chat for a particular user 



export const accessChat = AsyncHandler(async(req, res) => {
        // current user send us the user id with which he/she wants to creat the chat 

  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });




      if (isChat.length > 0) {
    res.send(isChat[0]);        // if chat exist we are going to send the chat 
  } else {
    // otherwise we are going to create the chat
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

            try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});





// to fetch all the chats for the particular logged in user

export const fetchChat = AsyncHandler(async(req,res) => {
    try {
        // we are finding all the users that have give userid , 
        // basically we are querying form all the chats

        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")

        .sort({updatedAt:-1})
        .then(async(result)=>{
            result = await User.populate(result, {
        path:"latestMessage.sender",
        select:"name pic message",
    });

    res.status(200).send(result)
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);        
    }
});


// to create a new group-chat

export const crateGroupChats = AsyncHandler(async(req, res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Please Fill All the Fields"
        })
    }

    var users = JSON.parse(req.body.users)

    if(users.length <2){
        return res
        .status(400)
        .send({message:"More than 2 users are required to form a group chat"})
    }

    users.push(req.user)    // adding the current(logged in) user 


    try {

        // creating the group chat 

        const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
        });


        // fetching this group chat from the DB and send it to the user 
        const fullGroupChat = await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat);    // here we are siding the json file
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

});


// to rename group chat 

export const renameGroup = AsyncHandler(async(req, res) => {
    const {chatId, chatName}  = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName,
        },
        {
            new:true,        // if this is false it will return the old name of group and update will not happen
        }
    )
    .populate("users","-password")      // it know we have to populate from the User model because we refereance it in side the chat model, (go see chat model)
    .populate("groupAdmin","-password")

    if(!updatedChat)
    {
        throw new Error("Chat Not Found")
    }else {
        res.json(updatedChat)
    }
});


// to add a new member  to groupChat

export const addToGroup = AsyncHandler(async(req, res) => {
    const {chatId, userId} = req.body;

    const addedUser = await Chat.findByIdAndUpdate(
        chatId,
        {
        $push : {users:userId},
        },
        {
            new : true,
        }
    )

    if(!addedUser)
    {
        throw new Error("Users Not Found")
    }else {
        res.json(addedUser)
    }

   });


   export const removeFromGroup = AsyncHandler(async(req, res) => {
    const {chatId, userId} = req.body;

    const removedUser = await Chat.findByIdAndUpdate(
        chatId,
        {
        $pull : {users:userId},
        },
        {
            new : true,
        }
    )

    if(!removedUser)
    {
        throw new Error("Users Not Found")
    }else {
        res.json(removedUser)
    }
   })
