import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './media/logo.png'; // Importar la imagen
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';

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
        } else {
          setError(data.message);
        }
      })
      .catch(error => console.error('Error checking availability:', error));
  };

  const handleBuy = (email: string, birthdate: string) => {
    if (!selectedEvent) return;

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
        <EventList events={events} onEventClick={handleEventClick} />
      </main>
      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          availableTickets={availableTickets}
          onClose={() => setSelectedEvent(null)}
          onBuy={handleBuy}
        />
      )}
    </div>
  );
}

export default App;