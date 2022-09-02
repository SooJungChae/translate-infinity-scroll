import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Content.css';

const Content = (props) => {
  const { chats, getPrev, getNext } = props;
  const requestRef = useRef(null);
  const contentYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const contentWrapper = useRef(null);
  const start = useRef(null);
  const end = useRef(null);
  
  useEffect(() => {
    const contentWrapperHeight = contentWrapper.current.getBoundingClientRect().height;
    contentHeightRef.current = contentWrapperHeight;
    
    // 맨 처음 로드
    if (chats.length <= 5) {
      contentYRef.current = -(contentWrapperHeight - 500);
      contentWrapper.current.style.transform = `translate3d(0, ${contentYRef.current}px, 0)`;
      // contentWrapper.current.style.transition = `none`;
    } else {
      // contentWrapper.current.style.transition = 'all ease 500ms 0s';
    }
    // contentWrapper.current.style.transform = `translate3d(0, -${wrapperHeight - 500}px, 0)`;
    // 바로 내려서 보여주려고
    // contentWrapper.current.style.transition = `none`;
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
        console.log('start getMessage');
        getPrev();
        // setChats((chats) => [...getMessages(), ...chats]);
      }
      
      if (target.id === 'end') {
        // setChats((chats) => [...chats, ...getMessages()]);
        getNext();
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
    // start.current && observer.observe(start.current);
    // observer.observe(end.current);
  }, [props.viewScreenRef, contentWrapper, start, end]);
  
  useEffect(() => {
  
    console.log('detect start', start);
  }, [start])
  
  const scrollUp = (value) => {
    if (0 < contentYRef.current + value) return;
    
    contentYRef.current += value;
    contentWrapper.current.style.transform = `translate3d(0, ${contentYRef.current}px, 0)`;
  }
  
  const scrollDown = (value) => {
    const contentWrapperY = -(contentHeightRef.current - 500);
  
    // 최대 길이를 넘어서 밑으로 내릴 수 없다.
    if (contentYRef.current + value < contentWrapperY) return;
  
    contentYRef.current += value;
    contentWrapper.current.style.transform = `translate3d(0, ${contentYRef.current}px, 0)`;
  }
  
  const wheel = (e) => {
    if (e.deltaY === undefined) return;
  
    // 컨텐츠를 반대로 이동시켜줘야 하기 때문에 - 값으로 처리해야한다.
    if (e.deltaY < 0) {
      scrollUp(-e.deltaY);
    } else {
      scrollDown(-e.deltaY);
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
      <div id={'start'} ref={start} style={{ display: chats.length >= 5 ? 'block': 'none'}}>Start</div>
      {chats.map((chat, i) => <li key={`chat-${i}`} style={{ margin: '10px', background: `hsla(${i * 30}, 60%, 80%, 1)`}}>{chat}</li>)}
      <div id={'end'} ref={end}>End</div>
    </ul>
    </div>
  );
};

export default Content;
