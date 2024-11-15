// src/infrastructure/input/TicketController.ts
import express from 'express';
import { BuyTicket } from '../../core/app/BuyTicket';
import { InMemoryTicketRepository } from '../output/InMemoryTicketRepository';

const app = express();
app.use(express.json());

const ticketRepo = new InMemoryTicketRepository();
const buyTicket = new BuyTicket(ticketRepo);

app.post('/buy-ticket', async (req, res) => {
  try {
    const { userId, eventId } = req.body;
    const ticketId = await buyTicket.execute(userId, eventId);
    res.status(200).json({ success: true, ticketId });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res.status(400).json({ success: false, message: 'Unknown error occurred' });
    }
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));