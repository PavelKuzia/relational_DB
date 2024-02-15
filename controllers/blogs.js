const router = require('express').Router()
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Blog, User } = require('../models')

const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = { 
      [Op.or]: [
        {
          title: {
            [Op.iLike]: '%' + req.query.search + '%'
          }
        },
        {
          author: {
            [Op.iLike]: '%' + req.query.search + '%'
          }
        }
      ]
    }
  }

  const blogs = await Blog.findAll({
      include: {
        model: User,
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
      },
      where,
      order: [
        ['likes', 'DESC']
      ]
    })

  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (user.disabled) {
      return res.send('User is disabled. Contact admin')
    }
    const blog = await Blog.create({...req.body, userId: user.id})
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', [blogFinder, tokenExtractor], async (req, res) => {
  if (!req.decodedToken) {
    res.json({'error': 'please provide authorisation token'}).end()
  } else if (!req.blog) {
    res.json({'error': 'no blog post is found'}).end()
  } else if (req.blog.userId != req.decodedToken.id) {
    res.json({'error': 'only owner of a blog can delete it'}).end()
  } else {
    await req.blog.destroy()
  }
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.blog.likes + 1
    await req.blog.save()
    res.json({likes: req.blog.likes})
  } else {
    res.status(404).end()
  }
})

module.exports = router