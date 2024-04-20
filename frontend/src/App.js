import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import ChatProvider from './Context/ChatProvider';

function App() {
  return (
    
        <div className='App'> 
          <Route path="/" component={Homepage} exact />
          <Route path="/chats" component={Chatpage} />  
        </div>
      
  );
}

export default App;
