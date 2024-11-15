"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
// src/core/domain/Ticket.ts
class Ticket {
    constructor(id, eventId, userId, status) {
        this.id = id;
        this.eventId = eventId;
        this.userId = userId;
        this.status = status;
    }
}
exports.Ticket = Ticket;
