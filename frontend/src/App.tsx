import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './media/logo.png'; // Importar la imagen

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  quota: number;
  price: number; // Añadir el atributo price
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  return (
    <div className="dark">
      <header className="bg-purple-800 p-4" style={{ backgroundColor: '#6E267B' }}>
        <div className="container mx-auto flex items-center">
          <img src={logo} alt="Project Logo" className="h-12 mr-4" />
          <h1 className="text-2xl font-bold text-white">Event List</h1>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div id="event-list">
          {events.map(event => (
            <div key={event.id} className="event p-4 mb-4 rounded shadow" style={{ backgroundColor: '#6E267B' }}>
              <h2 className="text-xl font-semibold text-white">{event.title}</h2>
              <p><strong>Fecha:</strong> {event.date}</p>
              <p><strong>Info:</strong> {event.description}</p>
              <p><strong>Cupo:</strong> {event.quota}</p>
              <p><strong>Tickets desde </strong> ${event.price}</p> {/* Mostrar el precio */}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;