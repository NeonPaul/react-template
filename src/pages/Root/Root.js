import React from 'react'
import { connect } from 'react-redux';
import { increment, decrement, read } from '../../store';

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
    dispatch(increment())
  },
  dec: () => dispatch(decrement())
})

Root.actions = [
  dispatch => dispatch(read())
]

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(s)(Root))
