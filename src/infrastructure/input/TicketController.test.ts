import express, { Request, Response } from 'express';
import { BuyTicket } from '../../core/app/BuyTicket';
import { InMemoryTicketRepository } from '../output/InMemoryTicketRepository';
import { InMemoryEventRepository } from '../output/InMemoryEventRepository';
import { Ticket } from '../../core/domain/Ticket';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const app = express();
app.use(express.json());

const ticketRepo = new InMemoryTicketRepository(path.resolve(__dirname, '../../data/tickets.json'));
const eventRepo = new InMemoryEventRepository(path.resolve(__dirname, '../../data/events.json'));

// Lista en memoria para rastrear los tickets reservados
const reservedTickets: { [eventId: string]: number } = {};
const reservationTimers: { [ticketId: string]: NodeJS.Timeout } = {};

(async () => {
  await eventRepo.loadEvents(); // Cargar eventos desde el archivo JSON

  app.get('/api/events', async (req: any, res: any) => {
    try {
      const events = await eventRepo.getEvents();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch events' });
    }
  });

  app.get('/api/events/:eventId/availability', async (req: any, res: any) => {
    try {
      const { eventId } = req.params;
      const tickets = await ticketRepo.getTicketsByEventId(eventId);
      const event = await eventRepo.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      const soldTickets = tickets.filter(ticket => ticket.status === 'SOLD').length;
      const reservedCount = reservedTickets[eventId] || 0;
      const availableTickets = event.quota - soldTickets - reservedCount;
      res.status(200).json({ success: true, availableTickets });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to check availability' });
    }
  });

  app.post('/api/events/:eventId/reserve', async (req: any, res: any) => {
    try {
      const { eventId } = req.params;
      const { email, birthdate } = req.body;
      const tickets = await ticketRepo.getTicketsByEventId(eventId);
      const event = await eventRepo.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      const soldTickets = tickets.filter(ticket => ticket.status === 'SOLD').length;
      const reservedCount = reservedTickets[eventId] || 0;
      const availableTickets = event.quota - soldTickets - reservedCount;
      if (availableTickets <= 0) {
        return res.status(400).json({ success: false, message: 'No tickets available' });
      }
      reservedTickets[eventId] = reservedCount + 1;
      const ticketId = uuidv4();
      reservationTimers[ticketId] = setTimeout(() => {
        reservedTickets[eventId] = reservedTickets[eventId] - 1;
        delete reservationTimers[ticketId];
      }, 10 * 60 * 1000); // 10 minutos
      res.status(200).json({ success: true, ticketId });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to reserve ticket' });
    }
  });

  app.post('/api/events/:eventId/buy', async (req: any, res: any) => {
    try {
      const { eventId } = req.params;
      const { email, birthdate } = req.body;
      const tickets = await ticketRepo.getTicketsByEventId(eventId);
      const event = await eventRepo.getEventById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: 'Event not found' });
      }
      const soldTickets = tickets.filter(ticket => ticket.status === 'SOLD').length;
      const reservedCount = reservedTickets[eventId] || 0;
      //const availableTickets = event.quota - soldTickets - reservedCount;
      //if (availableTickets <= 0) {
      //  return res.status(400).json({ success: false, message: 'No tickets available' });
      //}
      const ticket = new Ticket(uuidv4(), eventId, 'SOLD');
      await ticketRepo.addTicket(ticket);
      reservedTickets[eventId] = reservedCount > 0 ? reservedCount - 1 : 0;
      res.status(200).json({ success: true, ticketId: ticket.id });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to buy ticket' });
    }
  });

  app.use(express.static(path.join(__dirname, '../../../frontend/build')));

  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../frontend/build', 'index.html'));
  });

  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
})();