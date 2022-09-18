import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createOrderDetailTable1657421659331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_details',
        columns: [
          {
            name: 'order_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'product_version_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'product_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'price',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'order_details',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order_details',
      new TableForeignKey({
        columnNames: ['product_version_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product_versions',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('order_details');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('order_id') !== -1,
    );
    const foreignKey2 = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('product_version_id') !== -1,
    );

    await queryRunner.dropForeignKey('order_details', foreignKey);
    await queryRunner.dropForeignKey('order_details', foreignKey2);

    await queryRunner.dropTable('order_details');
  }
}
