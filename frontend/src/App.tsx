import React, { useEffect, useState } from 'react';
import './App.css';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  quota: number;
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event List</h1>
      <div id="event-list">
        {events.map(event => (
          <div key={event.id} className="event bg-white p-4 mb-4 rounded shadow">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p><strong>Date:</strong> {event.date}</p>
            <p><strong>Description:</strong> {event.description}</p>
            <p><strong>Quota:</strong> {event.quota}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;