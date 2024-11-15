// src/tests/BuyTicket.test.ts
import { BuyTicket } from '../core/usecases/BuyTicket';
import { Ticket } from '../core/domain/Ticket';

test('Should buy a ticket when available', async () => {
  const mockRepo = {
    getAvailableTickets: jest.fn().mockResolvedValue([
      new Ticket('1', 'event1', '', 'AVAILABLE'),
    ]),
    updateTicket: jest.fn(),
  };

  const buyTicket = new BuyTicket(mockRepo);
  const ticketId = await buyTicket.execute('user1', 'event1');

  expect(ticketId).toBe('1');
  expect(mockRepo.updateTicket).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user1', status: 'SOLD' }));
});
