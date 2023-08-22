import React, { useState, useEffect, useRef } from 'react';
import FloatingButton from './FloatingButton';
import './ChatWidget.css';

function MyButton({ onClick }) {
  return (
    <button className='send-button' onClick={onClick}>
      Send
    </button>
  );
}

export default function ChatWidget() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  const handleSendClick = async () => {
    if (message.trim() !== '') {

      const userMessage = message.trim();
      const updatedMessages = [...messages, { type: 'user', content: userMessage, isImage: false }];
      setMessages(updatedMessages);
      setMessage('');

      try {
        const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });

        const responseData = await response.json();

        if (responseData && responseData.length > 0) {
          const updatedMessagesWithResponse = [];

          for (const messageData of responseData) {
            if (messageData.text) {
              updatedMessagesWithResponse.push({ type: 'bot', content: messageData.text, isImage: false });
            }
  
            if (messageData.image) {
              updatedMessagesWithResponse.push({ type: 'bot', content: messageData.image, isImage: true });
            }
          }
          setMessages([...updatedMessages, ...updatedMessagesWithResponse]);
        }
      } catch (error) {
        console.error('Error communicating with Rasa:', error);
      }
    }
  };

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  

  return (
    <div>
      <FloatingButton onClick={toggleChatVisibility} />
      {isChatVisible && (
        <div className="chat-widget">
          <div className='img'>
            <img src='https://cms.etisalat.ae/b2c/eshopApp/assets/img/Logo_Etisalat_jpg@2x.png' alt='Profile' />
          </div>
          <div className='chat-header'>
            <h2>Etisalat Egypt</h2>
          </div>
          <div className='message-container' ref={messageContainerRef} align='right'>
  {messages.map((msg, index) => (
    <div className={`text-container-${msg.type}`} key={index}>
      {msg.isImage && <img src={msg.content} alt="Image" className={`image-message-${msg.type}`} />}
      {!msg.isImage && <p className={`text-message-${msg.type}`}>{msg.content}</p>}
    </div>
  ))}
</div>

          <div className='input-container'>
            <input
              className='input-field'
              type='text'
              placeholder='Message'
              value={message}
              onChange={handleInputChange}
            />
            <MyButton onClick={handleSendClick} />
          </div>
        </div>
      )}
    </div>
  );
}
