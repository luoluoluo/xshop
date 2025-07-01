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
  CreateMerchantWithdrawalInput,
  MerchantWithdrawalPagination,
  MerchantWithdrawalWhereInput,
} from './merchant-withdrawal.dto';
import { Merchant } from '@/entities/merchant.entity';

/**
 * Service for managing merchant withdrawals
 * Handles withdrawal creation, listing, and retrieval operations for merchants
 */
@Injectable()
export class MerchantWithdrawalService {
  constructor(
    @InjectRepository(MerchantWithdrawal)
    private withdrawalRepository: Repository<MerchantWithdrawal>,
    private dataSource: DataSource,
  ) {}

  /**
   * Create a new withdrawal request for a merchant
   * Uses transaction to ensure atomicity between balance deduction and withdrawal creation
   * @param createMerchantWithdrawalInput - MerchantWithdrawal details
   * @param merchantId - ID of the merchant making the withdrawal
   * @returns Promise<MerchantWithdrawal> - Created withdrawal record
   */
  async create(
    createMerchantWithdrawalInput: CreateMerchantWithdrawalInput,
    merchantId: string,
  ): Promise<MerchantWithdrawal> {
    return this.dataSource.transaction(async (manager) => {
      // 判断是否有提现中的
      const historyWithdrawal = await manager.findOne(MerchantWithdrawal, {
        where: {
          merchantId,
          status: MerchantWithdrawalStatus.CREATED,
        },
      });

      if (historyWithdrawal) {
        throw new BadRequestException('有提现中的订单，请等待提现完成');
      }

      const merchant = await manager.findOne(Merchant, {
        where: { id: merchantId },
      });

      if (!merchant) {
        throw new NotFoundException('商家不存在');
      }

      if (merchant.balance < createMerchantWithdrawalInput.amount) {
        throw new BadRequestException('余额不足');
      }

      // 判断和商户绑定的银行卡是否一致
      if (merchant.bankAccount !== createMerchantWithdrawalInput.bankAccount) {
        throw new BadRequestException(
          '提现账户和上次提现账户不一致，为了你的资金安全，请联系管理员处理',
        );
      }

      // 保存提现账户到商户
      merchant.bankAccount = createMerchantWithdrawalInput.bankAccount;
      merchant.bankName = createMerchantWithdrawalInput.bankName;
      merchant.accountName = createMerchantWithdrawalInput.accountName;

      merchant.balance -= createMerchantWithdrawalInput.amount;
      await manager.save(Merchant, merchant);

      const withdrawal = manager.create(MerchantWithdrawal, {
        ...createMerchantWithdrawalInput,
        merchantId,
        status: MerchantWithdrawalStatus.CREATED,
      });

      return manager.save(MerchantWithdrawal, withdrawal);
    });
  }

  /**
   * Find all withdrawals for a merchant with pagination
   * @param params - Search parameters including pagination and filters
   * @returns Promise<MerchantWithdrawalPagination> - Paginated withdrawal results
   */
  async findAll({
    skip,
    take,
    where = {},
    merchantId,
  }: {
    skip?: number;
    take?: number;
    where?: MerchantWithdrawalWhereInput;
    merchantId?: string;
  }): Promise<MerchantWithdrawalPagination> {
    const [items, total] = await this.withdrawalRepository.findAndCount({
      where: {
        ...where,
        merchantId,
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
   * Find a specific withdrawal by ID for a merchant
   * @param id - MerchantWithdrawal ID
   * @param merchantId - Merchant ID to ensure ownership
   * @returns Promise<MerchantWithdrawal> - MerchantWithdrawal record
   */
  async findOne(id: string, merchantId: string): Promise<MerchantWithdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id, merchantId },
    });

    if (!withdrawal) {
      throw new NotFoundException('MerchantWithdrawal not found');
    }

    return withdrawal;
  }
}
