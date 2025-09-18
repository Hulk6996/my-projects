import React, { useState, ChangeEvent } from 'react';
import './PostCreator.css';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
}

const PostCreator = () => {
  const [post_text, setPostText] = useState('');
  const [error, setError] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      console.log('Выбрано изображение:', img);
      if (img.size > 10485760) {
        setError('Файл слишком большой. Максимальный размер файла - 10 МБ.');
        setPreviewImage(null);
        return;
      }
      setPostImage(img);
      setPreviewImage(URL.createObjectURL(img));
      setError('');
    }
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return '';
    }
    const decodedToken = jwtDecode(token) as DecodedToken;
    return decodedToken.sub ?? '';
  };

  const handleSubmit = async () => {
    try {
      setError('');

      if (!post_text.trim() && !postImage) {
        setError('Пост должен содержать текст или изображение');
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Токен аутентификации не найден');
        return;
      }

      const formData = new FormData();
      formData.append('text', post_text);
      formData.append('userId', getUserIdFromToken());
      if (postImage) {
        formData.append('image', postImage);
      }


      console.log(formData.get('image'));

      const response = await fetch('http://localhost:3001/api/profile-posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const responseBody = await response.text();

      if (response.ok) {
        setPostText('');
        setPostImage(null);
        setPreviewImage(null);
        setError('');
      } else {
        setError(responseBody || 'Ошибка при сохранении поста');
      }
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при отправке поста на сервер:', error);
      setError('Ошибка при отправке поста на сервер');
    }
  };

  return (
    <div className="post-creator">
      <textarea
        className="post-text"
        placeholder="Что у вас нового?"
        value={post_text}
        onChange={(e) => setPostText(e.target.value)}
      />
      {previewImage && (
        <div className="preview-image-container">
          <img src={previewImage} alt="Preview" className="preview-image" />
        </div>
      )}
      <div className="post-actions">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {error && <div className="error-message">{error}</div>}
        <button onClick={handleSubmit} className="submit-post">Опубликовать</button>
      </div>
    </div>
  );
};

export default PostCreator;
