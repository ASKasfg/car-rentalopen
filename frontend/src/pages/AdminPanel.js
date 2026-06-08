import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminPanel() {
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [newVehicle, setNewVehicle] = useState({
    brand: '', model: '', year: 2024, license_plate: '',
    class: 'economy', price_per_hour: 0, price_per_day: 0,
    fuel_type: 'petrol', transmission: 'manual', seats: 5
  });
  const [activeTab, setActiveTab] = useState('vehicles');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [vehiclesRes, bookingsRes, statsRes] = await Promise.all([
        api.get('/vehicles'),
        api.get('/admin/bookings'),
        api.get('/admin/statistics')
      ]);
      setVehicles(vehiclesRes.data.vehicles);
      setBookings(bookingsRes.data.bookings);
      setStatistics(statsRes.data.statistics);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/vehicles', newVehicle);
      alert('Автомобиль добавлен');
      loadData();
      setNewVehicle({
        brand: '', model: '', year: 2024, license_plate: '',
        class: 'economy', price_per_hour: 0, price_per_day: 0,
        fuel_type: 'petrol', transmission: 'manual', seats: 5
      });
    } catch (error) {
      alert('Ошибка добавления');
    }
  };

  const handleDeleteVehicle = async (id) => {
    if (window.confirm('Удалить автомобиль?')) {
      try {
        await api.delete(`/admin/vehicles/${id}`);
        alert('Удалено');
        loadData();
      } catch (error) {
        alert('Ошибка удаления');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Панель администратора</h1>
      
      {/* Статистика */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ padding: '15px', backgroundColor: '#007bff', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Автомобилей</h3>
          <p style={{ fontSize: '24px' }}>{statistics.totalVehicles || 0}</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#28a745', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Активных броней</h3>
          <p style={{ fontSize: '24px' }}>{statistics.activeBookings || 0}</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#ffc107', color: 'black', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Доход</h3>
          <p style={{ fontSize: '24px' }}>${statistics.totalRevenue?.toFixed(2) || 0}</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#17a2b8', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Пользователей</h3>
          <p style={{ fontSize: '24px' }}>{statistics.activeUsers || 0}</p>
        </div>
      </div>
      
      {/* Вкладки */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('vehicles')} style={{ marginRight: '10px', padding: '10px', backgroundColor: activeTab === 'vehicles' ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Автомобили
        </button>
        <button onClick={() => setActiveTab('bookings')} style={{ marginRight: '10px', padding: '10px', backgroundColor: activeTab === 'bookings' ? '#007bff' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Бронирования
        </button>
        <button onClick={() => setActiveTab('add')} style={{ padding: '10px', backgroundColor: activeTab === 'add' ? '#28a745' : '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Добавить авто
        </button>
      </div>
      
      {/* Список автомобилей */}
      {activeTab === 'vehicles' && (
        <div>
          <h2>Список автомобилей</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Марка</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Модель</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Госномер</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Цена/день</th>
                <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{vehicle.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{vehicle.brand}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{vehicle.model}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{vehicle.license_plate}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>${vehicle.price_per_day}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button onClick={() => handleDeleteVehicle(vehicle.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Список бронирований */}
      {activeTab === 'bookings' && (
        <div>
          <h2>Все бронирования</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Пользователь</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Автомобиль</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Дата начала</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Дата окончания</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Сумма</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Статус</th>
               </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.full_name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.brand} {booking.model}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(booking.start_date).toLocaleDateString()}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(booking.end_date).toLocaleDateString()}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>${booking.total_price}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Добавление автомобиля */}
      {activeTab === 'add' && (
        <div>
          <h2>Добавить автомобиль</h2>
          <form onSubmit={handleAddVehicle} style={{ maxWidth: '500px' }}>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" placeholder="Марка" value={newVehicle.brand} onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" placeholder="Модель" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input type="number" placeholder="Год" value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" placeholder="Госномер" value={newVehicle.license_plate} onChange={e => setNewVehicle({...newVehicle, license_plate: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <select value={newVehicle.class} onChange={e => setNewVehicle({...newVehicle, class: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                <option value="economy">Эконом</option>
                <option value="comfort">Комфорт</option>
                <option value="business">Бизнес</option>
                <option value="suv">Внедорожник</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input type="number" step="0.01" placeholder="Цена в час" value={newVehicle.price_per_hour} onChange={e => setNewVehicle({...newVehicle, price_per_hour: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input type="number" step="0.01" placeholder="Цена в день" value={newVehicle.price_per_day} onChange={e => setNewVehicle({...newVehicle, price_per_day: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <select value={newVehicle.transmission} onChange={e => setNewVehicle({...newVehicle, transmission: e.target.value})} style={{ width: '100%', padding: '8px' }}>
                <option value="manual">Механика</option>
                <option value="automatic">Автомат</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input type="number" placeholder="Количество мест" value={newVehicle.seats} onChange={e => setNewVehicle({...newVehicle, seats: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Добавить
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;