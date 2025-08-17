import React from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  image?: string;
  isError?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleClass = isUser ? 'justify-content-end' : 'justify-content-start';

  // Define bubble classes and styles based on sender
  const bubbleClasses = message.isError 
    ? 'bg-danger text-white' 
    : isUser ? 'text-dark' : 'bg-light text-dark';

  const bubbleStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '10px',
  };

  if (isUser && !message.isError) {
    bubbleStyle.backgroundColor = '#00EEFF';
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  // 이미지 경로가 http로 시작하면 그대로, 아니면 apiBaseUrl을 붙임
  const getImageSrc = (img?: string) => {
    if (!img) return undefined;
    return img.startsWith('http') ? img : `${apiBaseUrl}${img}`;
  };

  return (
    <div className={`d-flex ${bubbleClass} mb-3`}>
      <div className={`p-3 rounded`} style={{ maxWidth: '70%' }}>
        <div className={bubbleClasses} style={bubbleStyle}>
          {message.image && (
            <img 
              src={getImageSrc(message.image)}
              alt="Chat attachment"
              className="img-fluid rounded mb-2 d-block"
              style={{ maxHeight: '200px' }}
            />
          )}
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
