import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnSellToProductTable1660414453981
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('products', [
      new TableColumn({
        name: 'sell',
        type: 'int',
        isNullable: true,
        default: 0,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('products', [
      new TableColumn({
        name: 'sell',
        type: 'int',
        isNullable: true,
        default: 0,
      }),
    ]);
  }
}
