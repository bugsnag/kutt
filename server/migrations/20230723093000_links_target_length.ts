import { Knex } from "knex";
import * as models from "../models";

export async function up(knex: Knex): Promise<any> {
  await models.createUserTable(knex);
  await models.createIPTable(knex);
  await models.createDomainTable(knex);
  await models.createHostTable(knex);
  await models.createLinkTable(knex);
  await models.createVisitTable(knex);

  await Promise.all([
    knex.raw(`
        ALTER TABLE links ALTER COLUMN target TYPE VARCHAR;
    `),
  ]);
}

export async function down(): Promise<any> {
  // do nothing
}
