import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import ChatLoading from './ChatLoading';
import { AddIcon } from "@chakra-ui/icons";
import axios from 'axios'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import { getsender } from '../config/chatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';


const MyChats = ({fetchAgain}) => {

    const [loggedUser, setloggedUser] = useState()
    const {user, selectedChat, setselectedChat, chats, setchats} = ChatState()
    const toast = useToast()

    const fetchChats = async() => {

      try {
        
        const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };

      const {data} = await axios.get("/api/chat", config);
      console.log(data);
      console.log(" ---^--- this is chat data , inside fetch chats function")
      setchats(data)
      } catch (error) {
        toast({
        title: "Error Occured",
        description:"Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      }
    }

    useEffect(() => {

        setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
        console.log("before useeffect hooks in mychats.js")
        fetchChats();
        console.log("after useeffect hooks in mychats.js")

      
    }, [fetchAgain])
    


  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir={"column"}
    alignItems={"center"}
    p={3}
    bg={"whitesmoke"}
    w={{base:"100%" , md:"31%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >
      <Box
      pb={3}
      px={3}
      fontSize={{base:"28px", md:"30px"}}
      fontFamily={"work sans"}
      display={"flex"}
      w={"100%"}
      justifyContent={"space-between"}
      alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
        <Button
          display={"flex"}
          fontSize={{base:"17px", md:"10px", lg:"17px"}}
          rightIcon={<AddIcon/>}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
      
      <Box                      
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {
          chats ? (
            <Stack
            overflow={"scroll"}>
              {chats.map((chat) => (
                <Box
                onClick={() => setselectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                >
                  <Text>  
                    {!chat.isGroupChat ? (
                      getsender(loggedUser, chat.users)
                    ) : chat.chatName}
                  </Text>
                </Box>
              ))}

            </Stack>
          ) : (
            <ChatLoading/>
          )}
        

      </Box>

    </Box>
  )
}

export default MyChats
