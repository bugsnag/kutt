import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {

  await knex.raw(`
    ALTER TABLE links ALTER COLUMN target TYPE VARCHAR;
  `);
}

export async function down(): Promise<any> {
  return null;
}
