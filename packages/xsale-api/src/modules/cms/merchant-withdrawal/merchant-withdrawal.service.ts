import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  MerchantWithdrawal,
  MerchantWithdrawalStatus,
} from '@/entities/merchant-withdrawal.entity';
import {
  MerchantWithdrawalWhereInput,
  MerchantWithdrawalPagination,
} from './merchant-withdrawal.dto';
import { Merchant } from '@/entities/merchant.entity';

/**
 * Service for managing withdrawal administration
 * Handles withdrawal approval, rejection, completion, and listing operations
 */
@Injectable()
export class MerchantWithdrawalService {
  constructor(
    @InjectRepository(MerchantWithdrawal)
    private merchantWithdrawalRepository: Repository<MerchantWithdrawal>,
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
    where?: MerchantWithdrawalWhereInput;
  }): Promise<MerchantWithdrawalPagination> {
    const [items, total] = await this.merchantWithdrawalRepository.findAndCount(
      {
        where,
        skip,
        take,
        relations: { merchant: true },
      },
    );

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
  async findOne(id: string): Promise<MerchantWithdrawal> {
    const withdrawal = await this.merchantWithdrawalRepository.findOne({
      where: { id },
      relations: { merchant: true },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    return withdrawal;
  }

  /**
   * Approve a pending withdrawal
   * @param id - Withdrawal ID
   * @returns Promise<Withdrawal> - Approved withdrawal record
   */
  async approve(id: string): Promise<MerchantWithdrawal> {
    return this.dataSource.transaction(async (manager) => {
      const withdrawal = await manager.findOne(MerchantWithdrawal, {
        where: { id },
        relations: { merchant: true },
      });

      if (!withdrawal) {
        throw new NotFoundException('Withdrawal not found');
      }

      if (withdrawal.status !== MerchantWithdrawalStatus.CREATED) {
        throw new BadRequestException(
          'Only pending withdrawals can be approved',
        );
      }

      withdrawal.status = MerchantWithdrawalStatus.APPROVED;
      withdrawal.approvedAt = new Date();

      return manager.save(MerchantWithdrawal, withdrawal);
    });
  }

  /**
   * Reject a pending withdrawal and refund the balance
   * Uses transaction to ensure atomicity between status update and balance refund
   * @param id - Withdrawal ID
   * @param rejectReason - Reason for rejection
   * @returns Promise<Withdrawal> - Rejected withdrawal record
   */
  async reject(id: string, rejectReason?: string): Promise<MerchantWithdrawal> {
    return this.dataSource.transaction(async (manager) => {
      const withdrawal = await manager.findOne(MerchantWithdrawal, {
        where: { id },
        relations: { merchant: true },
      });

      if (!withdrawal) {
        throw new NotFoundException('Withdrawal not found');
      }

      if (withdrawal.status !== MerchantWithdrawalStatus.CREATED) {
        throw new BadRequestException(
          'Only pending withdrawals can be rejected',
        );
      }

      withdrawal.status = MerchantWithdrawalStatus.REJECTED;
      withdrawal.rejectedAt = new Date();
      withdrawal.rejectReason = rejectReason;

      // 退还商家余额
      const merchant = await manager.findOne(Merchant, {
        where: { id: withdrawal.merchantId },
      });

      if (merchant) {
        merchant.balance += withdrawal.amount;
        await manager.save(Merchant, merchant);
      }

      return manager.save(MerchantWithdrawal, withdrawal);
    });
  }

  /**
   * Complete an approved withdrawal
   * @param id - Withdrawal ID
   * @returns Promise<Withdrawal> - Completed withdrawal record
   */
  async complete(id: string): Promise<MerchantWithdrawal> {
    return this.dataSource.transaction(async (manager) => {
      const withdrawal = await manager.findOne(MerchantWithdrawal, {
        where: { id },
        relations: { merchant: true },
      });

      if (!withdrawal) {
        throw new NotFoundException('Withdrawal not found');
      }

      if (withdrawal.status !== MerchantWithdrawalStatus.APPROVED) {
        throw new BadRequestException(
          'Only approved withdrawals can be completed',
        );
      }

      withdrawal.status = MerchantWithdrawalStatus.COMPLETED;
      withdrawal.completedAt = new Date();

      return manager.save(MerchantWithdrawal, withdrawal);
    });
  }
}
