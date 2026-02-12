import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1770882513335 implements MigrationInterface {
  name = 'InitSchema1770882513335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expenses" ADD "type" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "expenses" DROP COLUMN "type"`);
  }
}
