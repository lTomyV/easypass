// src/infrastructure/output/MongoTicketRepository.ts
import { ITicketRepository } from '../../core/ports/ITicketRepository';
import { Ticket } from '../../core/domain/Ticket';
import { MongoClient } from 'mongodb';

export class MongoTicketRepository implements ITicketRepository {
  constructor(private client: MongoClient) {}

  async getAvailableTickets(eventId: string): Promise<Ticket[]> {
    const collection = this.client.db('easyPass').collection('tickets');
    const tickets = await collection.find({ eventId, status: 'AVAILABLE' }).toArray();
    return tickets.map(t => new Ticket(t.id, t.eventId, t.userId, t.status));
  }

  async updateTicket(ticket: Ticket): Promise<void> {
    const collection = this.client.db('easyPass').collection('tickets');
    await collection.updateOne({ id: ticket.id }, { $set: { ...ticket } });
  }
}