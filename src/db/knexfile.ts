import { Knex } from 'knex'
import { config } from '../config/config'

// export default const config

const knexconfig: Knex.Config = {
  client: 'better-sqlite3',
  // sqlite does not support inserting default values
  useNullAsDefault: true,
  connection: config.db,
  migrations: {
    directory: './migrations',
  },
  seeds: {
    directory: './seeds',
  },
}

export default knexconfig
