import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Content.css';

const Content = (props) => {
  const requestRef = useRef(null);
  const contentYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const contentWrapper = useRef(null);
  const start = useRef(null);
  const end = useRef(null);
  const [chats, setChats] = useState([]);
  
  const getMessages = () => {
    return Array.from({ length: 30 }).map((_, index) => `chat ${index}`);
  };
  
  useEffect(() => {
    setChats(getMessages());
  }, [])
  
  useEffect(() => {
    const wrapperHeight = contentWrapper.current.getBoundingClientRect().height;
    
    contentHeightRef.current = wrapperHeight;
    contentWrapper.current.style.transform = `translate3d(0, -${wrapperHeight - 500}px, 0)`;
    // 바로 내려서 보여주려고
    contentWrapper.current.style.transition = `none`;
  }, [chats]);
  
  useEffect(() => {
    const onIntersect = (entry, observer) => {
      const target = entry.target;
      const bounding = entry.boundingClientRect;
  
      if (target.id === 'contentWrapper') {
        // setContentHeight(bounding.height);
        contentHeightRef.current = bounding.height;
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
    // observer.observe(end.current);
  }, [props.viewScreenRef, contentWrapper, start, end]);
  
  const scrollUp = (value) => {
    // 최대 길이를 넘어서 위로 올릴 수 없다.
    if (contentYRef.current + value < -(contentHeightRef.current - 500)) return;
  
    contentYRef.current += value;
    contentWrapper.current.style.transform = `translate3d(0, ${contentYRef.current}px, 0)`;
  }
  
  const scrollDown = (value) => {
    console.log('down', contentYRef.current, value);
    if (0 < contentYRef.current + value) return;
    
    contentYRef.current += value;
    contentWrapper.current.style.transform = `translate3d(0, ${contentYRef.current}px, 0)`;
  }
  
  const wheel = (e) => {
    if (e.deltaY === undefined) return;
    
    if (e.deltaY < 0) {
      scrollUp(e.deltaY);
    } else {
      scrollDown(e.deltaY);
    }
    
    if (e.deltaY) {
      requestRef.current = requestAnimationFrame(wheel);
    }
  };
  
  const handleOnWheel = useCallback(
    (e) => {
      requestRef.current = requestAnimationFrame(() => wheel(e));
  
      return () => {
        cancelAnimationFrame(requestRef.current);
      }
    },
    [],
  );
  
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
