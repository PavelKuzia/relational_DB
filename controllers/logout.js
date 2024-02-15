const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { tokenExtractor } = require('../util/middleware')
const Session = require('../models/session')

router.post('/', tokenExtractor, async (req, res) => {
  const session = await Session.findOne({where: {userId: req.decodedToken.id}})
  if (session) {
    await session.destroy()
    res.send('Successfully loged out!')
  }

})

module.exports = router