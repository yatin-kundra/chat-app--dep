import React, { useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Center, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, NotAllowedIcon } from '@chakra-ui/icons';
import {getsender, getsenderFull} from "../config/chatLogics"
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./styles.css"
import ScrollableChat from './ScrollableChat';
import  io from "socket.io-client";

import Lottie from "lottie-react"

import * as animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:11225";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setfetchAgain}) => {

    const [messages, setmessages] = useState([])
    const [loading, setloading] = useState(false)
    const [newMessage, setnewMessage] = useState("")
    const [socketConnected, setsocketConnected] = useState(false)
    const [typing, settyping] = useState(false)
    const [isTyping, setisTyping] = useState(false)
    const toast = useToast()
    
  


    const { user, selectedChat, setselectedChat, notification, setNotification } = ChatState();



    const fetchMessages = async() => {
        if(!selectedChat) return;

        try {
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type":"application/json",
            },
        };

        setloading(true);
        const {data} = await axios.get(`api/messages/${selectedChat._id}`, config);
        
        console.log("=-==-=-=-=-=-==-=-=")
        console.log(data)
        console.log("=-==-=-=-=-=-==-=-=")
        setmessages(data)
        setloading(false)

        socket.emit('join chat', selectedChat._id)

        } catch (error) {
             toast({
            title: "Error Occurred",
            description: "Failed to load the message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            });
        }
    };

        useEffect(() => {
        socket = io(ENDPOINT);
       socket.emit('setup', user)
       socket.on("connected", () => {
        setsocketConnected(true)
       })
       socket.on("typing", () => {setisTyping(true)})
       socket.on("stop typing", () => {setisTyping(false)})
    }, [])

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) 
            {
                // give notification
                if(!notification.includes(newMessageRecieved))
                {
                    setNotification([newMessageRecieved, ...notification]);
                    setfetchAgain(!fetchAgain)
                }
            }else
            {
                setmessages([...messages, newMessageRecieved])
            }
        })
    })


    const sendMessage = async(event) => {

        if(event.key === "Enter" && newMessage)
        {
            socket.emit("stop typing", selectedChat._id)
            try {
                
                const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type":"application/json",
            },
        };

        setnewMessage("")

        const {data} = await axios.post('api/messages/', {
            content:newMessage,
            chatId:selectedChat._id,
        }, config)

        console.log("----------")
        console.log(data)
        console.log("----------")

        socket.emit("new message", data)

        setmessages([...messages,data]);

            } catch (error) {
                toast({
            title: "Error Occurred",
            description: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
            }
        }
    }



    

    const typingHandler = (e) => {
        setnewMessage(e.target.value);

        // typing indicator logic
        if(!socketConnected) return;

        if(!typing){
            settyping(true)
            socket.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;

        setTimeout(() => {
            var timenow = new Date().getTime()
            var timediff = timenow - lastTypingTime

            if(timediff >= timerLength && typing)
            {
                socket.emit('stop typing', selectedChat._id)
                settyping(false)
            }
        }, timerLength )
    }

    return (
        <>
            {selectedChat  ? (
                <>
                    <Text
                    fontSize={{base:"28px" , md: "30px"}}
                    pb={3}
                    px={2}
                    w={"100%"}
                    fontFamily={"work sans"}
                    display={"flex"}
                    justifyContent={{base:"space-between"}}
                    alignItems={"center"}
                    >
                        <IconButton
                        display={{base:'flex' , md:"none"}}
                        icon={<ArrowBackIcon/>}
                        onClick={() => setselectedChat("")}
                        />
                        { 
                            !selectedChat.isGroupChat ? (
                                <>

                                    {getsender(user, selectedChat.users)} 
                                    <ProfileModal  user = {getsenderFull(user, selectedChat.users)}/>
                                </>
                            ) : (
                                <>
                                   {selectedChat.chatName.toUpperCase()} 
                                    <UpdateGroupChatModal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} fetchMessages = {fetchMessages} />

                                </>
                            )
                        }
                    </Text>

                    <Box
            d="flex"
            h="88%"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            borderRadius="lg"
            overflow="hidden"
            boxSizing="border-box"
            position="relative"
          >
            {loading ? (
                <div className='spinner'>
                <Spinner
                    thickness='4px'
                    _hover={{ transform: 'scale(1.2)' }}
                                transition="transform 0.3s ease-in-out"
                    emptyColor='green.200'
                    color='blue.500'
                    mt={"25%"}
                    ml={"45%"}
                    size={'xl'}
                    />
                    </div>
            ) : (
              <div className="messages" style={{height:'85%'}}>
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              w="95%"
              my={3}
              position="absolute"
              bottom="0"
            >
              {isTyping ? (
  <div style={{ display: 'flex' }}>
                <Lottie className='lottie' autoplay={true} loop={true} animationData={animationData} />
  </div>
) : (
  <></>
)}

              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
                </>
            ) : (
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    height={'100%'}
                >
                    <Text fontFamily={'work sans'} fontSize={'3xl'} pb={3}>
                        Click on a User to Start Chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
