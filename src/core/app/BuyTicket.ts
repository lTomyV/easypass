// src/core/app/BuyTicket.ts
import { ITicketRepository } from '../ports/ITicketRepository';

export class BuyTicket {
  constructor(private ticketRepository: ITicketRepository) {}

  async execute(userId: string, eventId: string): Promise<string> {
    const tickets = await this.ticketRepository.getAvailableTickets(eventId);
    if (tickets.length === 0) throw new Error('No tickets available');

    const ticket = tickets[0];
    ticket.status = 'SOLD';
    ticket.userId = userId;

    await this.ticketRepository.updateTicket(ticket);
    return ticket.id;
  }
}
