// chatnamw 
// isgroupchat
// useres
// latest message 
// group admin 


import mongoose, { model }  from "mongoose";

const chatModel = mongoose.Schema(
    {
        chatName:{type:String, trim: true},
        isGroupChat:{type:Boolean,default:false},
        users:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        }],
        latestMessage:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
        },
        groupAdmin:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    },

    {timestamps: true }


);

const Chat = mongoose.model("Chat",chatModel);
export default Chat;