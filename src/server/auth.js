const passport = require('passport')
const Strategy = require('passport-local').Strategy
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

export default app => {
  passport.use(new Strategy(
  function (username, password, cb) {
    if (username === process.env.USERNAME && password === process.env.PASSWORD) {
      return cb(null, username)
    } else {
      return cb(null, false)
    }
  }))

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
  passport.serializeUser(function (user, cb) {
    cb(null, user)
  })

  passport.deserializeUser(function (user, cb) {
    cb(null, user)
  })

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
  const sessionConfig = {}

  if (process.env.NODE_ENV === 'production') {
    const envs = ['SESSION_SECRET', 'REDIS_URL', 'USERNAME', 'PASSWORD']

    const missing = envs.filter(env => !process.env[env])

    if (missing.length) {
      console.log('Must set ' + missing.join(', ') + ' in process.env.');
      process.exit(1)
    }

    sessionConfig.store = new RedisStore({
      url: process.env.REDIS_URL
    })
  }

  app.use(require('cookie-parser')())
  app.use(require('body-parser').urlencoded({ extended: true }))
  app.use(session({
    ...sessionConfig,
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false, // Don't re-save if session has not been modified
    saveUninitialized: false // Don't save session until it has been modified
  }))

// Initialize Passport and restore authentication state, if any, from the
// session.
  app.use(passport.initialize())
  app.use(passport.session())

  app.post('/login',
  passport.authenticate('local', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/')
  })
}
