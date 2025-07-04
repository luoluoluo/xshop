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
      // 判断是否有提现中的
      const historyWithdrawal = await manager.findOne(AffiliateWithdrawal, {
        where: {
          affiliateId,
          status: AffiliateWithdrawalStatus.CREATED,
        },
      });

      if (historyWithdrawal) {
        throw new BadRequestException('有提现中的订单，请等待提现完成');
      }

      const affiliate = await manager.findOne(Affiliate, {
        where: { id: affiliateId },
      });

      if (!affiliate) {
        throw new NotFoundException('推广者不存在');
      }

      if (affiliate.balance < createAffiliateWithdrawalInput.amount) {
        throw new BadRequestException('余额不足');
      }
      // 判断和商户绑定的银行卡是否一致
      if (
        affiliate.bankAccount !== createAffiliateWithdrawalInput.bankAccount
      ) {
        throw new BadRequestException(
          '提现账户和上次提现账户不一致，为了你的资金安全，请联系管理员处理',
        );
      }

      // 保存提现账户到商户
      affiliate.bankAccount = createAffiliateWithdrawalInput.bankAccount;
      affiliate.bankName = createAffiliateWithdrawalInput.bankName;
      affiliate.accountName = createAffiliateWithdrawalInput.accountName;

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
