// src/infrastructure/output/InMemoryTicketRepository.ts
import { ITicketRepository } from '../../core/ports/ITicketRepository';
import { Ticket } from '../../core/domain/Ticket';

export class InMemoryTicketRepository implements ITicketRepository {
  private tickets: Ticket[] = [];

  async getAvailableTickets(eventId: string): Promise<Ticket[]> {
    return this.tickets.filter(ticket => ticket.eventId === eventId && ticket.status === 'AVAILABLE');
  }

  async updateTicket(ticket: Ticket): Promise<void> {
    const index = this.tickets.findIndex(t => t.id === ticket.id);
    if (index !== -1) {
      this.tickets[index] = ticket;
    } else {
      this.tickets.push(ticket);
    }
  }
}