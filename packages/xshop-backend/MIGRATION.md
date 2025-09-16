# 数据库迁移命令使用文档

本项目使用 TypeORM 进行数据库迁移管理。以下是所有可用的迁移命令及其使用方法。

## 快速开始

### 1. 生成迁移文件

```bash
# 基于实体变更自动生成迁移文件
npm run migration:generate --name=your-migration-name

# 示例
npm run migration:generate --name=add-user-table
npm run migration:generate --name=update-product-schema
npm run migration:generate --name=create-order-system
```

### 2. 运行迁移

```bash
# 执行所有未应用的迁移
npm run migration:run
```

### 3. 查看迁移状态

```bash
# 显示所有迁移文件及其应用状态
npm run migration:show
```

## 完整命令列表

### 迁移生成命令

#### `migration:generate`

基于实体变更自动生成迁移文件。

**语法：**

```bash
npm run migration:generate --name=<迁移名称>
```

**参数说明：**

- `--name`: 迁移文件的名称（必填）

**示例：**

```bash
# 生成用户表迁移
npm run migration:generate --name=add-user-table

# 生成产品表迁移
npm run migration:generate --name=create-product-table

# 生成订单系统迁移
npm run migration:generate --name=init-order-system
```

**生成的文件位置：**

- 迁移文件会自动生成到 `src/migrations/` 目录
- 文件名格式：`<时间戳>-<迁移名称>.ts`
- 例如：`1752246062282-add-user-table.ts`

#### `migration:create`

创建空的迁移文件（手动编写 SQL）。

**语法：**

```bash
npm run migration:create -- src/migrations/<迁移名称>
```

**示例：**

```bash
npm run migration:create -- src/migrations/custom-migration
```

### 迁移执行命令

#### `migration:run`

执行所有未应用的迁移文件。

**语法：**

```bash
npm run migration:run
```

**说明：**

- 按时间戳顺序执行迁移
- 只执行尚未应用的迁移文件
- 执行后会在数据库中记录迁移状态

#### `migration:revert`

回滚最近一次应用的迁移。

**语法：**

```bash
npm run migration:revert
```

**说明：**

- 撤销最近一次迁移的变更
- 谨慎使用，可能丢失数据
- 建议在开发环境测试

#### `migration:show`

显示所有迁移文件的状态。

**语法：**

```bash
npm run migration:show
```

**输出示例：**

```
[✓] 1752246062282-add-user-table
[ ] 1752246062283-create-product-table
[✓] 1752246062284-init-order-system
```

**状态说明：**

- `[✓]` - 已应用的迁移
- `[ ]` - 未应用的迁移

## 工作流程

### 开发新功能时的迁移流程

1. **修改实体文件**

   ```typescript
   // src/entities/user.entity.ts
   @Entity()
   export class User {
     @Column()
     email: string;

     // 新增字段
     @Column({ nullable: true })
     phone: string;
   }
   ```

2. **生成迁移文件**

   ```bash
   npm run migration:generate --name=add-user-phone
   ```

3. **检查生成的迁移文件**

   ```typescript
   // src/migrations/1752246062285-add-user-phone.ts
   export class AddUserPhone1752246062285 implements MigrationInterface {
     public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`ALTER TABLE user ADD phone varchar(255)`);
     }

     public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`ALTER TABLE user DROP COLUMN phone`);
     }
   }
   ```

4. **运行迁移**

   ```bash
   npm run migration:run
   ```

5. **验证迁移状态**
   ```bash
   npm run migration:show
   ```

### 部署到生产环境

1. **构建项目**

   ```bash
   npm run build
   ```

2. **运行迁移**

   ```bash
   npm run migration:run
   ```

3. **启动应用**
   ```bash
   npm run start:prod
   ```

## 注意事项

### 1. 迁移文件命名规范

- 使用描述性的名称
- 使用小写字母和连字符
- 避免使用特殊字符

**好的命名示例：**

```bash
npm run migration:generate --name=add-user-phone
npm run migration:generate --name=create-order-table
npm run migration:generate --name=update-product-price
```

**避免的命名：**

```bash
npm run migration:generate --name=update  # 包含空格
npm run migration:generate --name=UPDATE  # 全大写
npm run migration:generate --name=update! # 特殊字符
```

### 2. 迁移文件管理

- 迁移文件一旦提交到版本控制，不要修改
- 如需修改数据库结构，创建新的迁移文件
- 定期清理过时的迁移文件

### 3. 数据库备份

- 在生产环境运行迁移前，务必备份数据库
- 建议在测试环境先验证迁移脚本

### 4. 回滚注意事项

- `migration:revert` 只能回滚最近一次迁移
- 生产环境谨慎使用回滚功能
- 回滚可能丢失数据，请确保有备份

## 常见问题

### Q: 迁移生成失败，提示 "No changes in database schema were found"

**A:** 这表示实体文件没有变更，或者变更与数据库结构一致。检查：

1. 实体文件是否真的修改了
2. 是否保存了文件
3. 数据库连接是否正常

### Q: 迁移运行时连接数据库失败

**A:** 检查环境变量：

1. `DATABASE_URL` 是否正确
2. 数据库服务是否启动
3. 网络连接是否正常

### Q: 迁移文件生成在错误的位置

**A:** 确保使用正确的命令格式：

```bash
# 正确
npm run migration:generate --name=your-migration

# 错误
npm run migration:generate your-migration
```

### Q: 如何查看迁移的 SQL 语句而不执行？

**A:** 可以查看生成的迁移文件中的 `up()` 方法，或者使用 TypeORM 的 `--dryrun` 选项（如果支持）。

## 环境配置

### 开发环境

```bash
# 自动同步模式（不推荐用于生产）
DB_SYNCHORNIZE=true
DB_LOGGING=true
```

### 生产环境

```bash
# 关闭自动同步，使用迁移
DB_SYNCHORNIZE=false
DB_LOGGING=false
```

## 相关文件

- `src/typeorm.config.ts` - TypeORM 配置文件
- `src/migrations/` - 迁移文件目录
- `src/entities/` - 实体文件目录
- `package.json` - 迁移命令定义

---

如有问题，请查看 TypeORM 官方文档或联系开发团队。
