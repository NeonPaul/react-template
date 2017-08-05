'use strict'

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')

const chalk = require('chalk')
const webpack = require('webpack')
const clearConsole = require('react-dev-utils/clearConsole')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const {
  choosePort,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils')
const openBrowser = require('react-dev-utils/openBrowser')
const paths = require('../config/paths')
const config = require('../config/webpack.config.dev')
const devServer = require('express')()

const isInteractive = process.stdout.isTTY
const webpackDevMiddleware = require('webpack-dev-middleware')
const serverConfig = require('../config/webpack.config.server.js')

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'

let started = false

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    const urls = prepareUrls(protocol, HOST, port)
    // Create a webpack compiler that is configured with custom messages.

    const compiler = webpack(config)
    const serverCompiler = webpack(serverConfig)

    const wdm = webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
      stats: { colors: true },
      hot: true,
      serverSideRender: true
    })

    devServer.use(wdm)

    serverCompiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        process.exit(1)
      }

      const main = require('path').join(serverConfig.output.path, stats.toJson().assetsByChunkName.main[0])

      if (started) {
        console.log('invalidating cache')
        delete require.cache[main]
        return
      }

      started = true

      devServer.use((req, res, next) => {
        process.env.CLIENT_MAIN = res.locals.webpackStats.toJson().assetsByChunkName.main[0]

        try {
          require(main).default(req, res, next)
        } catch (e) {
          console.log('bad time', e)
          next(e)
        }
      })

      devServer.use((err, req, res, next) => {
        console.log('Caught error:', err)
      })
/*

      wdm.waitUntilValid(stats => {
        devServer.use((req, res, next) => {
          req.index = stats.toJson().assetsByChunkName.main[0]
          next()
        })
        serverSetup(devServer)
*/
    // Launch WebpackDevServer.
      devServer.listen(port, HOST, err => {
        if (err) {
          return console.log(err)
        }
        if (isInteractive) {
          clearConsole()
        }
        console.log(chalk.cyan('Starting the development server...\n'))
        openBrowser(urls.localUrlForBrowser)
      });

      ['SIGINT', 'SIGTERM'].forEach(function (sig) {
        process.on(sig, function () {
          process.exit()
        })
      })

//      })
    })
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  })
