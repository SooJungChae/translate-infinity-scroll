import React from 'react';
import './ChatRoom.css';
import ScrollContent from "./ScrollContent";
import ViewScreen from "./ViewScreen";

const MyComponent = () => {
  return (
    <div className={'chat-room'}>
      <ScrollContent />
      <ViewScreen />
    </div>
  );
};

export default MyComponent;
