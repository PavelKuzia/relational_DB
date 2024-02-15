// const Note = require('./note')
const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')
const Session = require('./session')
// const Team = require('./team')
// const Membership = require('./membership')
// const UserNotes = require('./user_notes')

// User.hasMany(Note)
Blog.belongsTo(User)
User.hasMany(Blog, { as: 'createdBy' })

Blog.belongsToMany(User, { through: ReadingList })
User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })

// User.belongsTo(Session)
// Session.hasMany(User)
// Note.belongsTo(User)
// User.belongsToMany(Blog, { through: ReadingList })

// Team.belongsToMany(User, { through: Membership })
// Note.sync({ alter: true })
// User.sync({ alter: true })
// Blog.sync({ alter: true })

module.exports = {
  Blog,
  User,
  ReadingList,
  Session
}