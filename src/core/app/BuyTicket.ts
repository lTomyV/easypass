// src/core/app/BuyTicket.ts
import { ITicketRepository } from '../ports/ITicketRepository';
import { IEventRepository } from '../ports/IEventRepository';
import { Ticket } from '../domain/Ticket';
import { v4 as uuidv4 } from 'uuid';

export class BuyTicket {
  constructor(
    private ticketRepository: ITicketRepository,
    private eventRepository: IEventRepository
  ) {}

  async execute(eventId: string): Promise<string> {
    const event = await this.eventRepository.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const tickets = await this.ticketRepository.getTicketsByEventId(eventId);
    if (tickets.length >= event.quota) {
      throw new Error('No tickets available for this event');
    }

    const ticket = new Ticket(uuidv4(), eventId, 'SOLD');
    await this.ticketRepository.addTicket(ticket);

    return ticket.id;
  }
}