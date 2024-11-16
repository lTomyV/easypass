// src/infrastructure/input/TicketController.test.ts
import request from 'supertest';
import express from 'express';
import { BuyTicket } from '../../core/app/BuyTicket';
import { InMemoryTicketRepository } from '../output/InMemoryTicketRepository';
import { InMemoryEventRepository } from '../output/InMemoryEventRepository';
import { Ticket } from '../../core/domain/Ticket';
import path from 'path';

const app = express();
app.use(express.json());

const ticketRepo = new InMemoryTicketRepository(path.resolve(__dirname, '../../data/tickets.json'));
const eventRepo = new InMemoryEventRepository(path.resolve(__dirname, '../../data/events.json'));

beforeAll(async () => {
  await eventRepo.loadEvents(); // Cargar eventos desde el archivo JSON
});

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

describe('TicketController', () => {
  beforeEach(() => {
    // Reset the in-memory repository before each test
    (ticketRepo as any).tickets = [];
  });

  it('should buy a ticket successfully', async () => {
    const response = await request(app)
      .post('/buy-ticket')
      .send({ eventId: '1' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.ticketId).toBeDefined();
  });

  it('should return an error if no tickets are available', async () => {
    // Simulate event quota reached
    (ticketRepo as any).tickets = [
      new Ticket('1', '1'),
      new Ticket('2', '1'),
      new Ticket('3', '1')
    ];

    const response = await request(app)
      .post('/buy-ticket')
      .send({ eventId: '1' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('No tickets available for this event');
  });
});