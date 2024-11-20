// src/core/ports/ITicketRepository.ts
import { Ticket } from '../domain/Ticket';

export interface ITicketRepository {
  getTicketsByEventId(eventId: string): Promise<Ticket[]>;
  addTicket(ticket: Ticket): Promise<void>;
}