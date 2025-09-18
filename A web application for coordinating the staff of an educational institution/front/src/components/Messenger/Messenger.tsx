import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Messenger.css';
import Header from '../Header/Header';
import { BsTrash, BsPencil } from 'react-icons/bs';

interface DecodedJwt {
  sub?: number;
}

interface Message {
  message_id: number;
  sender: {
    id: number;
    name: string;
    surname: string;
  };
  text_message: string;
  date_and_time_sending: string;
}

const Messenger = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [authorizedUserId, setAuthorizedUserId] = useState<number | null>(null);
  const messageListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded: DecodedJwt = jwtDecode(token);
      setAuthorizedUserId(decoded.sub ?? null);
    } else {
      console.error('Токен аутентификации отсутствует');
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/messages');
        setMessages(response.data);
      } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (messageListRef.current && authorizedUserId !== null) {
        console.log('Scroll position:', messageListRef.current.scrollTop);
        console.log('Authorized user ID:', authorizedUserId);
        localStorage.setItem(`scrollPosition_${authorizedUserId}`, messageListRef.current.scrollTop.toString());
      }
    };
  
    if (messageListRef.current) {
      messageListRef.current.addEventListener('scroll', handleScroll);
    }
  
    return () => {
      if (messageListRef.current) {
        messageListRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [authorizedUserId]);

  useEffect(() => {
    console.log('Component updated');
    if (messageListRef.current && authorizedUserId !== null) {
      console.log('Setting scroll position...');
      const storedScrollPosition = localStorage.getItem(`scrollPosition_${authorizedUserId}`);
      if (storedScrollPosition !== null) {
        messageListRef.current.scrollTop = parseInt(storedScrollPosition, 10);
        console.log('Scroll position set to:', storedScrollPosition);
      }
    }
  }, [messages, authorizedUserId]);

  const handleSendMessage = async () => {
    if (authorizedUserId === null) {
      console.error("ID пользователя не определен");
      return;
    }
  
    if (!newMessage.trim()) {
      console.error("Не можем отправить пустое сообщение");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:3001/api/messages', {
        text: newMessage,
        authorId: authorizedUserId,
      });
      if (response.status === 201) {
        setMessages(prevMessages => [...prevMessages, response.data]);
        if (messageListRef.current) {
            const currentScrollPosition = messageListRef.current.scrollTop;
            messageListRef.current.scrollTop = currentScrollPosition;
            localStorage.setItem(`scrollPosition_${authorizedUserId}`, messageListRef.current.scrollTop.toString());
        }
    }
    
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
    }
  
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMoscowTime = (dateString: string) => {
    const date = new Date(dateString);
    date.setHours(date.getHours());

    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  const handleDeleteMessage = async (messageId: number) => {
    try {
      const confirmDelete = window.confirm('Вы уверены, что хотите удалить это сообщение?');
      if (confirmDelete) {
        await axios.delete(`http://localhost:3001/api/messages/${messageId}`);
        setMessages(prevMessages => prevMessages.filter(message => message.message_id !== messageId));
      }
    } catch (error) {
      console.error('Ошибка при удалении сообщения:', error);
    }
  };

  const handleEditMessage = async (messageId: number, newText: string) => {
    try {
      const response = await axios.patch(`http://localhost:3001/api/messages/${messageId}`, { text: newText });
      setMessages(prevMessages => prevMessages.map(message => 
        message.message_id === messageId ? { ...message, text_message: response.data.text_message } : message
      ));
    } catch (error) {
      console.error('Ошибка при редактировании сообщения:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="messenger-container">
        <ul className="message-list" ref={messageListRef}>
          {messages.map((message, index) => {
            if (!message.sender || message.sender.id === undefined) {
              console.error('Неверная структура сообщения:', message);
              return null;
            }

            const isMyMessage = message.sender.id === authorizedUserId;

            return (
              <li
                key={message.message_id}
                className={`message-item ${isMyMessage ? 'my-message' : 'other-message'}`}
              >
                <div className="message-content">
                  <div className="sender-info">
                    {isMyMessage ? (
                      <>
                        <span className="message-time">{formatMoscowTime(message.date_and_time_sending)}</span>
                        <span className="sender-name">{message.sender.name}</span>
                        <span> </span>
                        <span className="sender-surname">{message.sender.surname}</span>
                      </>
                    ) : (
                      <>
                        <span className="sender-name">{message.sender.name}</span>
                        <span> </span>
                        <span className="sender-surname">{message.sender.surname}</span>
                        <span className="message-time">{formatMoscowTime(message.date_and_time_sending)}</span>
                      </>
                    )}
                    {isMyMessage && (
                      <>
                        <BsTrash
                          className="message-action-icon trash-icon"
                          onClick={() => handleDeleteMessage(message.message_id)}
                        />
                        <BsPencil
                          className="message-action-icon pencil-icon"
                          onClick={() => {
                            const newText = prompt('Введите новый текст сообщения:');
                            if (newText !== null) {
                              handleEditMessage(message.message_id, newText);
                            }
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="text-message">{message.text_message}</div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="new-message-container">
          <input
            type="text"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendMessage}>Отправить</button>
        </div>
      </div>
    </>
  );
};

export default Messenger;

