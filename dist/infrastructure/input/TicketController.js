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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BuyTicket_1 = require("../../core/app/BuyTicket");
const InMemoryTicketRepository_1 = require("../output/InMemoryTicketRepository");
const InMemoryEventRepository_1 = require("../output/InMemoryEventRepository");
const Ticket_1 = require("../../core/domain/Ticket");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const ticketRepo = new InMemoryTicketRepository_1.InMemoryTicketRepository(path_1.default.resolve(__dirname, '../../data/tickets.json'));
const eventRepo = new InMemoryEventRepository_1.InMemoryEventRepository(path_1.default.resolve(__dirname, '../../data/events.json'));
// Lista en memoria para rastrear los tickets reservados
const reservedTickets = {};
const reservationTimers = {};
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield eventRepo.loadEvents(); // Cargar eventos desde el archivo JSON
    const buyTicket = new BuyTicket_1.BuyTicket(ticketRepo, eventRepo);
    app.post('/buy-ticket', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { eventId } = req.body;
            const ticketId = yield buyTicket.execute(eventId);
            console.log(`Ticket comprado: ${ticketId} para el evento ${eventId}`);
            res.status(200).json({ success: true, ticketId });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ success: false, message: error.message });
            }
            else {
                res.status(400).json({ success: false, message: 'Unknown error occurred' });
            }
        }
    }));
    app.get('/api/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const events = yield eventRepo.getEvents();
            res.status(200).json(events);
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to fetch events' });
        }
    }));
    app.get('/api/events/:eventId/availability', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { eventId } = req.params;
            const tickets = yield ticketRepo.getTicketsByEventId(eventId);
            const event = yield eventRepo.getEventById(eventId);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            const soldTickets = tickets.filter(ticket => ticket.status === 'SOLD').length;
            const reservedCount = reservedTickets[eventId] || 0;
            const availableTickets = event.quota - soldTickets - reservedCount;
            console.log(`Disponibilidad para el evento ${eventId}: ${availableTickets} tickets`);
            res.status(200).json({ success: true, availableTickets });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to check availability' });
        }
    }));
    app.post('/api/events/:eventId/reserve', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { eventId } = req.params;
            const { email, birthdate } = req.body;
            const tickets = yield ticketRepo.getTicketsByEventId(eventId);
            const event = yield eventRepo.getEventById(eventId);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            const soldTickets = tickets.filter(ticket => ticket.status === 'SOLD').length;
            const reservedCount = reservedTickets[eventId] || 0;
            const availableTickets = event.quota - soldTickets - reservedCount;
            if (availableTickets <= 0) {
                return res.status(400).json({ success: false, message: 'No tickets available' });
            }
            reservedTickets[eventId] = reservedCount + 1;
            const ticketId = (0, uuid_1.v4)();
            console.log(`Ticket reservado: ${ticketId} para el evento ${eventId}`);
            reservationTimers[ticketId] = setTimeout(() => {
                reservedTickets[eventId] = reservedTickets[eventId] - 1;
                delete reservationTimers[ticketId];
                console.log(`Reserva expirada: ${ticketId} para el evento ${eventId}`);
            }, 10 * 60 * 1000); // 10 minutos
            res.status(200).json({ success: true, ticketId });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to reserve ticket' });
        }
    }));
    app.post('/api/events/:eventId/buy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { eventId } = req.params;
            const { email, birthdate } = req.body;
            const tickets = yield ticketRepo.getTicketsByEventId(eventId);
            const event = yield eventRepo.getEventById(eventId);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            const soldTickets = tickets.filter(ticket => ticket.status === 'SOLD').length;
            const reservedCount = reservedTickets[eventId] || 0;
            const availableTickets = event.quota - soldTickets - reservedCount;
            if (availableTickets <= 0) {
                return res.status(400).json({ success: false, message: 'No tickets available' });
            }
            const ticket = new Ticket_1.Ticket((0, uuid_1.v4)(), eventId, 'SOLD');
            yield ticketRepo.addTicket(ticket);
            reservedTickets[eventId] = reservedCount > 0 ? reservedCount - 1 : 0;
            console.log(`Ticket comprado: ${ticket.id} para el evento ${eventId}`);
            res.status(200).json({ success: true, ticketId: ticket.id });
        }
        catch (error) {
            res.status(500).json({ success: false, message: 'Failed to buy ticket' });
        }
    }));
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../../../frontend/build', 'index.html'));
    });
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}))();
