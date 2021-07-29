import { Avatar, IconButton } from '@material-ui/core';
import React, {useState} from 'react'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';
import '../CSS/chat.css';
import axios from '../axios';

const Chat = ({messages}) => {

    const [input, setInput] = useState("");

    const sendMessage = async (e) =>{
        e.preventDefault();

        await axios.post('/messages/new', {
            message:input,
            name: "Zubair",
            timestamp: "Time is now...",
            recieved: true
        })

        setInput("");
    }

    return (
        <div className="chat">
            <div className="chat_header">
                <Avatar/>
                <div className="chat_headerInfo">
                    <h3>Room name</h3>
                    <p>Last seen at...</p>
                </div>

                <div className="chat_headerRight">
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>

                    <IconButton>
                        <SearchOutlinedIcon/>
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </div>
            </div>

            <div className="chat_body">
                {messages.length === 0 ? 
                    <p style={{textAlign:"center", alignItems:"center"}}>Start Your chat here</p> 
                        :
                    messages.map((message)=>(
                        <p className={`chat_message ${message.recieved && "chat_reciever"}`}>
                            <span className="chat_name">{message.name} </span>
                            {message.message}
                            <span className="chat_timestamp"> {new Date().toUTCString()}</span>
                        </p>
                    ))
                }
                
            </div>

            <div className="chat_footer">
                <InsertEmoticonIcon/>
                <form >
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" type="text"/>
                    <button onClick={sendMessage} type="submit"><SendIcon/></button>
                </form>
                <MicIcon/>
            </div>
        </div>
    )
}

export default Chat
