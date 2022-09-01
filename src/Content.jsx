import React, { useState, useEffect, useRef } from 'react';
import './Content.css';

let translateY = 0;
const Content = () => {
  const scroller = useRef(null);
  const [chats, setChats] = useState([]);
  
  const getMessages = () => {
    return Array.from({ length: 100 }).map((_, index) => `chat ${index}`);
  };
  
  useEffect(() => {
    setChats(getMessages());
  }, []);
  
  const scrollY = (value) => {
    if (value === '100%') {
      scroller.current.style.transform = `translate3d(0, 100%, 0)`;
    } else {
  
      scroller.current.style.transform = `translate3d(0, ${value}px, 0)`;
    }
  };
  
  const handleOnWheel = (e) => {
    translateY += e.deltaY;
    scrollY(translateY);
  };
  
  return (
    <div onWheel={handleOnWheel}>
      <button onClick={() => scrollY('100%')}>click</button>
    <ul className={'content'} ref={scroller}>
      scroll content
      {chats.map((chat, i) => <li key={`chat-${i}`}>{chat}</li>)}
    </ul>
    </div>
  );
};

export default Content;
