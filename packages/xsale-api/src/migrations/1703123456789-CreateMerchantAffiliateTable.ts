import { MigrationInterface, QueryRunner, Table, ForeignKey } from 'typeorm';

export class CreateMerchantAffiliateTable1703123456789
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'merchant_affiliate',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid()',
          },
          {
            name: 'merchant_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'affiliate_id',
            type: 'varchar',
            length: '36',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
        ],
        indices: [
          {
            name: 'IDX_MERCHANT_AFFILIATE_MERCHANT_ID',
            columnNames: ['merchant_id'],
          },
          {
            name: 'IDX_MERCHANT_AFFILIATE_AFFILIATE_ID',
            columnNames: ['affiliate_id'],
          },
          {
            name: 'IDX_MERCHANT_AFFILIATE_UNIQUE',
            columnNames: ['merchant_id', 'affiliate_id'],
            isUnique: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['merchant_id'],
            referencedTableName: 'merchant',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            columnNames: ['affiliate_id'],
            referencedTableName: 'affiliate',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('merchant_affiliate');
  }
}
