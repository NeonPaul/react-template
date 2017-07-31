import Router from 'universal-router'
import routes from '../pages/routes'

const router = new Router(routes, {
  resolveRoute: (context, params) => {
    if (typeof context.route.action !== 'function') {
      return null
    }

    if (!context.route.public && !context.user) {
      return routes.login.action(context, params)
    }

    return context.route.action(context, params)
  }
})

export default router
