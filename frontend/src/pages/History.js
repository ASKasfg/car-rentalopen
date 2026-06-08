import React, { useState, useEffect } from 'react';
import api from '../services/api';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await api.get('/bookings/history');
      setHistory(response.data.history);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>История поездок</h1>
      
      {history.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '50px' }}>У вас пока нет завершенных поездок</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {history.map(record => (
            <div key={record.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9' }}>
              <h3>{record.brand} {record.model}</h3>
              <p>Период: {new Date(record.start_date).toLocaleDateString()} - {new Date(record.end_date).toLocaleDateString()}</p>
              <p>Статус: {record.status}</p>
              <p>Стоимость: ${record.total_price}</p>
              {record.rating && <p>Оценка: {record.rating} ★</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;