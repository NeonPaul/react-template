import React from 'react'
import Login from './Login'

const title = `Log in`

export default {
  action () {
    return {
      title,
      component: <Login title={title} />
    }
  }
}
