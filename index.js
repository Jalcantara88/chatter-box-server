//import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import UsernameField from './UsernameField'
import {
  Button
} from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.css'
import {EMOJIS} from '../public/emojis'

var socket = io();
            var el;

            socket.on('time', function(timeString) {
            console.log("time: " + timeString);
            });

function EmojiButtons(props) {
  let span = document.createElement('col');

  const emojis = props.emojiArray.map(item => {
    return(
      <div key={item.code}>
      <Button 
        className="border p-1 mx-1" 
        style={{backgroundColor: 'transparent'}}
        onClick={() => {
          props.setMessage(props.message + item.code);
        }}
      >
        {span.innerHTML = item.code}
        
      </Button>
      </div>
    );
  });

  return(
    <div className="row justify-content-center">
    {emojis}
    </div>
  );
}

export default function Home() {
  //create hook states
  
  //socket: holds socket value - instantiate to null value
  const [socket, setSocket] = useState(null);
  
  //isUsernameConfirmed: holds bool to test if user is unique and usable - instantiate to false
  const [isUsernameConfirmed, setUsernameConfirmed] = useState(false);

  const [roomName, setRoomName] = useState("");

  //username: holds the username as a string - instantiate as empty string
  const [username, setUsername] = useState("");

  //message: holds current message being dealt with - instantiate to empty string
  const [message, setMessage] = useState("");

  //history: holds all objects submitted and echoed back from server - instantiate to empty array
  const [history, setHistory] = useState([
    //example object of what an object will hold
    /*
    {
      username: "John Doe",
      message: "message"
    }
    */
  ]);

  //arrow function that handles a new socket connect
  const connectSocket = () => {
    
    if(!socket) {
      //create new socket using socket.io

      const newSocket = io();
      
      //socket.io action types

      //confirm connection
      newSocket.on("connect", () => {
        //newSocket.emit("room", roomName);
        console.log("Chatter Box Connected");
      });

      //handles message submit taking the message object as an argument in the second parameter
      newSocket.on("message", (msg) => {
        //calls hook to spread current history array and append new message object
        setHistory((history) => [...history, msg])
      });

      //handles server disconnect by logging it to console
      newSocket.on("disconnect", () => {
        console.warn("WARNING: chat app disconnected");
      });

      setSocket(() => newSocket);
    }
  };

  const goToMessageBottom = () => {
    if(document.getElementById("messageList")) {
      document.getElementById("messageList").scrollTo({
        top: document.getElementById("messageList").scrollHeight,
        
        behavior: 'smooth'});
    }
    else {
      return
    }
  }

  useEffect(() => {
    connectSocket();
  }, []);
  

  // websocket code
  useEffect(() => {
    
    goToMessageBottom();
  }, [history]);

  //handle submit of message to be handled by action type taking the form event as an arguement
  const handleSubmit = (e) => {

    //prevent the page from reloading on submit
    e.preventDefault();
    
    //check to see if you have a socket to use to submit to server, if not alert and return
    if(!socket) {
      alert("Chatter Box not connected yet. Please try again.");
      return;
    }

    //prevent submitting empty object
    if(!message || !isUsernameConfirmed) {
      console.log("empty");
      return;
    }

    //submit message object passing in message and username as object
    socket.emit("message-submitted", { message, username });

    //empty message value for next value
    setMessage("");
  };

  //handle onchange for form submit - sets current message string to value of input box
  const handleChange = (e) => {
    setMessage(e.target.value);
    console.log(message);
    console.log(history);
  }

  //iterate through history array and display messages - destructure username and message elements
  const chatterBox = history.map(({ username, message }, i) => 
    (
      <div key={i} className="mb-3">
        <strong className=" pl-2 pr-1 py-1" style={{backgroundColor: "#a3d2ca", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px", color: "#5eaaa8"}}>{username}:</strong>
        <span className=" text-white pr-2 pl-1 py-1" style={{backgroundColor: " #5eaaa8", borderTopRightRadius: "10px", borderBottomRightRadius: "10px",}}> {message} </span>
      </div>
    )
  )

  if(isUsernameConfirmed) {
    return(
      <>
        <head>
          {/*title and favicon */}
          <title>ChatterBox.io</title>
          <link rel="icon" href="/favicon.ico" />
          <meta charSet="UTF-8"></meta>
        </head>
        <div className="container-fluid">
            <div className="row justify-content-center text-white" style={{ backgroundColor: "#ff8474"}}>
                  <p className="m-0"> Chatting as <strong>{username}</strong> </p>
            </div>
        </div>
        {/*display history*/}
        <div className="container" style={{marginTop: "15%" }}>
          <div className="row justify-content-center">
            
            <div className="col-10 col-md-8 col-lg-6 col-xl-4 rounded pb-2 px-0 pt-4" style={{backgroundColor: "#ffc996"}}>
              <div className="row-fluid">
                <div className="col bg-white border pt-3" id="messageList" style={{height: "200px", overflowY: "scroll"}}>
                  {chatterBox}
                  <div  id="messageBottom"></div>
                </div>
              </div>
              
              <div className="row pt-3">
              <form onSubmit={handleSubmit} onChange={() => {
                
              }} className=" mx-auto">
                  
                    <label htmlFor="message">
                      
                      <input  
                        type="text"
                        id="message"
                        name="message"
                        value={message}
                        //fires value change
                        onChange={handleChange}
                        placeholder={
                          //ternary operator to check if username is set yet, if not it asks user to do so
                          " Chat Here..."
                        }
                        //disables input until username is set
                        disabled={!isUsernameConfirmed}
                        className="align-middle"
                        style={{border: 0}}
                      />
                    </label>
                    <Button 
                      type="submit"  
                      disabled={!isUsernameConfirmed}
                      className="px-3 "
                      style={{padding: "1px",  backgroundColor: "#ff8474", border: 0, borderRadius: 0}}
                    >
                      Send
                    </Button>
                    
                  
                </form>
              </div>
              <div className="col-12 mx-auto">
                <EmojiButtons emojiArray={EMOJIS} setMessage={setMessage} message={message}/>

              </div>

              
            </div>
          </div>
          
        </div>
        <footer className="text-center text-white" style={{bottom: "10%"}}>ChatterBox.io</footer>
      </>
    );
  }

  else {

    return(
      //html display for Chatter Box app
      <div>
        
        <Head>
          {/*title and favicon */}
          <title>ChatterBox.io</title>
          <link rel="icon" href="/favicon.ico" />
          <meta charSet="UTF-8"></meta>
        </Head>

        {/*username component passing in props */}
        <div style={{marginTop: "20%", backgroundColor: "#ff8474"}} className="pt-2">
          <UsernameField
            completed={isUsernameConfirmed}
            value={username}
            roomName={roomName}
            onChange={(value) => {setUsername(value); console.log(username);}}
            onRoomChange={(value) => {setRoomName(value); console.log(roomName);}}
            onSubmit={() => 
              {
                if(username === "") {
                  alert("please set a username to chat")
              }
              else {
                setUsernameConfirmed(true)
              }
            }}
          />
        </div>    
      
        <footer className="text-center text-white" style={{bottom: "10%", backgroundColor: "#ff8474"}}>ChatterBox.io</footer>

        <div className=" col-12 col-md-10 col-lg-6 rounded bg-white p-5 mx-auto mt-5">
          <h3 className="text-center text-dark">About This Project</h3>
          <p>This was a project built for a Mintbean Hackathon</p>
        </div>
      </div>
    );
  }
}

