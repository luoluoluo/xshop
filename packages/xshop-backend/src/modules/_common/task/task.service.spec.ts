import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskService } from './task.service';
import { Order, OrderStatus } from '@/entities/order.entity';

describe('TaskService', () => {
  let service: TaskService;
  let mockOrderRepository: Partial<Repository<Order>>;

  beforeEach(async () => {
    mockOrderRepository = {
      find: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cancelExpiredOrders', () => {
    it('should cancel expired orders', async () => {
      // Arrange
      const mockExpiredOrders: Partial<Order>[] = [
        {
          id: '1',
          code: 'ORD-001',
          status: OrderStatus.CREATED,
          createdAt: new Date(Date.now() - 40 * 60 * 1000), // 40 minutes ago
        },
        {
          id: '2',
          code: 'ORD-002',
          status: OrderStatus.CREATED,
          createdAt: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
        },
      ];

      jest
        .spyOn(mockOrderRepository, 'find')
        .mockResolvedValue(mockExpiredOrders as Order[]);
      jest
        .spyOn(mockOrderRepository, 'update')
        .mockResolvedValue({ affected: 2 } as any);

      // Act
      await service.cancelExpiredOrders();

      // Assert
      expect(mockOrderRepository.find).toHaveBeenCalledWith({
        where: {
          status: OrderStatus.CREATED,
          createdAt: expect.any(Date),
        },
      });

      expect(mockOrderRepository.update).toHaveBeenCalledWith(['1', '2'], {
        status: OrderStatus.CANCELLED,
        cancelledAt: expect.any(Date),
      });
    });

    it('should not cancel any orders if no expired orders found', async () => {
      // Arrange
      jest.spyOn(mockOrderRepository, 'find').mockResolvedValue([]);

      // Act
      await service.cancelExpiredOrders();

      // Assert
      expect(mockOrderRepository.find).toHaveBeenCalled();
      expect(mockOrderRepository.update).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Arrange
      const mockError = new Error('Database error');
      jest.spyOn(mockOrderRepository, 'find').mockRejectedValue(mockError);
      const loggerSpy = jest
        .spyOn(service['logger'], 'error')
        .mockImplementation();

      // Act
      await service.cancelExpiredOrders();

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Failed to cancel expired orders',
        mockError,
      );
    });
  });
});
