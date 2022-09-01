import React from 'react';
import './ChatRoom.css';
import Content from "./Content";
import ViewScreen from "./ViewScreen";

const MyComponent = () => {
  return (
    <div className={'chat-room'}>
      <ViewScreen />
    </div>
  );
};

export default MyComponent;
