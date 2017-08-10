const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  user: 'database-user',
  max: 20
})

pool.query('CREATE DATABASE some_database', (err, result) => {
  if (err) {
    return console.error('Error executing query', err.stack)
  }
  console.log(result.rows)
})

function createDatabase (name) {

}

function existsDatabase (name) {

}
