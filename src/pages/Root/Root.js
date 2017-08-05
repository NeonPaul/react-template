import React from 'react'
import { connect } from 'react-redux';

import s from './root.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

const Root = ({ title, counter, inc, dec }) => (
  <div className='root'>
    Root page<br />
    { counter }<br />
    <button onClick={inc}>+</button>    
    <button onClick={dec}>-</button>
  </div>
)

const mapStateToProps = (state) => ({ counter: state })
const mapDispatchToProps = (dispatch) => ({
  inc: () => {
    console.log('inc')
    dispatch({ type: 'INCREMENT' })
  },
  dec: () => dispatch({ type: 'DECREMENT' })
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(s)(Root))

console.log('hello')
