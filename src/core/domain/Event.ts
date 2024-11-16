// src/core/domain/Event.ts
export class Event {
    constructor(
      public id: string,
      public title: string,
      public date: string,
      public description: string,
      public quota: number
    ) {}
  }