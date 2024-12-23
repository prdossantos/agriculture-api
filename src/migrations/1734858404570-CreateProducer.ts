import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducer1734858404570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "producers" (
              "id" SERIAL NOT NULL,
              "name" VARCHAR(255) NOT NULL,
              "document_id" VARCHAR(14) NOT NULL,
              "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
              "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
              CONSTRAINT "PK_producers_id" PRIMARY KEY ("id")
            );
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "producers";
          `);
  }
}
