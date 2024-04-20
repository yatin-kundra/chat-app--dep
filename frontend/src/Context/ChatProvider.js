import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const chatContext = createContext();



const ChatProvider = ({ children }) => {

    const [user, setuser] = useState()
    const history = useHistory()
    const [selectedChat, setselectedChat] = useState()
    const [chats, setchats] = useState()
    const [notification, setNotification] = useState([]);

    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setuser(userInfo)

        if(!userInfo)
        {
            history.push("/")
        }
      
    }, [history]);
    
    
    return (
        
        <chatContext.Provider value={{user,setuser,selectedChat, setselectedChat,chats, setchats, notification, setNotification}}>
            {children}
        </chatContext.Provider>
        
    );
};


export const ChatState = () => {

    return useContext(chatContext);
}




export default ChatProvider;