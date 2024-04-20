import React, { useEffect } from 'react';
import { Container, Box, Text, Tabs, TabList, TabPanels, Tab, TabPanel} from "@chakra-ui/react";
import Login from "../components/Authentication/Login"
import Signup  from '../components/Authentication/Signup';
import { useHistory } from "react-router-dom";


const Homepage = () => {
  const history = useHistory()
  useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        

        if(!userInfo)
        {
            history.push("/chats")
        }
      
    }, [history]);

  return (
    <Container maxW="xl" centerContent>
        
      <Box d = "flex"
      justifyContent="center"
      p = {3} 
      bg = "beige"
      width= "100%"
      m = "40px 0 15px 0"
      borderRadius="lg"
      borderWidth="1px"
      >
      
        <Text textAlign="center" fontSize="5xl" fontFamily="work sans">Vartalaap</Text>
      </Box>
      <Box   p = {3} bg = "beige"  width= "100%" borderWidth="1px" borderRadius="lg">
      
      <Tabs variant='soft-rounded' colorScheme='green'>
        <TabList mb = "1em">
          <Tab width="50%">Login</Tab>
          <Tab width="50%">Sign Up</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Login/>
          </TabPanel>
          <TabPanel>
            <Signup/>
          </TabPanel>
        </TabPanels>
      </Tabs>
     

      </Box >

    </Container>
  );
};

export default Homepage;