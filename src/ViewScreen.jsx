import React, { useEffect, useState, useRef,useCallback } from 'react';
import './ViewScreen.css';
import './Content.css';
// import Content from "./Content";

const ViewScreen = () => {
  const viewScreen = useRef(null);
  const viewScreenHeight = useRef(null);
  const scrollbarThumb = useRef(null);
  const scrollbarThumbY = useRef(0);
  const scrollbarThumbHeight = useRef(null);
  const ratioRef = useRef(null);
  const [chats, setChats] = useState([]);
  const requestRef = useRef(null);
  const contentYRef = useRef(0);
  const contentHeightRef = useRef(0);
  const originalContentHeightRef = useRef(0);
  const contentWrapper = useRef(null);
  const start = useRef(null);
  const end = useRef(null);
  
  useEffect(() => {
    viewScreenHeight.current = viewScreen.current.getBoundingClientRect().height;
  }, [viewScreen])
  
  useEffect(() => {
    const bounding = contentWrapper.current.getBoundingClientRect();
    
    originalContentHeightRef.current = contentHeightRef.current;
    contentHeightRef.current = bounding.height;
    scrollbarThumbHeight.current = scrollbarThumb.current.getBoundingClientRect().height;
    ratioRef.current = ((contentHeightRef.current - viewScreenHeight.current) / (viewScreenHeight.current - scrollbarThumbHeight.current)).toFixed(3);
  
    // 맨 처음 로드
    if (chats.length <= 5) {
      console.log('init');
      // contentYRef.current = -(contentWrapperHeight - 500);
      // contentWrapper.current.style.transform = `translate3d(0, ${contentYRef.current}px, 0)`;
      // contentWrapper.current.style.transition = `none`;
    } else {
      const newY = contentHeightRef.current - originalContentHeightRef.current;
      scrollContentWrapperTo(-newY, 'none');
    };
  }, [chats]);
  
  useEffect(() => {
    const onIntersect = (entry, observer) => {
      const target = entry.target;
      const bounding = entry.boundingClientRect;
      
      if (target.id === 'contentWrapper') {
        // setContentHeight(bounding.height);
        console.log(bounding);
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
  }, [viewScreen, contentWrapper, start, end]);
  
  useEffect(() => {
    
    console.log('detect start', start);
  }, [start])
  
  const scrollContentWrapperTo = (value, transition) => {
    // contentYRef.current = value;
    contentWrapper.current.style.transform = `translate3d(0, ${value}px, 0)`;
    contentWrapper.current.style.transition = transition || `all linear 500ms 0s`;
  };
  
  const scrollScrollbarThumbTo = (value, transition) => {
    // if (value < 0) return;
    
    // scrollbarThumbY.current = value;
    scrollbarThumb.current.style.transform = `translate3d(0, ${value}px, 0)`;
    // scrollbarThumb.current.style.transition = transition || `all linear 500ms 0s`;
  };
  
  const scrollUp = (value) => {
    const scrollUpValue = scrollbarThumbY.current + value;
    if (scrollUpValue < 0) return;
    
    scrollbarThumbY.current = scrollUpValue;
    scrollScrollbarThumbTo(scrollUpValue);
  
    const y = scrollUpValue * ratioRef.current;
    contentYRef.current = -y;
    // scrollContentWrapperTo(y * ratioRef.current);
    scrollContentWrapperTo(-y);
    // console.log('scroll up', scrollUpValue);
    
    // // if (0 < contentYRef.current + value) return;
    //
    // // scrollContentWrapperTo(contentYRef.current + value);
    // scrollContentWrapperTo(contentYRef.current + value * ratioRef.current);
    
    // const scrollY = Math.floor(contentYRef.current / ratioRef.current);
  }
  
  const scrollDown = (value) => {
    const scrollDownValue = scrollbarThumbY.current + value;
  
    // 최대 길이를 넘어서 밑으로 내릴 수 없다.
    if (viewScreenHeight.current - scrollbarThumbHeight.current < scrollDownValue) return;
    
    scrollbarThumbY.current = scrollDownValue;
    scrollScrollbarThumbTo(scrollDownValue);
  
    const y = scrollDownValue * ratioRef.current;
    console.log('down', y);
    contentYRef.current = -y;
    
    scrollContentWrapperTo(-y);
  
    // if (viewScreenHeight.current < -scrollbarThumbMaxY) return;
    // scrollbarThumbY.current += value;
    // const scrollY = scrollbarThumbY.current;
    // scrollScrollbarThumbTo(-scrollY);
    //
    // const contentWrapperY = -(contentHeightRef.current - 500);
    //
    //
    // // if (contentYRef.current + value < contentWrapperY) return;
    // //
    // scrollContentWrapperTo(contentYRef.current + value * ratioRef.current);
    //
    // // const scrollY = Math.floor(contentYRef.current / ratioRef.current);
    // // const scrollY = contentYRef.current / ratioRef.current;
  }
  
  const wheel = (e) => {
    if (e.deltaY === undefined) return;
    
    // 컨텐츠를 반대로 이동시켜줘야 하기 때문에 - 값으로 처리해야한다.
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
  
  const getMessages = () => {
    return Array.from({ length: 3 }).map((_, index) => `chat ${index}`);
  };
  
  
  const getPrev = () => {
    setChats((chats) => [...getMessages(), ...chats]);
  };
  
  const getNext = () => {
    setChats((chats) => [...chats, ...getMessages()]);
  };
  
  useEffect(() => {
    setChats(getMessages());
  }, [])
  
  return (
    <>
      <button onClick={getPrev}>get prev</button>
      {ratioRef.current}
    <div id={'viewScreen'} className={'view-screen'} ref={viewScreen}>
      {/*<Content viewScreenRef={viewScreen} chats={chats} getPrev={getPrev} getNext={getNext} />*/}
      <div className={'wheel-element'} onWheel={handleOnWheel}>
        <ul id={'contentWrapper'} className={'content'} ref={contentWrapper}>
          <div id={'start'} ref={start}>Start</div>
          {chats.map((chat, i) => <li key={`chat-${i}`} style={{ margin: '10px', background: `hsla(${i * 30}, 60%, 80%, 1)`}}>{chat}</li>)}
          <div id={'end'} ref={end}>End</div>
        </ul>
      </div>
      <div className={'scrollbar'}>
        <div className="scrollbar-thumb" ref={scrollbarThumb}></div>
      </div>
    </div>
    </>
  );
};

export default ViewScreen;
