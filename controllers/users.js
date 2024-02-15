const router = require('express').Router()

const { User, Blog, ReadingList } = require('../models')
const { tokenExtractor} = require('../util/middleware')

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.get('/', async (req, res) => {
  const where = {}
  if (req.query.read) {
    where.unreadState = req.query.read
  }
  try {
    const users = await User.findAll({
      include: {
          model: Blog,
          as: 'readings',
          attributes: { exclude: ['userId', 'createdAt', 'updatedAt', 'unreadState'] },
          through: {
            attributes: ['unreadState'],
            where
          },
        },
    })
    res.json(users)
  } catch (err) {
    console.log(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: {
      model: Blog,
      as: 'readings',
      attributes: { 
        exclude: ['userId', 'createdAt', 'updatedAt', 'unreadState'] },
        through: {
          attributes: ['id', 'unreadState'],
          as: 'readinglists'
        }
    },
    attributes: {exclude: ['id']}
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router