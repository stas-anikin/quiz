
module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'clucks',
      username: 'stas',
      password: 'password'},
    migrations: {
      tableName: 'migrations',
      directory: './db/migrations'
    }
}
  }
