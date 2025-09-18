import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsRelations, Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { User } from '@/entities/user.entity';
import {
  CreateUserInput,
  CreateUserWechatMerchantInput,
  UpdateMeInput,
  UserPagination,
  UserWhereInput,
} from './user.dto';
import { WechatService } from '@/modules/_common/wechat/wechat.service';
import { WechatMerchantStatus } from '@/types/wechat-merchant-status';

const DISALLOWED_SLUGS = [
  'admin',
  'creator',
  'store',
  'user',
  'withdrawal',
  'product',
  'order',
  'link',
  'setting',
  'login',
  'register',
  'admin-api',
  'creator-api',
  'store-api',
];

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly wechatService: WechatService,
  ) {}

  async findAll({
    skip,
    take,
    where = {},
  }: {
    skip?: number;
    take?: number;
    where?: UserWhereInput;
  }): Promise<UserPagination> {
    const [items, total] = await this.userRepository.findAndCount({
      where,
      skip,
      take,
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(
    id: string,
    options?: {
      relations?: FindOptionsRelations<User>;
      order?: FindOptionsOrder<User>;
    },
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ id }, { slug: id }],
      relations: options?.relations,
      order: options?.order,
    });
    if (!user) {
      throw new NotFoundException(`用戶ID ${id} 未找到`);
    }
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { phone },
    });
  }

  async findByWechatOpenId(wechatOpenId: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { wechatOpenId },
    });
  }

  async create(createUserDto: CreateUserInput): Promise<User> {
    if (createUserDto.phone) {
      const existingUser = await this.findByPhone(createUserDto.phone);
      if (existingUser) {
        throw new ConflictException('手机号已被注册');
      }
    }

    try {
      let password: string | undefined;
      if (createUserDto.password) {
        password = await hash(createUserDto.password, 10);
      }
      const user = this.userRepository.create({
        ...createUserDto,
        password,
      });
      return this.userRepository.save(user);
    } catch (err) {
      this.logger.error('創建用戶失敗', {
        error: err,
        createDto: createUserDto,
      });
      throw new InternalServerErrorException('創建用戶失敗');
    }
  }

  async update(id: string, updateUserDto: UpdateMeInput): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`用戶ID ${id} 未找到`);
    }
    if (updateUserDto.slug && updateUserDto.slug !== user.slug) {
      if (DISALLOWED_SLUGS.includes(updateUserDto.slug)) {
        throw new ConflictException('主页链接重复，请修改主页链接');
      }
      const existingUser = await this.userRepository.findOne({
        where: { slug: updateUserDto.slug },
      });
      if (existingUser) {
        throw new ConflictException('主页链接重复，请修改主页链接');
      }
    }
    try {
      Object.assign(user, updateUserDto);
      return this.userRepository.save(user);
    } catch (err) {
      this.logger.error('更新用戶失敗', {
        error: err,
        userId: id,
        updateDto: updateUserDto,
      });
      throw new InternalServerErrorException('更新用戶失敗');
    }
  }

  async validateUser(phone: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByPhone(phone);
      if (!user) return null;
      const isPasswordValid = await compare(password, user?.password || '');
      if (!isPasswordValid) return null;

      const { password: _, ...result } = user;
      return result as User;
    } catch (err) {
      this.logger.error('驗證用戶失敗', {
        error: err,
        phone,
      });
      throw new InternalServerErrorException('驗證用戶失敗');
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`用戶ID ${id} 未找到`);
    }
    return true;
  }

  async updateWechatOAuth(id: string, code: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`用戶ID ${id} 未找到`);
    }
    // 获取微信用户信息
    const wechatAccessToken =
      await this.wechatService.getOauthAccessToken(code);
    if (wechatAccessToken.errcode) {
      throw new Error(wechatAccessToken.errmsg);
    }
    if (!user.wechatOpenId) {
      user.wechatOpenId = wechatAccessToken.openid;
    }

    await this.userRepository.save(user);
    return this.findOne(id);
  }

  async createUserWechatMerchant(
    id: string,
    data: CreateUserWechatMerchantInput,
  ): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`用戶ID ${id} 未找到`);
    }
    user.wechatMerchantId = data.bankAccountNumber;
    user.bankAccountNumber = data.bankAccountNumber;
    user.businessLicensePhoto = data.businessLicensePhoto;
    user.idCardFrontPhoto = data.idCardFrontPhoto;
    user.idCardBackPhoto = data.idCardBackPhoto;
    user.wechatMerchantStatus = WechatMerchantStatus.CREATED;
    await this.userRepository.save(user);
    return this.findOne(id);
  }
}
