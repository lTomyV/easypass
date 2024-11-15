// src/core/domain/Ticket.ts
export class Ticket {
    constructor(
      public id: string,
      public eventId: string,
      public userId: string,
      public status: 'AVAILABLE' | 'SOLD',
    ) {}
  }