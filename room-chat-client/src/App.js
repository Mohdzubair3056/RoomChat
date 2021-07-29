import './App.css';
import Chat from './Components/Chat';
import Sidebar from './Components/Sidebar';
import {useState,useEffect} from 'react';
import Pusher from 'pusher-js';
import axios from './axios.js';
import { Switch } from 'react-router-dom';

function App() {

  const [messages, setMessages] = useState([]);

  useEffect (()=>{
    axios.get('/messages/sync').then(response => {
      setMessages(response.data);
    })
  }, [])

  useEffect(() => {
   const pusher = new Pusher('57e7dbbda2fc579181de', {
      cluster: 'eu'
    });

   const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage)=> {
      setMessages([...messages, newMessage]);
    });

    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    };

  }, [messages]);

 

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar/>
        <Switch>
          <Chat messages={messages}/>
        </Switch>
      </div>
    </div>
  );
}

export default App;
