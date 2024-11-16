// src/infrastructure/output/InMemoryEventRepository.ts
import { promises as fs } from 'fs';
import { Event } from '../../core/domain/Event';

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

  async getEventById(eventId: string): Promise<Event | undefined> {
    return this.events.find(event => event.id === eventId);
  }
}