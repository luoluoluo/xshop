import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Withdrawal } from '@/entities/withdrawal.entity';
import { WithdrawalStatus } from '@/types/withdrawal-status';
import { WithdrawalWhereInput, WithdrawalPagination } from './withdrawal.dto';

/**
 * Service for managing withdrawal administration
 * Handles withdrawal approval, rejection, completion, and listing operations
 */
@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
    private dataSource: DataSource,
  ) {}

  /**
   * Find all withdrawals with pagination and optional filtering
   * @param params - Search parameters including pagination and filters
   * @returns Promise<WithdrawalPagination> - Paginated withdrawal results
   */
  async findAll({
    skip,
    take,
    where = {},
  }: {
    skip?: number;
    take?: number;
    where?: WithdrawalWhereInput;
  }): Promise<WithdrawalPagination> {
    const [items, total] = await this.withdrawalRepository.findAndCount({
      where,
      skip,
      take,
      relations: { user: true },
    });

    return {
      data: items,
      total,
    };
  }

  /**
   * Find a specific withdrawal by ID
   * @param id - Withdrawal ID
   * @returns Promise<Withdrawal> - Withdrawal record with relations
   */
  async findOne(id: string): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    return withdrawal;
  }

  /**
   * Complete an approved withdrawal
   * @param id - Withdrawal ID
   * @returns Promise<Withdrawal> - Completed withdrawal record
   */
  async complete(id: string): Promise<Withdrawal> {
    return this.dataSource.transaction(async (manager) => {
      const withdrawal = await manager.findOne(Withdrawal, {
        where: { id },
        relations: { user: true },
      });

      if (!withdrawal) {
        throw new NotFoundException('Withdrawal not found');
      }

      if (withdrawal.status !== WithdrawalStatus.CREATED) {
        throw new BadRequestException(
          'Only created withdrawals can be completed',
        );
      }

      withdrawal.status = WithdrawalStatus.COMPLETED;
      withdrawal.completedAt = new Date();

      return manager.save(Withdrawal, withdrawal);
    });
  }
}
