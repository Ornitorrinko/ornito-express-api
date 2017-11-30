const express = require('express')
const Service = require('../modules/user/user.service')

const router = express.Router()

router.get('/', async (req, res, next) => {
  res.json(await Service.list(req.query.filter))
})

router.get('/:id', async (req, res, next) => {
  res.json(await Service.getById(req.params.id))
})

router.post('/', async (req, res, next) => {
  var id = await Service.create(req.body)
  res.json({ success: true, id: id })
})

router.put('/:id', async (req, res, next) => {
  await Service.update(req.params.id, req.body)
  res.json({ success: true })
})

router.delete('/:id', async (req, res, next) => {
  await Service.remove(req.params.id)
  res.json({ success: true })
})

module.exports = router
