import { DataSource } from 'typeorm';
import { User } from '@/entities/user.entity';
import { Role } from '@/entities/role.entity';
import * as bcrypt from 'bcrypt';

export const adminSeed = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // const rolePermissions: string[] = [];
  // permissions.map((permission) => {
  //   permission.actions.map((action) => {
  //     rolePermissions.push(
  //       new PermissionService().stringify({
  //         resource: permission.resource,
  //         action,
  //       }),
  //     );
  //   });
  // });

  // 检查是否已存在管理员角色
  let adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
  if (!adminRole) {
    adminRole = roleRepository.create({
      name: 'admin',
      permissions: ['*'], // 所有权限
      isActive: true,
    });
    await roleRepository.save(adminRole);
  }

  // 检查是否已存在管理员用户
  const adminEmail = 'admin@xltzx.com';
  const adminPassword = '123456';
  let adminUser = await userRepository.findOne({
    where: { email: adminEmail },
  });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    adminUser = userRepository.create({
      name: 'admin',
      email: adminEmail,
      password: hashedPassword,
      roles: [adminRole],
      isActive: true,
    });
    await userRepository.save(adminUser);
  }
};
