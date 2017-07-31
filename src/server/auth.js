const passport = require('passport')
const Strategy = require('passport-local').Strategy

export default app => {
  const findByUsername = (u, p, cb) => cb(null, {
    password: p
  })

  passport.use(new Strategy(
  function (username, password, cb) {
    findByUsername(username, password, function (err, user) {
      if (err) { return cb(err) }
      if (!user) { return cb(null, false) }
      if (user.password !== password) { return cb(null, false) }
      return cb(null, user)
    })
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
  app.use(require('cookie-parser')())
  app.use(require('body-parser').urlencoded({ extended: true }))
  app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))

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
