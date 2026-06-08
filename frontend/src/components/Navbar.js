import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Главная</Link>
        <Link to="/catalog" style={{ color: 'white', marginRight: '1rem' }}>Каталог</Link>
        {user && (
          <>
            <Link to="/cart" style={{ color: 'white', marginRight: '1rem' }}>Корзина</Link>
            <Link to="/history" style={{ color: 'white', marginRight: '1rem' }}>История</Link>
            <Link to="/profile" style={{ color: 'white', marginRight: '1rem' }}>Профиль</Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'white', marginRight: '1rem' }}>Админ-панель</Link>
            )}
          </>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span style={{ color: 'white', marginRight: '1rem' }}>Привет, {user.full_name}</span>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>Вход</Link>
            <Link to="/register" style={{ color: 'white' }}>Регистрация</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;