import React, { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  quota: number;
  price: number;
}

interface EventDetailsProps {
  event: Event;
  availableTickets: number | null;
  onClose: () => void;
  onBuy: (email: string, birthdate: string) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, availableTickets, onClose, onBuy }) => {
  const [email, setEmail] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutos en segundos
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleCancel(); // Cancelar la reserva cuando el tiempo llegue a 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ticketId, onClose]);

  useEffect(() => {
    // Llamar a la API de reserva solo una vez cuando el componente se monte
    const reserveTicket = async () => {
      try {
        const response = await fetch(`/api/events/${event.id}/reserve`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com', birthdate: '2000-01-01' }), // Datos de prueba
        });
        const data = await response.json();
        if (data.success) {
          setTicketId(data.ticketId);
          console.log(`Ticket reservado: ${data.ticketId} para el evento ${event.id}`);
        } else {
          console.error(`Error reservando ticket: ${data.message}`);
        }
      } catch (error) {
        console.error('Error reservando ticket:', error);
      }
    };

    reserveTicket();
  }, [event.id]);

  const handleCancel = () => {
    if (ticketId) {
      fetch(`/api/events/${event.id}/cancel-reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log(`Reserva cancelada: ${ticketId} para el evento ${event.id}`);
            onClose();
          } else {
            console.error(`Error cancelando reserva: ${data.message}`);
            onClose(); // Cerrar la ventana popup incluso si hay un error
          }
        })
        .catch(error => {
          console.error('Error cancelando reserva:', error);
          onClose(); // Cerrar la ventana popup incluso si hay un error
        });
    } else {
      onClose();
    }
  };

  const handleBuy = () => {
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

    onBuy(email, birthdate);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded shadow-lg w-96 relative">
        <div className="bg-purple-800 text-white text-center py-2 rounded-t" style={{ backgroundColor: '#6E267B' }}>
          Ticket reservado por {formatTime(timeLeft)}
        </div>
        <div className="p-8">
          <h2 className="text-xl font-semibold mb-4">{event.title}</h2>
          <p><strong>Fecha:</strong> {event.date}</p>
          <p><strong>Descripción:</strong> {event.description}</p>
          <p><strong>Cupo:</strong> {event.quota}</p>
          <p><strong>Quedan:</strong> {availableTickets}</p>
          <p><strong>Precio:</strong> ${event.price}</p>
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
                  max={new Date().toISOString().split("T")[0]} // No permitir fechas futuras
                  required
                />
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
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
                onClick={onClose}
              >
                Volver
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;