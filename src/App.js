import styled from 'styled-components';
import React, {useState, useEffect, useRef }  from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
const Row= styled.div`

@media(max-width: 997px){
  width:100%;
  display:block;
  transform:scale(.8);
  .col2{
    margin-top: -2em;
  }
  #reset{
    margin:.5em;
    background-color:darkgray;
  }
  #start_stop{
    background-color:#5dbb63
  }
  .buttons{
    margin-top:1em;
  }
}

@media(min-width: 997px){
  width:70%;
  display:block;
  transform:scale(.6);
  }
  .col2{
    margin-top: -2em;
  }
  #reset{
    margin:.5em;
    background-color:darkgray;
  }
  #start_stop{
    background-color:#5dbb63;
  }
  
  .buttons{
    margin-top:1em;
  }

.timer{
  margin-left: auto;
  margin-right: auto;
  margin-top: -3em;
  border:3px solid;
  border-radius: 15px;
  max-width:200px;
}
h3{
  font-size: 2em;
  margin:0;
}
.time{
  font-size: 3em;
  margin:0;
  font-weight:bold;
}
`
const Columnn= styled.div`
@media(max-width: 997px){
  .article{
    display:flex;
    width:100%;
    justify-content:space-evenly;
  }
  button{
    border-radius: 5px;
    height:3em;
    border:0;
    padding: 0.5em;
    font-size:1.5em ;
  }
  #break-decrement, #session-decrement{
    background-color: #990f02;
    color:white;
  }
  #break-increment, #session-increment{
    background-color:#5dbb63 ;
    color:white;
  }
  #break-length{
    font-size:4em;
    margin-top: -.1em;
    margin-left:.5em; 
    margin-right:.5em; 
  }
  #session-length{
    font-size:4em;
    margin-top: -.1em;
    margin-left:.5em; 
    margin-right:.5em; 
  }
  #session-label, #break-label{
    font-size:2em;
    font-weight: 500;
  }
  
}

@media(min-width: 997px){
  .article{
    display:flex;
    width:100%;
    justify-content:space-evenly;
  }
  button{
    border-radius: 5px;
    height:3em;
    border:0;
    padding: 0.5em;
    font-size:1.5em ;
  }
  #break-decrement, #session-decrement{
    background-color: #990f02;
    color:white;
  }
  #break-increment, #session-increment{
    background-color:#5dbb63 ;
    color:white;
  }
  #break-length{
    font-size:4em;
    margin-top: -.1em;
    margin-left:.5em; 
    margin-right:.5em; 
  }
  #session-length{
    font-size:4em;
    margin-top: -.1em;
    margin-left:.5em; 
    margin-right:.5em; 
  }
  #session-label, #break-label{
    font-size:2em;
    font-weight: 500;
  }
  
}
`

function App() {
  const [break_counter, setBreak]=useState(5);
  const [session_counter, setSession]=useState(25);
  const [timer, setTimer] = useState(session_counter * 60); // New timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false); // New state to track timer running
  const [timerLabel, setTimerLabel] = useState("Session"); // Initialize timerLabel state

  const audioRef = useRef(null);
  function decrement_break(){
    if(break_counter>1){
      setBreak(break_counter - 1)
    }
    
  }
  function increment_break(){
    if(break_counter < 60){
      setBreak(break_counter + 1)
    }
  }

  function decrement_session() {
    setSession((prevSession) => {
      const newSession = Math.max(prevSession - 1, 1); // Ensure the newSession is at least 1
      setTimer(newSession * 60); // Update timer based on the new session_counter
      return newSession;
    });
  }
  
  function increment_session() {
    setSession((prevSession) => {
      const newSession = Math.min(prevSession + 1, 60); // Ensure newSession is at most 60
      setTimer(newSession * 60); // Update timer based on the new session_counter
      return newSession;
    });
  }
  

  function startStopTimer() {
    setIsTimerRunning(!isTimerRunning);
  
    // Update the timer state based on session_counter only when starting the timer
    if (!isTimerRunning) {
      setTimer((prevTimer) => {
        // If the timer is already running, do not reset it
        if (prevTimer > 0) {
          return prevTimer;
        } else {
          // Timer is at 0, reset based on your requirements
          // For now, let's reset to the session_counter value
          return session_counter * 60;
        }
      });
    }
  }
  

  useEffect(() => {
    let intervalId;

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            // Decrease the timer if it's greater than 0
            return prevTimer - 1;
          } else {
            audioRef.current.play();
            // Timer reached 0
            if (timerLabel === "Session") {
              // Switch to Break and reset the timer to break length
              setTimer(break_counter * 60);
              setTimerLabel("Break");
              audioRef.current.play();
            } else {
              // Switch to Session and reset the timer to session length
              setTimer(session_counter * 60);
              setTimerLabel("Session");
              audioRef.current.play();
            }
  
            return prevTimer; // Returning prevTimer here is unnecessary
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning, session_counter, break_counter, timerLabel]);
  



  // Function to format seconds into mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  function resetTimer() {
    setIsTimerRunning(false);
    setSession(25);
    setBreak(5);
    setTimerLabel("Session");
    setTimer(25 * 60); 
  audioRef.current.pause();
  audioRef.current.currentTime = 0;
  }
  return (
    <div className="App">
      <Row>
        <Columnn>
        <p id='break-label'>Break Length</p>
        <div className='article'>
        <button id='break-decrement' onClick={decrement_break}  disabled={isTimerRunning}>Decrease</button>
      <p id='break-length'>{break_counter}</p>
      <button id='break-increment' onClick={increment_break}  disabled={isTimerRunning}>Increase</button>
        </div>
      </Columnn>
      <Columnn className='col2'>
      <p id='session-label'>Session Length</p>
      <div className='article'>
      <button id='session-decrement' onClick={decrement_session}  disabled={isTimerRunning}>Descrease</button>
      <p id='session-length'>{session_counter}</p>
      <button id='session-increment' onClick={increment_session}  disabled={isTimerRunning}>Increase</button>
      </div>
      </Columnn>
      <Columnn>
      <div className='timer'>
      <h3 id='timer-label'>{timerLabel}</h3>
      <p className='time' id='time-left'>{formatTime(timer)}</p>
      </div>
      </Columnn>
      <Columnn>
      <div className='buttons'>
      <button id='start_stop' onClick={startStopTimer}>
        {isTimerRunning ? 'Stop' : 'Start'}
      </button>
      <button id='reset' onClick={resetTimer}>Reset</button>
      </div>
      </Columnn>
      <audio id="beep" ref={audioRef}>
        <source src="beep.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      </Row>
      
      
    </div>
  );
}

export default App;
