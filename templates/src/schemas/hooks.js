const mongoose = require('mongoose')

const IuguHookSchema = new mongoose.Schema({
  event: { type: String, required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: new Date() }
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
IuguHookSchema.method({
})

IuguHookSchema.pre('save', (next) => {
  next()
})

/**
 * Statics
 */
IuguHookSchema.statics = {
  /**
   * Get product
   * @param {ObjectId} id - The objectId of product.
   * @returns {Promise<product, APIError>}
   */
  async get (id) {
    await this.findById(id)
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  async list ({ skip = 0, limit = 50 } = {}) {
    await this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
  }
}

/**
 * @typedef User
 */
export default mongoose.model('hooks', IuguHookSchema)
