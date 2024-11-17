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
// src/infrastructure/input/TicketController.ts
const express_1 = __importDefault(require("express"));
const BuyTicket_1 = require("../../core/app/BuyTicket");
const InMemoryTicketRepository_1 = require("../output/InMemoryTicketRepository");
const InMemoryEventRepository_1 = require("../output/InMemoryEventRepository");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const ticketRepo = new InMemoryTicketRepository_1.InMemoryTicketRepository(path_1.default.resolve(__dirname, '../../data/tickets.json'));
const eventRepo = new InMemoryEventRepository_1.InMemoryEventRepository(path_1.default.resolve(__dirname, '../../data/events.json'));
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield eventRepo.loadEvents(); // Cargar eventos desde el archivo JSON
    const buyTicket = new BuyTicket_1.BuyTicket(ticketRepo, eventRepo);
    app.post('/buy-ticket', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { eventId } = req.body;
            const ticketId = yield buyTicket.execute(eventId);
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
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../frontend/build')));
    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}))();
