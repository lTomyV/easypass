import React from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  quota: number;
  price: number;
}

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEventClick }) => {
  return (
    <div id="event-list">
      {events.map(event => (
        <div
          key={event.id}
          className="event p-4 mb-4 rounded shadow cursor-pointer"
          style={{ backgroundColor: '#6E267B' }}
          onClick={() => onEventClick(event)}
        >
          <h2 className="text-xl font-semibold text-white">{event.title}</h2>
          <p><strong>Fecha:</strong> {event.date}</p>
          <p><strong>Descripcion:</strong> {event.description}</p>
          <p><strong>Cupo:</strong> {event.quota}</p>
          <p><strong>Precio:</strong> ${event.price}</p>
        </div>
      ))}
    </div>
  );
};

export default EventList;