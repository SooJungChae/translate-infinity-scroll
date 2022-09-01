import React, { useState, useEffect, useRef } from 'react';
import './Content.css';

let translateY = 0;

const Content = (props) => {
  const contentWrapper = useRef(null);
  const start = useRef(null);
  const end = useRef(null);
  const [chats, setChats] = useState([]);
  const [contentHeight, setContentHeight] = useState(0);
  
  const getMessages = () => {
    return Array.from({ length: 30 }).map((_, index) => `chat ${index}`);
  };
  
  useEffect(() => {
    setChats(getMessages());
  }, [])
  
  useEffect(() => {
    setContentHeight(contentWrapper.current.getBoundingClientRect().height);
  }, [chats]);
  
  useEffect(() => {
    const onIntersect = (entry, observer) => {
      const target = entry.target;
      const bounding = entry.boundingClientRect;
  
      console.log('intersect', target);
  
      if (target.id === 'contentWrapper') {
        setContentHeight(bounding.height);
      }
  
      if (target.id === 'start') {
        setChats((chats) => [...getMessages(), ...chats]);
      }
      
      if (target.id === 'end') {
        setChats((chats) => [...chats, ...getMessages()]);
      }
      
      // observer.disconnect(target);
    };
    
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        entry.isIntersecting && entry.intersectionRatio > 0 && onIntersect(entry, observer);
      })
    };
    
    const observer = new IntersectionObserver(callback)
    // observer.observe(props.viewScreenRef.current);
    observer.observe(contentWrapper.current);
    observer.observe(start.current);
    observer.observe(end.current);
  }, [props.viewScreenRef, contentWrapper, start, end]);
  
  const scrollUp = (value) => {
    if (translateY < -(contentHeight - 500)) return;
  
    translateY += value;
    contentWrapper.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
  }
  
  const scrollDown = (value) => {
    if (0 < translateY) return;
    
    translateY += value;
    contentWrapper.current.style.transform = `translate3d(0, ${translateY}px, 0)`;
  }
  
  const handleOnWheel = (e) => {
    if (e.deltaY < 0) {
      scrollUp(e.deltaY);
    } else {
      scrollDown(e.deltaY);
    }
  };
  
  return (
    <div onWheel={handleOnWheel}>
    <ul id={'contentWrapper'} className={'content'} ref={contentWrapper}>
      <div id={'start'} ref={start}>Start</div>
      {chats.map((chat, i) => <li key={`chat-${i}`}>{chat}</li>)}
      <div id={'end'} ref={end}>End</div>
    </ul>
    </div>
  );
};

export default Content;
