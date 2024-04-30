import { Button, FormControl, FormLabel, Input, InputGroup, InputRightAddon, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, {useState, handleclick} from 'react'
import axios from "axios"
import {useHistory} from "react-router-dom"
const Sinup = () => {

    const [name, setName] = useState()
    const [show, setShow] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmpassword, setconfirmpassword] = useState()
    const [pic, setPic] = useState()
    const [loading, setLoading] = useState()
    const toast = useToast()
    const history = useHistory()

    const handleclick = () => setShow(!show)

    const postDetails =  (pics) => {
      setLoading(true);
      if(pics === undefined){
        toast({
          title: 'Please Select an Image.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        return;
      }
      if(pics.type === "image/jpeg" || pics.type === "image/png"){
        const data = new FormData();
        data.append("file",pics)
        data.append("upload_preset", "MERN-chat-app")
        data.append("cloud_name", "yatin");
        fetch("https://api.cloudinary.com/v1_1/yatin/image/upload", {
          method:"post",
          body:data,
        }).then((res) => res.json())
        .then(data => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false)
        })
      }else {
        toast({
          title: 'Please Select an Image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
        setLoading(false)
        return;
      }
    };

    const submitHandler =  async() => {
      setLoading(true)
      if(!name || !email || !password || !confirmpassword){
        toast({
          title: 'Please Fill all the Fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
        setLoading(false);
        return;
      }

      if(password !== confirmpassword)
      {
        toast({
          title: 'Password not matched!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
        return;
      }

      // if all this is fine we now will try to store user info in out DB
      try {
        const config = {
          headers:{
            "content-type":"application/json",
          },
        };

        const {data} = await axios.post("/api/user", {name, email, password, pic}, config)
        toast({
          title: 'Registration is successfull!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });

        localStorage.setItem("userInfo",JSON.stringify(data));
        setLoading(false)
        history.push("/chats")
      } catch (error) {
        toast({
          title: 'Error Occured!',
          status: 'warning',
          description:error.response.data.message,
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
        setLoading(false);
      }
    };


  return (<VStack spacing= "5px">
    <FormControl id = 'first-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder='Enter Your Name'
        onChange={(e) => setName(e.target.value) } />
    </FormControl>

    <FormControl id = 'email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter Your Email'
        onChange={(e) => setEmail(e.target.value) } />
    </FormControl>

    <FormControl id = 'password' isRequired>
        <FormLabel>Password</FormLabel>
          <InputGroup>
          <Input placeholder='Enter Your Password'
        type = {show?"text":"password"}
        onChange={(e) => setPassword(e.target.value) } />

        <InputRightElement width="4.5rem">
          <Button height="1.5rem" size="sm" onClick={handleclick}>
            {show?"Hide":"Show"}
          </Button>
        </InputRightElement>
          </InputGroup>
    </FormControl>

    <FormControl id = 'confirm-password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
          <Input placeholder='Confirm Password'
        type = {show?"text":"password"}
        onChange={(e) => setconfirmpassword(e.target.value) } />

        <InputRightElement width="4.5rem">
          <Button height="1.5rem" size="sm" onClick={handleclick}>
            {show?"Hide":"Show"}
          </Button>
        </InputRightElement>
          </InputGroup>
    </FormControl>

    <FormControl id = 'pic' >
        <FormLabel>Profile</FormLabel>
        <Input placeholder='Upload Your Profile'
        type = "file"
        p={1.5}
        accept='images/*'
        onChange={(e) => postDetails(e.target.files[0]) } />
    </FormControl>

    <Button colorScheme='green'
    width="100%"
    style={{marginTop:15}}
    onClick={submitHandler}
    isLoading = {loading}
    >
      Signup
    </Button>
  </VStack>)
}

export default Sinup
