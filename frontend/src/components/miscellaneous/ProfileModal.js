import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Button, Image, Text } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
    {
    children?<span onClick={onOpen}>{children}</span>:(
        <IconButton
        display={"flex"}
        icon={<ViewIcon/>}
        onClick={onOpen}/>
        )}
    <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height={"410px"}>
          <ModalHeader
          fontSize={"40px"}
          fontFamily={"work sans"}
          display={"flex"}
          justifyContent={"center"}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={"flex"}
          flexDir={"column"}
          alignItems={'center'}
          justifyContent={"space-between"}
          >
            <Image
            borderRadius={'full'}
            boxSize={"150px"}
            src={user.pic}
            alt={user.name}
            />
            <Text
            fontFamily={"work sans"}
            fontSize={{base:"30px", md:"28px"}}
            >
                Email : {user.email}
            </Text>

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='green' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  )
}

export default ProfileModal
