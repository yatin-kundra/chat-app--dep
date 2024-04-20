import { Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, Box, ModalFooter, ModalHeader, ModalOverlay, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {useDisclosure} from '@chakra-ui/hooks'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'




const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupchatName, setgroupchatName] = useState()
    const [selectedUsers, setselectedUsers] = useState([])
    const [search, setsearch] = useState("")
    const [searchResults, setsearchResults] = useState([])
    const [loading, setloading] = useState()

    const toast = useToast()

    const {user, chats, setchats} = ChatState()


    const handleSearch = async(query) => {
        setsearch(query)
        if(!query)
        {
            return;
        }

        try {
            setloading(true);
            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.get(`/api/user?search=${search}`, config);
            // console.log(data)
            setloading(false)
            setsearchResults(data)

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

    }

    const handleSubmit = async () => {
    if (!groupchatName || !selectedUsers) {
        toast({
            title: "Please Fill all the Fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        return;
    }

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const { data } = await axios.post("/api/chat/group", {
                name: groupchatName,
                users: JSON.stringify(selectedUsers.map(u => u._id)),
            },
            config
        );

        console.log(data);

        setchats([data, ...chats]);
        console.log("setChats executed")
         onClose();
         console.log("onClosed() function past")

        // Show success toast
        toast({
      title: "New Group Chat Created!",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });

        // Reload the page
        window.location.reload();

    } catch (error) {
    //     toast({
    //     title: "Failed to Create the Chat!",
    //     description: error.response.data,
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   });

    }
}



    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)){
            toast({
        title: "User Already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
        }

        setselectedUsers([...selectedUsers, userToAdd])
    };

    const handleDelete = (delUser) => {
        setselectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    }




    
    return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize={"32px"}
          fontFamily={"work sans"}
          display={"flex"}
          justifyContent={"center"}
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          >
            <FormControl >
                <Input
                placeholder='Chat Name'
                mb={3}
                onChange={(e) => setgroupchatName(e.target.value)}
                />
            </FormControl>

            <FormControl >
                <Input
                placeholder='Add Users eg: Jatin, Yatin, Dev    '
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                />
            </FormControl>

                <Box display={'flex'} width={"100%"} flexWrap={"wrap"}>
                    {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
                </Box>
            {
                loading ? <div>loading</div> 
                : (searchResults?.slice(0,4).map(user => (
                    <UserListItem key = {user._id} user = {user} handleFunction={() => handleGroup(user)} />
                )))
            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green'  onClick={handleSubmit}>
              Create Chat
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
