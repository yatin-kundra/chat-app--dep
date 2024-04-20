import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
// import GroupChatModal from './GroupChatModal'
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setfetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, selectedChat, setselectedChat } = ChatState();

    const [groupChatName, setgroupChatName] = useState()
    const [search, setsearch] = useState("")
    const [searchResulsts, setsearchResulsts] = useState([])
    const [loading, setloading] = useState(false)
    const [RenameLoading, setRenameLoading] = useState(false)
    
    const toast = useToast()

      const handelRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

        console.log("##############")

      
        const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );


        console.log("##############")
        console.log(data)

      user1._id === user._id ? setselectedChat() : setselectedChat(data);
      setfetchAgain(!fetchAgain);
      fetchMessages()
      setloading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
    setgroupChatName("");
  };

    const handleAddUser = async(user1) => {
        if(selectedChat.users.find((u) => user1._id === user1))
        {
            toast({
            title: "User Already in the Group",
            status: "error",
            duration: 5000,
            isClosable: true,
            position:"bottom"
            });

            return;
        }

        if(selectedChat.groupAdmin._id !== user._id)
        {
            toast({
            title: "Only admins can add Users",
            status: "error",
            duration: 5000,
            isClosable: true,
            position:'bottom'
            });

            return;
        }

        try {

            setloading(true)

            const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        };

        const {data} = await axios.put("api/chat/groupadd", {
            chatId: selectedChat._id,

            userId: user1._id,
        }, config);

        setselectedChat(data)
        setfetchAgain(!fetchAgain)
        setloading(false)
        

            
        } catch (error) {
            toast({
            title: "Something went wrong!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position:'bottom'
            });
        }
    }


  const handleRename = async () => {
    if (!groupChatName) {
        return;
    }

    try {
        setRenameLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
        };

        const response = await axios.put(`/api/chat/rename`, {
            chatId: selectedChat._id,
            chatName: groupChatName,
        }, config);

        console.log(response.data)
        console.log("==============")
        console.log(response)

        setselectedChat(response.data);
        console.log("after setting the selected chat ")
        setfetchAgain(!fetchAgain);
        setRenameLoading(false);

        toast({
            title: "Group Name Changed successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            });

    } catch (error) {
        console.error("Error occurred while renaming chat:", error);
        toast({
            title: "Error Occurred",
            description: "Something went wrong",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setRenameLoading(false);
    }

    // Reset groupChatName state
    setgroupChatName("");
};



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
            setsearchResulsts(data)

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
    


  return (
    <>
   <IconButton disabled="flex" icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontFamily={"work sans"}
          fontSize={"35"}
          display={"flex"}
          justifyContent={'center'}
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
            display={"flex"}
            pb={3}
            width={"100%"}
            flexWrap={"wrap"}
            >
                {selectedChat.users.map(u => (
                    <UserBadgeItem 
                    key={user._id}
                    user = {u}
                    handleFunction={() => {handelRemove(u)}}
                    />
                ))}
            </Box>

            
            <FormControl 
            display="flex"
            >
            <Input 
            placeholder='Change Chat Name'
            mb={3}
            value={groupChatName}
            onChange={(e) => setgroupChatName(e.target.value)}
            type='email' />

            <Button
            variant={"solid"}
            colorScheme='teal'
            ml={1}
            isLoading = {RenameLoading}
            onClick={handleRename}
            >


                Update
            </Button>
            </FormControl>

            <FormControl >
                <Input
                placeholder='Add Users eg: Jatin, Yatin, Dev    '
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                />
            </FormControl>

                {loading ? (    
                    <Spinner size={"lg"}/>
                ): (
                    searchResulsts?.map((u) => (
                        <UserListItem key={u._id} user={u} handleFunction={() => handleAddUser(u)} />
                    ))
                    
                )}
            
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handelRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      </>
  )
}

export default UpdateGroupChatModal
