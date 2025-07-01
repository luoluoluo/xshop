import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Role } from '@/entities/role.entity';
import { RolePagination, RoleWhereInput } from './role.dto';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
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
    where?: RoleWhereInput;
  }): Promise<RolePagination> {
    const [items, total] = await this.roleRepository.findAndCount({
      where,
      skip,
      take,
    });

    return {
      data: items,
      total,
    };
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException(`角色ID ${id} 未找到`);
    }
    return role;
  }

  async create(createRoleDto: {
    name: string;
    permissions?: string[];
    isActive?: boolean;
  }): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });
    if (existingRole) {
      throw new ConflictException('該角色名稱已存在');
    }

    try {
      const role = this.roleRepository.create(createRoleDto);
      return this.roleRepository.save(role);
    } catch (err) {
      this.logger.error('創建角色失敗', {
        error: err,
        createRoleDto,
      });
      throw new InternalServerErrorException('創建角色失敗');
    }
  }

  async update(
    id: string,
    updateRoleDto: {
      name?: string;
      permissions?: string[];
      isActive?: boolean;
    },
  ): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });
      if (existingRole) {
        throw new ConflictException('該角色名稱已存在');
      }
    }

    try {
      Object.assign(role, updateRoleDto);
      return this.roleRepository.save(role);
    } catch (err) {
      this.logger.error('更新角色失敗', {
        error: err,
        roleId: id,
        updateRoleDto,
      });
      throw new InternalServerErrorException('更新角色失敗');
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`角色ID ${id} 未找到`);
    }
    return true;
  }
}
