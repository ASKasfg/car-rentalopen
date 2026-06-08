import React from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>Личный кабинет</h1>
      
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f9f9f9' }}>
        <h2>Информация о пользователе</h2>
        <p><strong>Имя:</strong> {user?.full_name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Телефон:</strong> {user?.phone || 'Не указан'}</p>
        <p><strong>Номер ВУ:</strong> {user?.driver_license_number}</p>
        <p><strong>Роль:</strong> {user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
        <p><strong>Зарегистрирован:</strong> {new Date(user?.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default Profile;