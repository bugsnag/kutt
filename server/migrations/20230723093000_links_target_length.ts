import { Knex } from "knex";

export async function up(knex: Knex): Promise<any> {

  await knex.schema.alterTable("links", table => {
    table.text("target").notNullable().alter();
  });
}

export async function down(): Promise<any> {
  return null;
}
