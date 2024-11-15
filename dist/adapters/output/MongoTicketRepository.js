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
exports.MongoTicketRepository = void 0;
const Ticket_1 = require("../../core/domain/Ticket");
class MongoTicketRepository {
    constructor(client) {
        this.client = client;
    }
    getAvailableTickets(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.client.db('easyPass').collection('tickets');
            const tickets = yield collection.find({ eventId, status: 'AVAILABLE' }).toArray();
            return tickets.map(t => new Ticket_1.Ticket(t.id, t.eventId, t.userId, t.status));
        });
    }
    updateTicket(ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = this.client.db('easyPass').collection('tickets');
            yield collection.updateOne({ id: ticket.id }, { $set: Object.assign({}, ticket) });
        });
    }
}
exports.MongoTicketRepository = MongoTicketRepository;
