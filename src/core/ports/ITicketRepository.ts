// src/core/ports/ITicketRepository.ts
import { Ticket } from '../domain/Ticket';

export interface ITicketRepository {
  getAvailableTickets(eventId: string): Promise<Ticket[]>;
  getTicketsByEventId(eventId: string): Promise<Ticket[]>;
  addTicket(ticket: Ticket): Promise<void>;
}