// src/infrastructure/output/InMemoryTicketRepository.ts
import { ITicketRepository } from '../../core/ports/ITicketRepository';
import { Ticket } from '../../core/domain/Ticket';
import { promises as fs } from 'fs';
import path from 'path';

export class InMemoryTicketRepository implements ITicketRepository {
  private tickets: Ticket[] = [];
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.loadTickets();
  }

  private async loadTickets(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      this.tickets = JSON.parse(data);
    } catch (error) {
      this.tickets = [];
    }
  }

  private async saveTickets(): Promise<void> {
    const data = JSON.stringify(this.tickets, null, 2);
    await fs.writeFile(this.filePath, data, 'utf-8');
  }

  async getTicketsByEventId(eventId: string): Promise<Ticket[]> {
    return this.tickets.filter(ticket => ticket.eventId === eventId);
  }

  async addTicket(ticket: Ticket): Promise<void> {
    this.tickets.push(ticket);
    await this.saveTickets();
  }
}