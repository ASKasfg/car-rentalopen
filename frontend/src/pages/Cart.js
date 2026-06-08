import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

function Cart() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!cart) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Корзина пуста</h2>
        <button onClick={() => navigate('/catalog')} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Перейти в каталог
        </button>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const bookingData = {
        vehicle_id: cart.vehicle.id,
        start_date: cart.startDate.toISOString(),
        end_date: cart.endDate.toISOString(),
        total_price: cart.totalPrice
      };
      
      await api.post('/bookings', bookingData);
      alert('Бронирование подтверждено!');
      clearCart();
      navigate('/history');
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка при бронировании');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>Подтверждение бронирования</h1>
      
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
        <h2>{cart.vehicle.brand} {cart.vehicle.model}</h2>
        <p>Класс: {cart.vehicle.class}</p>
        <p>КПП: {cart.vehicle.transmission}</p>
        <p>Мест: {cart.vehicle.seats}</p>
        
        <hr style={{ margin: '15px 0' }} />
        
        <h3>Период аренды:</h3>
        <p>С: {new Date(cart.startDate).toLocaleDateString()}</p>
        <p>По: {new Date(cart.endDate).toLocaleDateString()}</p>
        <p>Дней: {cart.days}</p>
        
        <hr style={{ margin: '15px 0' }} />
        
        <h3>Стоимость:</h3>
        <p>Цена за день: ${cart.vehicle.price_per_day}</p>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>Итого: ${cart.totalPrice}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button onClick={() => navigate('/catalog')} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Вернуться
        </button>
        <button onClick={handleConfirmBooking} disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Обработка...' : 'Подтвердить бронирование'}
        </button>
      </div>
    </div>
  );
}

export default Cart;