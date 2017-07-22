import React from 'react'
import s from './login.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

const Login = () => (
  <div className='Login'>
    <form method="post" action="/login">
      <label>Username <input type="text" name="username" /></label>
      <label>Password <input type="password" name="password" / ></label>
      <button>Log in</button>
    </form>
  </div>
)

export default withStyles(s)(Login)
