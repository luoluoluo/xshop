import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  AffiliateWithdrawal,
  AffiliateWithdrawalStatus,
} from '@/entities/affiliate-withdrawal.entity';
import {
  AffiliateWithdrawalWhereInput,
  AffiliateWithdrawalPagination,
} from './affiliate-withdrawal.dto';
import { Affiliate } from '@/entities/affiliate.entity';

/**
 * Service for managing withdrawal administration
 * Handles withdrawal approval, rejection, completion, and listing operations
 */
@Injectable()
export class AffiliateWithdrawalService {
  constructor(
    @InjectRepository(AffiliateWithdrawal)
    private affiliateWithdrawalRepository: Repository<AffiliateWithdrawal>,
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
    where?: AffiliateWithdrawalWhereInput;
  }): Promise<AffiliateWithdrawalPagination> {
    const [items, total] =
      await this.affiliateWithdrawalRepository.findAndCount({
        where,
        skip,
        take,
        relations: { affiliate: true },
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
  async findOne(id: string): Promise<AffiliateWithdrawal> {
    const withdrawal = await this.affiliateWithdrawalRepository.findOne({
      where: { id },
      relations: { affiliate: true },
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
  async approve(id: string): Promise<AffiliateWithdrawal> {
    return this.dataSource.transaction(async (manager) => {
      const withdrawal = await manager.findOne(AffiliateWithdrawal, {
        where: { id },
        relations: { affiliate: true },
      });

      if (!withdrawal) {
        throw new NotFoundException('Withdrawal not found');
      }

      if (withdrawal.status !== AffiliateWithdrawalStatus.CREATED) {
        throw new BadRequestException(
          'Only pending withdrawals can be approved',
        );
      }

      withdrawal.status = AffiliateWithdrawalStatus.APPROVED;
      withdrawal.approvedAt = new Date();

      return manager.save(AffiliateWithdrawal, withdrawal);
    });
  }

  /**
   * Reject a pending withdrawal and refund the balance
   * Uses transaction to ensure atomicity between status update and balance refund
   * @param id - Withdrawal ID
   * @param rejectReason - Reason for rejection
   * @returns Promise<Withdrawal> - Rejected withdrawal record
   */
  async reject(
    id: string,
    rejectReason?: string,
  ): Promise<AffiliateWithdrawal> {
    return this.dataSource.transaction(async (manager) => {
      const withdrawal = await manager.findOne(AffiliateWithdrawal, {
        where: { id },
        relations: { affiliate: true },
      });

      if (!withdrawal) {
        throw new NotFoundException('Withdrawal not found');
      }

      if (withdrawal.status !== AffiliateWithdrawalStatus.CREATED) {
        throw new BadRequestException(
          'Only pending withdrawals can be rejected',
        );
      }

      withdrawal.status = AffiliateWithdrawalStatus.REJECTED;
      withdrawal.rejectedAt = new Date();
      withdrawal.rejectReason = rejectReason;

      // 退还商家余额
      const affiliate = await manager.findOne(Affiliate, {
        where: { id: withdrawal.affiliateId },
      });

      if (affiliate) {
        affiliate.balance += withdrawal.amount;
        await manager.save(Affiliate, affiliate);
      }

      return manager.save(AffiliateWithdrawal, withdrawal);
    });
  }

  /**
   * Complete an approved withdrawal
   * @param id - Withdrawal ID
   * @returns Promise<Withdrawal> - Completed withdrawal record
   */
  async complete(id: string): Promise<AffiliateWithdrawal> {
    return this.dataSource.transaction(async (manager) => {
      const withdrawal = await manager.findOne(AffiliateWithdrawal, {
        where: { id },
        relations: { affiliate: true },
      });

      if (!withdrawal) {
        throw new NotFoundException('Withdrawal not found');
      }

      if (withdrawal.status !== AffiliateWithdrawalStatus.APPROVED) {
        throw new BadRequestException(
          'Only approved withdrawals can be completed',
        );
      }

      withdrawal.status = AffiliateWithdrawalStatus.COMPLETED;
      withdrawal.completedAt = new Date();

      return manager.save(AffiliateWithdrawal, withdrawal);
    });
  }
}
