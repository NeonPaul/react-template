import express from 'express'
import { createServer } from 'http'
import { Provider } from 'react-redux'

import React from 'react'
import ReactDOM from 'react-dom/server'
import auth from './auth'
import store from '../store'
import api from './api'

const PORT = 3000

function router () {
  const router = express.Router()

  auth(router)

  router.use('/api', api)

  router.get('*', (req, res, next) => {
    try {
      const App = require('../App').default
      const Html = require('../components/Html').default
      const router = require('../router').default

      const css = new Set()

      const context = {
        insertCss: (...styles) => {
          styles.forEach(style => {
            return css.add(style._getCss())
          })
        }
      }

      router.resolve({
        path: req.path,
        query: req.query,
        user: req.user,
        store
      }).then(route => {
        if (route.redirect) {
          res.redirect(route.status || 302, route.redirect)
          return
        }

        const data = { ...route }
        const Route = route.component

        data.children = ReactDOM.renderToString(
          <Provider store={store}>
            <App context={context}><Route /></App>
          </Provider>
        )

        data.styles = [
          { id: 'css', cssText: [...css].join('') }
        ]
        data.scripts = [
          global.process.env.CLIENT_MAIN
        ]
        data.state = store.getState()
        data.user = req.user

        const html = ReactDOM.renderToStaticMarkup(<Html {...data} />)
        res.status(route.status || 200)
        res.send(`<!doctype html>${html}`)
      }).catch(err => {
        console.log(err)
        next(err)
      })
    } catch (err) {
      next(err)
    }
  })

  return router;
}


if (require.main === module) {
  const app = express()

  // Serve static pages before the auth stuff so we don't
  // create sessions on requests for assets
  app.use(express.static('./build'))

  app.use(router())

  app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500)
    res.send(`Internal server error`)
  })

  const server = createServer(app)

  server.listen(PORT, () => {
    console.log(`==> 🌎  http://0.0.0.0:${PORT}/`)
  })
}

export default router();
