"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
// src/core/domain/Ticket.ts
class Ticket {
    constructor(id, eventId, status = 'AVAILABLE') {
        this.id = id;
        this.eventId = eventId;
        this.status = status;
    }
}
exports.Ticket = Ticket;
