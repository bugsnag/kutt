import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {

  await knex.schema.alterTable("links", table => {
    table.specificType("target", "varchar").notNullable().alter();
  });
}

export async function down(): Promise<any> {
  return null;
}
