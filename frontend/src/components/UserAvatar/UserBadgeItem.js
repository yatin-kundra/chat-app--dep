import { CloseIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Badge
    px={2}
    py={1}
    borderRadius={"lg"}
    m={1}
    mb={2}
    variant = "subtle"
    fontSize={12}
    colorScheme = "green"
    cursor={'pointer'}
    onClick={handleFunction}
    >
        {user.name }
        
        <CloseIcon p={1.1} />
    </Badge>
  )
}

export default UserBadgeItem
