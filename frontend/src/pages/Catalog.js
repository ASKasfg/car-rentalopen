import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Catalog() {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    class: '',
    minPrice: '',
    maxPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    searchVehicles();
  }, []);

  const searchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate && filters.endDate) {
        params.append('startDate', filters.startDate.toISOString());
        params.append('endDate', filters.endDate.toISOString());
      }
      if (filters.class) params.append('class', filters.class);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      
      const response = await api.get(`/api/vehicles/search?${params.toString()}`);
      setVehicles(response.data.vehicles);
    } catch (error) {
      console.error('Error:', error);
      alert('Ошибка загрузки автомобилей');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (vehicle) => {
    if (!user) {
      alert('Пожалуйста, войдите в систему для бронирования');
      navigate('/login');
      return;
    }
    
    addToCart(vehicle, filters.startDate, filters.endDate);
    navigate('/cart');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Доступные автомобили</h1>
      
      {/* Фильтры */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div>
          <label>Дата начала:</label><br/>
          <DatePicker
            selected={filters.startDate}
            onChange={date => setFilters({...filters, startDate: date})}
            minDate={new Date()}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div>
          <label>Дата окончания:</label><br/>
          <DatePicker
            selected={filters.endDate}
            onChange={date => setFilters({...filters, endDate: date})}
            minDate={filters.startDate}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div>
          <label>Класс авто:</label><br/>
          <select
            value={filters.class}
            onChange={e => setFilters({...filters, class: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Все классы</option>
            <option value="economy">Эконом</option>
            <option value="comfort">Комфорт</option>
            <option value="business">Бизнес</option>
            <option value="suv">Внедорожник</option>
          </select>
        </div>
        
        <div>
          <label>Цена от:</label><br/>
          <input
            type="number"
            placeholder="Мин. цена"
            value={filters.minPrice}
            onChange={e => setFilters({...filters, minPrice: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div>
          <label>Цена до:</label><br/>
          <input
            type="number"
            placeholder="Макс. цена"
            value={filters.maxPrice}
            onChange={e => setFilters({...filters, maxPrice: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button onClick={searchVehicles} style={{ padding: '8px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Найти
          </button>
        </div>
      </div>
      
      {/* Список автомобилей */}
      {loading ? (
        <div style={{ textAlign: 'center' }}>Загрузка...</div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {vehicles.map(vehicle => (
            <div key={vehicle.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white' }}>
              <img 
                src={vehicle.image_url || 'https://via.placeholder.com/300x200?text=Car'} 
                alt={`${vehicle.brand} ${vehicle.model}`}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <h3>{vehicle.brand} {vehicle.model} ({vehicle.year})</h3>
              <p>Класс: {vehicle.class}</p>
              <p>КПП: {vehicle.transmission}</p>
              <p>Мест: {vehicle.seats}</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>${vehicle.price_per_day}/день</p>
              <button 
                onClick={() => handleBook(vehicle)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Забронировать
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
