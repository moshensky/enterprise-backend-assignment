import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('print_jobs', (table) => {
    table.uuid('id').primary()
    table.string('data').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('print_jobs')
}
