"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyTicket = void 0;
const Ticket_1 = require("../domain/Ticket");
const uuid_1 = require("uuid");
class BuyTicket {
    constructor(ticketRepository, eventRepository) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
    }
    execute(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = yield this.eventRepository.getEventById(eventId);
            if (!event) {
                throw new Error('Event not found');
            }
            const tickets = yield this.ticketRepository.getTicketsByEventId(eventId);
            if (tickets.length >= event.quota) {
                throw new Error('No tickets available for this event');
            }
            const ticket = new Ticket_1.Ticket((0, uuid_1.v4)(), eventId, 'SOLD');
            yield this.ticketRepository.addTicket(ticket);
            return ticket.id;
        });
    }
}
exports.BuyTicket = BuyTicket;
