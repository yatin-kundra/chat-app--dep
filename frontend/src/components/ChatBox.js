import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import SingleChat from './SingleChat'


const ChatBox = ({fetchAgain, setfetchAgain}) => {

  const {selectedChat} = ChatState()

  console.log('inside chatBox , this is selcted chat')
  console.log(selectedChat)

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="whitesmoke"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain = {fetchAgain} setfetchAgain = {setfetchAgain} />
    </Box>
  )
}

export default ChatBox
