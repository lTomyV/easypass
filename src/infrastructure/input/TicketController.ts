// src/infrastructure/input/TicketController.ts
import express from 'express';
import { BuyTicket } from '../../core/app/BuyTicket';
import { InMemoryTicketRepository } from '../output/InMemoryTicketRepository';
import { InMemoryEventRepository } from '../output/InMemoryEventRepository';
import path from 'path';

const app = express();
app.use(express.json());

const ticketRepo = new InMemoryTicketRepository(path.resolve(__dirname, '../../data/tickets.json'));
const eventRepo = new InMemoryEventRepository(path.resolve(__dirname, '../../data/events.json'));

(async () => {
  await eventRepo.loadEvents(); // Cargar eventos desde el archivo JSON
  const buyTicket = new BuyTicket(ticketRepo, eventRepo);

  app.post('/buy-ticket', async (req, res) => {
    try {
      const { eventId } = req.body;
      const ticketId = await buyTicket.execute(eventId);
      res.status(200).json({ success: true, ticketId });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(400).json({ success: false, message: 'Unknown error occurred' });
      }
    }
  });

  app.get('/api/events', async (req, res) => {
    try {
      const events = await eventRepo.getEvents();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch events' });
    }
  });

  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
})();