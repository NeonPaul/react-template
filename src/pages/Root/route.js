import Root from './Root'

const title = `Root`

export default {
  path: '/',

  action (...args) {
    return {
      title,
      component: Root
    }
  }
}
