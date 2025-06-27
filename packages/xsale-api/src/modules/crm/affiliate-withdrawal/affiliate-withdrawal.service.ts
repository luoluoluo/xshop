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
  CreateAffiliateWithdrawalInput,
  AffiliateWithdrawalPagination,
  AffiliateWithdrawalWhereInput,
} from './affiliate-withdrawal.dto';
import { Affiliate } from '@/entities/affiliate.entity';

/**
 * Service for managing affiliate withdrawals
 * Handles withdrawal creation, listing, and retrieval operations
 */
@Injectable()
export class AffiliateWithdrawalService {
  constructor(
    @InjectRepository(AffiliateWithdrawal)
    private withdrawalRepository: Repository<AffiliateWithdrawal>,
    @InjectRepository(Affiliate)
    private affiliateRepository: Repository<Affiliate>,
    private dataSource: DataSource,
  ) {}

  /**
   * Create a new withdrawal request
   * Uses transaction to ensure atomicity between balance deduction and withdrawal creation
   * @param createAffiliateWithdrawalInput - AffiliateWithdrawal details
   * @param affiliateId - ID of the affiliate making the withdrawal
   * @returns Promise<AffiliateWithdrawal> - Created withdrawal record
   */
  async create(
    createAffiliateWithdrawalInput: CreateAffiliateWithdrawalInput,
    affiliateId: string,
  ): Promise<AffiliateWithdrawal> {
    return this.dataSource.transaction(async (manager) => {
      const affiliate = await manager.findOne(Affiliate, {
        where: { id: affiliateId },
      });

      if (!affiliate) {
        throw new NotFoundException('Affiliate not found');
      }

      if (affiliate.balance < createAffiliateWithdrawalInput.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      affiliate.balance -= createAffiliateWithdrawalInput.amount;
      await manager.save(Affiliate, affiliate);

      const withdrawal = manager.create(AffiliateWithdrawal, {
        ...createAffiliateWithdrawalInput,
        affiliateId,
        status: AffiliateWithdrawalStatus.CREATED,
      });

      return manager.save(AffiliateWithdrawal, withdrawal);
    });
  }

  /**
   * Find all withdrawals for a affiliate with pagination
   * @param params - Search parameters including pagination and filters
   * @returns Promise<AffiliateWithdrawalPagination> - Paginated withdrawal results
   */
  async findAll({
    skip,
    take,
    where = {},
    affiliateId,
  }: {
    skip?: number;
    take?: number;
    where?: AffiliateWithdrawalWhereInput;
    affiliateId?: string;
  }): Promise<AffiliateWithdrawalPagination> {
    const [items, total] = await this.withdrawalRepository.findAndCount({
      where: {
        ...where,
        affiliateId,
      },
      skip,
      take,
    });

    return {
      data: items,
      total,
    };
  }

  /**
   * Find a specific withdrawal by ID for a affiliate
   * @param id - AffiliateWithdrawal ID
   * @param affiliateId - Affiliate ID to ensure ownership
   * @returns Promise<AffiliateWithdrawal> - AffiliateWithdrawal record
   */
  async findOne(id: string, affiliateId: string): Promise<AffiliateWithdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id, affiliateId },
    });

    if (!withdrawal) {
      throw new NotFoundException('AffiliateWithdrawal not found');
    }

    return withdrawal;
  }
}
