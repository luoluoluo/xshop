import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { User } from '@/entities/user.entity';
import {
  CreateUserInput,
  UpdateUserInput,
  UserPagination,
  UserWhereInput,
} from './user.dto';
import { Role } from '@/entities/role.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
      relations: ['roles'],
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
    if (!user) {
      throw new NotFoundException(`用戶ID ${id} 未找到`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: { roles: true },
    });
  }

  async create(createUserDto: CreateUserInput): Promise<User> {
    if (createUserDto.email) {
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException('改邮箱已被注册');
      }
    }

    try {
      let password: string | undefined;
      if (createUserDto.password) {
        password = await hash(createUserDto.password, 10);
      }
      const roles = await this.roleRepository.find({
        where: { id: In(createUserDto.roleIds || []) },
      });
      const user = this.userRepository.create({
        ...createUserDto,
        password,
        roles,
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

  async update(id: string, updateUserDto: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    try {
      if (updateUserDto.password) {
        const hashedPassword: string = await hash(updateUserDto.password, 10);
        updateUserDto.password = hashedPassword;
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.findByEmail(updateUserDto.email);
        if (existingUser) {
          throw new ConflictException('改邮箱已被注册');
        }
      }

      const roles = await this.roleRepository.find({
        where: { id: In(updateUserDto.roleIds || []) },
      });

      Object.assign(user, updateUserDto, { roles });
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

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;
      const isPasswordValid = await compare(password, user?.password || '');
      if (!isPasswordValid) return null;

      const { password: _, ...result } = user;
      return result as User;
    } catch (err) {
      this.logger.error('驗證用戶失敗', {
        error: err,
        email,
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
}
