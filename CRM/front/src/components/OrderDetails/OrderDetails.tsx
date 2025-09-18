import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import './OrderDetails.css';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: UserRole;
}

type UserRole = 'employee' | 'manager' | 'client';

interface Comment {
  text: string;
  role: UserRole;
  userId: number;
}

interface Order {
  id: number;
  title: string;
  price: number;
  description: string;
  status: string;
  clientName: string;
  creationDate: string;
  filePath: string;
  user: User;
}

interface Props {
  orderId: number;
  userRole: UserRole;
  onClose: () => void;
}

const OrderDetails: React.FC<Props> = ({ orderId, userRole, onClose }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editDescription, setEditDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ sub: number }>(token);
        if (decoded && decoded.sub) {
          setUserId(decoded.sub);
          console.log('Decoded JWT:', decoded);
        } else {
          console.error('Failed to decode or ID is missing in the token:', decoded);
        }
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }

      const headers = {
        Authorization: `Bearer ${token}`
      };

      const fetchOrderDetails = async () => {
        try {
          const result = await axios.get(`http://localhost:3001/api/tasks/${orderId}`, { headers });
          console.log('Order details fetched:', result.data);
          setOrder(result.data);
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      };

      const fetchComments = async () => {
        try {
          const result = await axios.get(`http://localhost:3001/api/comments/by-task/${orderId}`, { headers });
          setComments(result.data);
          console.log('Comments fetched:', result.data);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      };

      fetchOrderDetails();
      fetchComments();
    }
  }, [orderId]);

  const handleCommentSubmit = async () => {
    if (userId && newComment.trim() !== '') {
      const token = localStorage.getItem('authToken');
      if (token) {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        try {
          console.log('Sending comment:', { text: newComment, userId, taskId: orderId });
          const response = await axios.post(`http://localhost:3001/api/comments`, {
            text: newComment,
            userId: userId,
            taskId: orderId
          }, { headers });

          if (response.status === 200 || response.status === 201) {
            const updatedComments = [...comments, { text: newComment, role: userRole, userId }];
            setComments(updatedComments);
            setNewComment('');
          } else {
            console.error('Failed to post comment', response);
          }
        } catch (error) {
          console.error('Error posting comment', error);
        }
      }
    } else {
      console.log('No userId or comment is empty');
    }
  };

  const handleEditClick = () => {
    if (order) {
      setEditTitle(order.title);
      setEditPrice(order.price);
      setEditDescription(order.description);
      setShowEditModal(true);
    }
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      try {
        const response = await axios.put(`http://localhost:3001/api/tasks/${orderId}`, {
          title: editTitle,
          price: editPrice,
          description: editDescription
        }, { headers });

        if (response.status === 200) {
          setOrder(response.data);
          setShowEditModal(false);
        } else {
          setError('Failed to update order');
        }
      } catch (error) {
        console.error('Error updating order', error);
        setError('Error updating order');
      }
    }
  };

  const closeModal = () => {
    setShowEditModal(false);
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="order-details" onClick={(e) => e.stopPropagation()}>
        <h2>Детали заказа</h2>
        {userRole !== 'employee' && (
          <FaEdit className="edit-icon" onClick={handleEditClick} />
        )}
        <p>Наименование: {order.title}</p>
        <p>Сумма: {order.price}</p>
        <p>Описание: {order.description}</p>
        <p>Статус: <span className="status">{order.status}</span></p>
        <p>Клиент: {order.user.name} {order.user.surname}</p>
        <p>Email клиента: {order.user.email}</p>
        <p>Телефон клиента: {order.user.phone}</p>
        <p>Дата создания: {new Date(order.creationDate).toLocaleDateString()}</p>
        {order.filePath && (
          <p>
            Файл: <a href={order.filePath} target="_blank" rel="noopener noreferrer">Скачать</a>
          </p>
        )}
        <div className="comments">
          {comments.map((comment, index) => (
            <div key={index} className={`comment ${comment.role === userRole ? 'right' : 'left'}`}>
              {comment.text}
            </div>
          ))}
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Оставьте комментарий"
        />
        <button onClick={handleCommentSubmit}>Отправить</button>
      </div>
      {showEditModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="profile-form">
            <h2>Редактировать заказ</h2>
            <input
              type="text"
              className='imput'
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Наименование"
            />
            <input
              type="number"
              className='imput'
              value={editPrice}
              onChange={(e) => setEditPrice(parseFloat(e.target.value))}
              placeholder="Сумма"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Описание"
            />
            {error && <p className="error">{error}</p>}
            <button onClick={handleEditSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
