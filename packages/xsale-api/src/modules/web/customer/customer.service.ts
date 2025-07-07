import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { Customer } from '@/entities/customer.entity';
import { UpdateMeInput } from '../auth/auth.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('客戶未找到');
    }

    return customer;
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({
      where: { phone },
    });
  }

  async create(createCustomerDto: {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  }): Promise<Customer> {
    if (createCustomerDto.phone) {
      const existingCustomer = await this.findByPhone(createCustomerDto.phone);
      if (existingCustomer) {
        throw new ConflictException('该手机号已被注册');
      }
    }

    try {
      const customer = this.customerRepository.create(createCustomerDto);
      const savedCustomer = await this.customerRepository.save(customer);
      return savedCustomer;
    } catch (err) {
      this.logger.error(`創建客戶失敗`, {
        error: err,
        createDto: createCustomerDto,
      });
      throw new InternalServerErrorException('創建客戶失敗');
    }
  }

  async update(
    id: string,
    updateCustomerDto: UpdateMeInput,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException('客戶未找到');
    }

    try {
      if (
        updateCustomerDto.phone &&
        updateCustomerDto.phone !== customer.phone
      ) {
        const existingCustomer = await this.findByPhone(
          updateCustomerDto.phone,
        );
        if (existingCustomer) {
          throw new ConflictException('该手机号已注册');
        }
      }

      Object.assign(customer, updateCustomerDto);
      const savedCustomer = await this.customerRepository.save(customer);
      return savedCustomer;
    } catch (err) {
      this.logger.error(`更新客戶失敗`, {
        error: err,
        customerId: id,
        updateDto: updateCustomerDto,
      });
      if (err instanceof ConflictException) {
        throw err;
      }
      throw new InternalServerErrorException('更新客戶失敗');
    }
  }
}
