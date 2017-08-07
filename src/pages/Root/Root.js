import React from 'react'
import { connect } from 'react-redux';
import { increment, decrement, read } from '../../store';

import s from './root.css'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

const constructData = function (form, submitter) {
  const submittable = ['button', 'input', 'keygen', 'select', 'textarea']
  const controls = form.querySelectorAll(submittable.join(', '))
  const dataSet = []

  for (let i = 0; i < controls.length; i++) {
    let field = controls[i];
    let type = field.type;
    if (field.closest('datalist') ||
        field.disabled ||
        (field.nodeName === 'BUTTON' && field !== submitter) ||
        (field.nodeName === 'INPUT' && type === 'radio' && !field.checked) ||
        (field.nodeName === 'INPUT' && type === 'checkbox' && !field.checked)
        // image button check
     ) { continue; }

     // image button check

     let name = field.name
     if (field.nodeName === 'SELECT') {
       dataSet.push(
         ...Array.from(field.querySelectorAll('option'))
           .filter(o => o.selected && !o.disabled)
           .map(o => ({ name, value: o.value, type }))
       )
       continue;
     }

     if (field.nodeName === 'INPUT' && (type === 'radio' || type === 'checkbox')) {
       let value = field.value || 'on'
       dataSet.push({ name, value, type })
       continue;
     }

     if (field.nodeName === 'INPUT' && type === 'file') {
       if (field.files.length > 0) {
         dataSet.push(...field.files.map(f => ({ name, value: f, type })))
       } else {
         dataSet.push({ name, value: '', type: 'application/octet-stream' })
       }
       continue;
     }

     dataSet.push({ name, value: field.value, type })

     // append dirname
  }

       // replace cl/rf
  return dataSet;
}

const submitForm = function (event) {
  const form = this;
  
  const dataSet = constructData(form, event.target)
  window.history.pushState({ method: 'POST', body: dataSet }, '', form.getAttribute('action') || window.location.href)
  event.preventDefault()
}

const Root = ({ title, counter, inc, dec }) => (
  <div className='root'>
    Root page<br />
    { counter }<br />
    <form method="POST" onClick={submitForm}>
     <button onClick={inc} name="step" value="1">+</button>    
     <button onClick={dec} name="step" value="-1">-</button>
    </form>
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
