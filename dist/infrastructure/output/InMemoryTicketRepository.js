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
exports.InMemoryTicketRepository = void 0;
const fs_1 = require("fs");
class InMemoryTicketRepository {
    constructor(filePath) {
        this.tickets = [];
        this.filePath = filePath;
        this.loadTickets();
    }
    loadTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fs_1.promises.readFile(this.filePath, 'utf-8');
                this.tickets = JSON.parse(data);
            }
            catch (error) {
                this.tickets = [];
            }
        });
    }
    saveTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(this.tickets, null, 2);
            yield fs_1.promises.writeFile(this.filePath, data, 'utf-8');
        });
    }
    getTicketsByEventId(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tickets.filter(ticket => ticket.eventId === eventId);
        });
    }
    addTicket(ticket) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tickets.push(ticket);
            yield this.saveTickets();
        });
    }
}
exports.InMemoryTicketRepository = InMemoryTicketRepository;
