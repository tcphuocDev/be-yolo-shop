import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTableCoupons1656691140658 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'coupons',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '45',
          },
          {
            name: 'plan_quantity',
            type: 'int',
          },
          {
            name: 'actual_quantity',
            type: 'int',
          },
          {
            name: 'value',
            type: 'int',
          },
          {
            name: 'status',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('coupons');
  }
}
