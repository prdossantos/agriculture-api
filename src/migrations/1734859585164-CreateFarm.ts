import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFarm1734859585164 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "farms" (
            "id" SERIAL NOT NULL,
            "name" VARCHAR(255) NOT NULL,
            "city" VARCHAR(255),
            "state" VARCHAR(255),
            "total_area" DECIMAL(10,2) NOT NULL,
            "agricultural_area" DECIMAL(10,2) NOT NULL,
            "vegetation_area" DECIMAL(10,2) NOT NULL,
            "producer_id" INT,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
            CONSTRAINT "PK_farms_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_farms_producer"
            FOREIGN KEY ("producer_id")
            REFERENCES "producers"("id")
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "farms";
          `);
  }
}
