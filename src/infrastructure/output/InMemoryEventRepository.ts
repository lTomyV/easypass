// src/infrastructure/output/InMemoryEventRepository.ts
import { promises as fs } from 'fs';
import { Event } from '../../core/domain/Event';
import { NIL } from 'uuid';

export class InMemoryEventRepository {
  private events: Event[] = [];

  constructor(private filePath: string) {}

  async loadEvents(): Promise<void> {
    const data = await fs.readFile(this.filePath, 'utf-8');
    this.events = JSON.parse(data);
  }

  async getEvents(): Promise<Event[]> {
    return this.events;
  }

  async getEventById(eventId: string): Promise<Event> {
    const event = this.events.find(event => event.id === eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }
    return event;
  }
}