import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createProductVersionTable1656428275581
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product_versions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'product_id',
            type: 'int',
          },
          {
            name: 'size_id',
            type: 'int',
          },
          {
            name: 'color_id',
            type: 'int',
          },
          {
            name: 'quantity',
            type: 'int',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'product_versions',
      new TableForeignKey({
        columnNames: ['product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'product_versions',
      new TableForeignKey({
        columnNames: ['size_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sizes',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'product_versions',
      new TableForeignKey({
        columnNames: ['color_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'colors',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('product_versions');
    const foreignKey1 = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('product_id') !== -1,
    );
    const foreignKey2 = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('size_id') !== -1,
    );
    const foreignKey3 = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('color_id') !== -1,
    );

    await queryRunner.dropForeignKey('product_versions', foreignKey1);
    await queryRunner.dropForeignKey('product_versions', foreignKey2);
    await queryRunner.dropForeignKey('product_versions', foreignKey3);
    await queryRunner.dropTable('product_versions');
  }
}
