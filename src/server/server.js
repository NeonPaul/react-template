import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import { createServer } from 'http'

import fs from 'fs'

import React from 'react'
import ReactDOM from 'react-dom/server'
import auth from './auth'

const PORT = 3000

const serve = (req, res, next) => {
  try {
    console.log('doing my best')
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
      user: req.user
    }).then(route => {
      if (route.redirect) {
        res.redirect(route.status || 302, route.redirect)
        return
      }

      const data = { ...route }
      data.children = ReactDOM.renderToString(<App context={context}>{ route.component }</App>)
      data.styles = [
        { id: 'css', cssText: [...css].join('') }
      ]
      data.scripts = [
        req.index
      ]
      data.user = req.user

      const html = ReactDOM.renderToStaticMarkup(<Html {...data} />)
      res.status(route.status || 200)
      res.send(`<!doctype html>${html}`)
    }).catch(next)
  } catch (err) {
    next(err)
  }
}

export default serve

if (require.main === module) {
  const app = express()

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  auth(app)
  app.use(bodyParser.json())

  const jsFiles = fs.readdirSync('./build/static/js')

  app.use(express.static('./build'))

  app.use((req, res, next) => {
    req.index = `/static/js/${jsFiles[0]}`
    next()
  })

  app.get('*', serve)

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
