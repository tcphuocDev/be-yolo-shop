import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnCodeColorsTable1670126756975
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('colors', [
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('colors', [
      new TableColumn({
        name: 'code',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    ]);
  }
}
