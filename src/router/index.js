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

    const route = context.route.action(context, params)

    const getActions = [].concat(route.component.actions || [], route.actions || []).filter(a => typeof a === 'function')
    const postActions = ((route.component.actions || {}).post || []).map(a => (...args) => a(context.body, ...args))
    const actions = context.method === 'POST' ? postActions : getActions

    return Promise.all(actions.map(
      action => action(context.store.dispatch)
    )).then(() => route)
  }
})

export default router
