import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './media/logo.png'; // Importar la imagen

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  quota: number;
  price: number;
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [availableTickets, setAvailableTickets] = useState<number | null>(null);
  const [email, setEmail] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  const handleEventClick = (event: Event) => {
    console.log(`Checking availability for event ${event.id}`);
    fetch(`/api/events/${event.id}/availability`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setAvailableTickets(data.availableTickets);
          setSelectedEvent(event);
          console.log(`Available tickets for event ${event.id}: ${data.availableTickets}`);
          // Llamar a la API de reserva
          fetch(`/api/events/${event.id}/reserve`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: 'test@example.com', birthdate: '2000-01-01' }), // Datos de prueba
          })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                console.log(`Ticket reservado: ${data.ticketId} para el evento ${event.id}`);
              } else {
                console.error(`Error reservando ticket: ${data.message}`);
              }
            })
            .catch(error => console.error('Error reservando ticket:', error));
        } else {
          setError(data.message);
        }
      })
      .catch(error => console.error('Error checking availability:', error));
  };

  const handleBuy = () => {
    if (!selectedEvent) return;

    // Validar el formulario
    if (!email || !birthdate) {
      setError('Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const birthDate = new Date(birthdate);
    const today = new Date();
    var age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setError('You must be at least 18 years old to buy a ticket.');
      return;
    }

    fetch(`/api/events/${selectedEvent.id}/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, birthdate }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Ticket bought successfully!');
          setSelectedEvent(null);
          setEmail('');
          setBirthdate('');
        } else {
          setError(data.message);
        }
      })
      .catch(error => console.error('Error buying ticket:', error));
  };

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
            <div
              key={event.id}
              className="event p-4 mb-4 rounded shadow cursor-pointer"
              style={{ backgroundColor: '#6E267B' }}
              onClick={() => handleEventClick(event)}
            >
              <h2 className="text-xl font-semibold text-white">{event.title}</h2>
              <p><strong>Fecha:</strong> {event.date}</p>
              <p><strong>Descripcion:</strong> {event.description}</p>
              <p><strong>Cupo:</strong> {event.quota}</p>
              <p><strong>Precio:</strong> ${event.price}</p>
            </div>
          ))}
        </div>
      </main>
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{selectedEvent.title}</h2>
            <p><strong>Fecha:</strong> {selectedEvent.date}</p>
            <p><strong>Descripción:</strong> {selectedEvent.description}</p>
            <p><strong>Cupo:</strong> {selectedEvent.quota}</p>
            <p><strong>Quedan:</strong> {availableTickets}</p>
            <p><strong>Precio:</strong> ${selectedEvent.price}</p>
            {availableTickets && availableTickets > 0 ? (
              <form onSubmit={(e) => { e.preventDefault(); handleBuy(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Fecha de nacimiento:</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-800 text-white px-4 py-2 rounded"
                    style={{ backgroundColor: '#6E267B' }}
                  >
                    Comprar
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-red-500 text-center font-bold">SOLD OUT</p>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                  onClick={() => setSelectedEvent(null)}
                >
                  Volver
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;