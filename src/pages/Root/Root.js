import React from 'react'

import s from './root.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

const Root = ({ title }) => (
  <div className='root'>
    Root page
  </div>
)

export default withStyles(s)(Root)
