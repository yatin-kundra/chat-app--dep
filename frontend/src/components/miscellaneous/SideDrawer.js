import React, { useState } from 'react'
import {Box, Tooltip, Text, Menu, MenuButton,MenuList, MenuItem, MenuDivider, Drawer, Input, useToast, Spinner} from "@chakra-ui/react";
import {useDisclosure} from '@chakra-ui/hooks'
import {Button} from "@chakra-ui/button"
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import {Avatar} from "@chakra-ui/avatar"
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from "react-router-dom";
import {DrawerBody,DrawerContent,DrawerHeader,DrawerOverlay,} from "@chakra-ui/modal";
import { faAws } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getsender } from '../../config/chatLogics';
import NotificationBadge, { Effect } from "react-notification-badge";




const SideDrawer = () => {

    const [search, setsearch] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [loading, setloading] = useState(false)
    const [loaidngChat, setloaidngChat] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const {user, setselectedChat, chats, setchats, notification, setNotification } = ChatState()
    // console.log("is someting happending")
    const history = useHistory();
    // console.log(history);
    const toast = useToast()

    const handleSearch = async() => {
        if(!search)
        {
            toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
        }

        try {
            setloading(true)

            const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

          const { data } = await axios.get(`api/user?search=${search}`, config);
          console.log("API Response:", data); // Log the response data
          setloading(false)
          setsearchResult(data);
        } catch (error) {
            toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
            
        }
    };

    const accessChat = async(userId) => {

      try {
        setloading(true)
        const config = {
        headers: {
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`
        },
      };

      const {data} = await axios.post("/api/chat",{userId}, config);
      if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);
      setloading(false)
      setselectedChat(data)
      onClose();
      

      } catch (error) {
        toast({
        title: "Error Fetching the Chats",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
        
      }
    }

  const logoutHandler = () => {
    // console.log("logout user is triggred");
    history.push("/");
    // localStorage.removeItem("userInfo");         // do not uncomment creating problems
                                

  };   


  return (
    <>
    <Box 
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="whitesmoke"
    w="100%"
    p = "5px 10px 5px 10px"
    >
        <Tooltip label = "Search users to chat" hasArrow placement = "bottom-end">
            <Button variant="ghost" onClick={onOpen}>
                <i class="fa-solid fa-magnifying-glass"></i>
                <Text d={{base:"none", md:'flex'}} px = "4"
                >
                    Search User
                </Text>
            </Button>
        </Tooltip>
        <Text fontSize={"2x1"} fontFamily={"work sans"} fontWeight={"bold"}>Vartalaap</Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                  <NotificationBadge
                  count ={notification.length}
                  effect = {Effect.SCALE}
                   />
                    <BellIcon/>
                </MenuButton>
                <MenuList pl={3}>
                  {!notification.length && "No new messages"}
                  {notification.map(notif => (
                    <MenuItem key={notif._id} onClick={() => {
                      setselectedChat(notif.chat)
                      setNotification(notification.filter((n) => n !== notif))
                    }}>
                      {notif.chat.isGroupChat? `New Message in ${notif.chat.chatName}`:`New Message from ${getsender(user, notif.chat.users)}`}
                    </MenuItem>
                  ))}
                </MenuList>

            </Menu>
            <Menu>
            <MenuButton as={Button} bg="whitesmoke" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
    <DrawerOverlay />
    <DrawerContent>
        <DrawerHeader borderBottomWidth={"1px"}>
            Search Users
        </DrawerHeader>
        <DrawerBody>
        <Box display={"flex"} pb={2}>
            <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
            <Button onClick={handleSearch} >Go</Button>
        </Box>
        {loading ? (
              <ChatLoading />
            ) : (
              console.log("Search Result:", searchResult),
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loaidngChat && <Spinner ml="auto" d="flex" />}
    </DrawerBody>
    </DrawerContent>
    </Drawer>
    </>
  )
}

export default SideDrawer
