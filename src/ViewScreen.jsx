import React, { useRef } from 'react';
import './ViewScreen.css';
import Content from "./Content";

const ViewScreen = () => {
  const viewScreen = useRef(null);
  
  return (
    <div id={'viewScreen'} className={'view-screen'} ref={viewScreen}>
      <Content viewScreenRef={viewScreen} />
    </div>
  );
};

export default ViewScreen;
