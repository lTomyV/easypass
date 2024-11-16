// src/core/ports/IEventRepository.ts
import { Event } from '../domain/Event';

export interface IEventRepository {
  getEvents(): Promise<Event[]>;
  getEventById(eventId: string): Promise<Event | undefined>;
}