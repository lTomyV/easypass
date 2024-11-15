// src/core/ports/ITicketRepository.ts
import { Ticket } from '../domain/Ticket';

export interface ITicketRepository {
  getAvailableTickets(eventId: string): Promise<Ticket[]>;
  updateTicket(ticket: Ticket): Promise<void>;
}
