const { config } = require('../utils')

class MongoDB {
    constructor(model) {
        this.model = model
    }

    async list(filter) {
        if (filter.id) {
            filter._id = filter.id;
            delete filter.id;
        }

        return this.model.find(filter);
    }

    async get(filter) {
        if (filter.id) {
            filter._id = filter.id;
            delete filter.id;
        }

        return this.model.findOne(filter);
    }

    async insert(data) {
        var Model = this.model;
        return (new Model(data)).save();
    }

    async update(id, data) {
        return this.model.findOneAndUpdate({ _id: id }, data);
    }

    async remove(id) {
        return this.model.findOneAndRemove({ _id: id });
    }
}

module.exports = MongoDB;