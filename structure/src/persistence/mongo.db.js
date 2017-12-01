const { config } = require('../utils')

class MongoDB {
    constructor(model) {
        this.model = model
    }

    get query() {
        return this.model;
    }

    async list(filter) {
        // TODO: not implemented
    }

    async get(filter) {
        // TODO: not implemented
    }

    async insert(data) {
        // TODO: not implemented
    }

    async update(id, data) {
        // TODO: not implemented
    }

    async remove(id) {
        // TODO: not implemented
    }
}

module.exports = PostgresDb;