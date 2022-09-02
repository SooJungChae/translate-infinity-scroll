import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Content.css';

let contentY = 0;

const Content = (props) => {
  const requestRef = useRef(null);
  const contentHeightRef = useRef(0);
  const contentWrapper = useRef(null);
  const start = useRef(null);
  const end = useRef(null);
  const [chats, setChats] = useState([]);
  // const [contentHeight, setContentHeight] = useState(0);
  
  const getMessages = () => {
    return Array.from({ length: 30 }).map((_, index) => `chat ${index}`);
  };
  
  useEffect(() => {
    setChats(getMessages());
    // requestRef.current = requestAnimationFrame(wheel);
    //
    // return () => {
    //   cancelAnimationFrame(requestRef.current);
    // }
  }, [])
  
  useEffect(() => {
    const h = contentWrapper.current.getBoundingClientRect().height;
    // setContentHeight.(h);
    contentHeightRef.current = h;
    // console.log(h);
    // scrollUp(contentWrapper.current.getBoundingClientRect().height);
    // contentWrapper.current.style.transform = `translate3d(0, -${h - 500}px, 0)`;
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
    if (contentY + value < -(contentHeightRef.current - 500)) return;
  
    contentY += value;
    contentWrapper.current.style.transform = `translate3d(0, ${contentY}px, 0)`;
  }
  
  const scrollDown = (value) => {
    if (0 < contentY + value) return;
    
    contentY += value;
    contentWrapper.current.style.transform = `translate3d(0, ${contentY}px, 0)`;
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
