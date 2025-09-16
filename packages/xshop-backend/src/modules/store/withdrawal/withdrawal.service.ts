import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Withdrawal } from '@/entities/withdrawal.entity';
import {
  CreateWithdrawalInput,
  WithdrawalPagination,
  WithdrawalWhereInput,
} from './withdrawal.dto';
import { WithdrawalStatus } from '@/types/withdrawal-status';
import { User } from '@/entities/user.entity';
import { WITHDRAWAL_TAX_PERCENTAGE } from '@/core/constants';

/**
 * Service for managing merchant withdrawals
 * Handles withdrawal creation, listing, and retrieval operations for merchants
 */
@Injectable()
export class WithdrawalService {
  constructor(
    @InjectRepository(Withdrawal)
    private withdrawalRepository: Repository<Withdrawal>,
    private dataSource: DataSource,
  ) {}

  /**
   * Create a new withdrawal request for a merchant
   * Uses transaction to ensure atomicity between balance deduction and withdrawal creation
   * @param createWithdrawalInput - Withdrawal details
   * @param merchantId - ID of the merchant making the withdrawal
   * @returns Promise<Withdrawal> - Created withdrawal record
   */
  async create(
    createWithdrawalInput: CreateWithdrawalInput & { userId?: string },
  ): Promise<Withdrawal> {
    return this.dataSource.transaction(async (manager) => {
      // 判断是否有提现中的
      const historyWithdrawal = await manager.findOne(Withdrawal, {
        where: {
          userId: createWithdrawalInput.userId,
          status: WithdrawalStatus.CREATED,
        },
      });

      if (historyWithdrawal) {
        throw new BadRequestException('有提现中的订单，请等待提现完成');
      }

      const user = await manager.findOne(User, {
        where: { id: createWithdrawalInput.userId },
      });

      if (!user) {
        throw new NotFoundException('用户不存在');
      }

      if (!user.balance || user.balance < createWithdrawalInput.amount) {
        throw new BadRequestException('余额不足');
      }

      // 判断和商户绑定的银行卡是否一致
      if (
        user.bankAccountNumber !== createWithdrawalInput.bankAccountNumber ||
        user.bankAccountName !== createWithdrawalInput.bankAccountName
      ) {
        throw new BadRequestException(
          '提现账户和上次提现账户不一致，为了你的资金安全，请联系管理员处理',
        );
      }

      // 保存提现账户到商户
      user.bankAccountNumber = createWithdrawalInput.bankAccountNumber;
      user.bankAccountName = createWithdrawalInput.bankAccountName;

      user.balance -= createWithdrawalInput.amount;

      await manager.save(User, user);

      // 计算税费
      const taxAmount =
        (createWithdrawalInput.amount * WITHDRAWAL_TAX_PERCENTAGE) / 100;
      const afterTaxAmount = createWithdrawalInput.amount - taxAmount;

      const withdrawal = manager.create(Withdrawal, {
        ...createWithdrawalInput,
        status: WithdrawalStatus.CREATED,
        taxAmount,
        afterTaxAmount,
      });

      return manager.save(Withdrawal, withdrawal);
    });
  }

  /**
   * Find all withdrawals for a merchant with pagination
   * @param params - Search parameters including pagination and filters
   * @returns Promise<WithdrawalPagination> - Paginated withdrawal results
   */
  async findAll({
    skip,
    take,
    where,
  }: {
    skip?: number;
    take?: number;
    where?: WithdrawalWhereInput & { userId?: string };
  }): Promise<WithdrawalPagination> {
    const [items, total] = await this.withdrawalRepository.findAndCount({
      where: {
        ...where,
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
   * @param id - Withdrawal ID
   * @returns Promise<Withdrawal> - Withdrawal record
   */
  async findOne(id: string, where: { userId?: string }): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalRepository.findOne({
      where: { id, ...where },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    return withdrawal;
  }
}
