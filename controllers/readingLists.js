const router = require('express').Router()
const { ReadingList, Blog } = require('../models')

router.post('/', async (req, res) => {
  await ReadingList.create(req.body)
  res.send('Success')
})

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const item = await ReadingList.findOne({
    where: {'blog_id' : id }
  })
  item.unreadState = true
  await item.save()
  res.send('Success')
})

module.exports = router