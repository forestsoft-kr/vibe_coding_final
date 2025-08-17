import React from 'react';
import MessageList from '../../components/Chat/MessageList/MessageList';
import MessageInput from '../../components/Chat/MessageInput/MessageInput';

import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { fetchChatHistory } from '../../features/chat/thunks';

const ChatPage: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);
  return (
    <div className="d-flex flex-column vh-100">
      <MessageList />
      <MessageInput />
    </div>
  );
};

export default ChatPage;