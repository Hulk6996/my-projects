import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsFeed.css'; 
import Header from '../Header/Header'

interface ProfilePostItem {
  news_id: number;
  post_type: string;
  date_and_time_added: string;
  profilePost: {
    post_id: number;
    post_text: string;
    date_and_time_of_post: string;
    postImage: string;
  };
  user: {
    id: number;
    name: string;
    surname: string;
    profilePicture: string; 
  };
}

const NewsPost: React.FC<{ post: ProfilePostItem }> = ({ post }) => {
  const { post_text, date_and_time_of_post, postImage } = post.profilePost;
  const { name, surname, profilePicture } = post.user;

  const formattedDate = date_and_time_of_post
    ? new Date(date_and_time_of_post).toLocaleDateString()
    : "Дата неизвестна";

  const isPostImageAvailable = postImage && postImage.trim() !== '';

  const handleImageClick = () => {
    if (isPostImageAvailable) {
      window.open(postImage, '_blank');
    }
  };

  return (
    <div className="news-item">
      <div className="user-profile">
        <img src={profilePicture} alt={`${name} ${surname}`} className="user-image" />
        <div className="user-info">
          <h2 className="user-name">{`${name} ${surname}`}</h2>
          <span className="post-date">{formattedDate}</span>
        </div>
      </div>
      <div className="post-content">
        {isPostImageAvailable && (
          <img src={postImage} alt="Post" className="post-image" onClick={handleImageClick} />
        )}
        {post_text && <p className="post-text">{post_text}</p>}
      </div>
    </div>
  );
};

const NewsFeed: React.FC = () => {
  const [posts, setPosts] = useState<ProfilePostItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get<ProfilePostItem[]>('http://localhost:3001/api/news-feed')
      .then(response => {
        if (Array.isArray(response.data)) {
          const sortedPosts = response.data.sort((a, b) => b.news_id - a.news_id);
          setPosts(sortedPosts);
        } else {
          setError('Ответ сервера не является массивом постов.');
        }
      })
      .catch(error => {
        console.error('Ошибка при загрузке постов:', error);
        setError('Не удалось загрузить посты. Пожалуйста, проверьте соединение с сервером.');
      });
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <Header />
      <div className="news-feed">
        {posts.map((post) => (
          <NewsPost key={post.news_id.toString()} post={post} />
        ))}
      </div>
    </>
  );
}


export default NewsFeed;
