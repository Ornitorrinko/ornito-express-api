const { config } = require('../utils')

const knex = require('knex')({
    client: 'pg',
    connection: config.db_host,
    pool: {
        min: 2,
        max: 10
    }
});

class PostgresDB {
    constructor(table) {
        this.table = table
    }

    get query() {
        return knex(this.table);
    }

    async list(filter) {
        return this.query
            .where(filter)
            .then(result => result)
    }

    async get(filter) {
        return this.query
            .where(filter)
            .first()
            .then(result => result)
    }

    async insert(data) {
        return knex(this.table)
            .returning('id')
            .insert(data)
            .then(id => id[0])
    }

    async update(id, data) {
        return knex(this.table)
            .where('id', id)
            .update(data)
            .then(id => id[0])
    }

    async remove(id) {
        return knex(this.table)
            .where('id', id)
            .del()
    }
}

module.exports = PostgresDb;