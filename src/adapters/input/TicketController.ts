// src/adapters/input/TicketController.ts
import express from 'express';
import { MongoClient } from 'mongodb';  // Importa MongoClient desde 'mongodb'
import { BuyTicket } from '../../core/usecases/BuyTicket';
import { MongoTicketRepository } from '../output/MongoTicketRepository';

const app = express();
const client = new MongoClient('mongodb://localhost:27017');
const ticketRepo = new MongoTicketRepository(client);
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