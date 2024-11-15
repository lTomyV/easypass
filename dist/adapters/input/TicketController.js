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
// src/adapters/input/TicketController.ts
const express_1 = __importDefault(require("express"));
const BuyTicket_1 = require("../../core/usecases/BuyTicket");
const MongoTicketRepository_1 = require("../output/MongoTicketRepository");
const app = (0, express_1.default)();
const client = new MongoClient('mongodb://localhost:27017');
const ticketRepo = new MongoTicketRepository_1.MongoTicketRepository(client);
const buyTicket = new BuyTicket_1.BuyTicket(ticketRepo);
app.post('/buy-ticket', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, eventId } = req.body;
        const ticketId = yield buyTicket.execute(userId, eventId);
        res.status(200).json({ success: true, ticketId });
    }
    catch (error) {
        if (error instanceof Error) {
            // ahora TypeScript sabe que 'error' es de tipo 'Error' y tiene la propiedad 'message'
            res.status(400).json({ success: false, message: error.message });
        }
        else {
            // Si el error no es de tipo 'Error', maneja el caso aquí
            res.status(400).json({ success: false, message: 'Unknown error occurred' });
        }
    }
}));
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
