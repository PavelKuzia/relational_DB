const router = require('express').Router()
const { sequelize } = require('../util/db')

const { Blog } = require('../models')

router.get('/', async (req, res) => {
  let blogs
  try {
    blogs = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('title')), 'articles'],
        [sequelize.fn('COUNT', sequelize.col('likes')), 'likes']
      ],
      group: ['author']
    })
  } catch (err) {
    console.log(err)
  }
  
  res.json(blogs)
})

module.exports = router