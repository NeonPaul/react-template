import React from 'react'

const isButton = (el) => /^button|submit|image$/.test(el.type)

export default class Form extends React.Component {
  clickListen = (e) => {
    if (e.target.form === this.form && isButton(e.target)) {
      this.submitter = e.target

      if (e.target.type === 'image') {
        this.x = e.x || 0
        this.y = e.y || 0
      }         
    }
  }

  onSubmit = (e) {
    const data = [];

for (field of this.form.elements) {
      console.log(field.type.test)
    if(field.closest('datalist') || field.disabled || (isButton(field) && field !== this.submitter) || (/^(radio|checkbox)$/.test(field.type) && !field.checked) || (field.type !== 'image' && !field.name)) {
      continue;    
    }
    
    let type = field.type
    if (field.nodeName === 'input' && type === 'image') {
      let name = field.name ? field.name + '.' : ''
      data.push(
        { name: name + 'x', value: coords.x, type },
        { name: name + 'y', value: coords.y, type }
       )
       continue;
    }
    
    let name = field.name
    
    if (/^select-(one|multiple)$/.test(type)) {
      for (option of select.options) {
        if (option.selected && !option.disabled) {
          data.push({ name, type, value: option.value })
        }
      }
    } else if(/^(radio|checkbox)$/.test(type)) {
      data.push({ name, type, value: field.value || 'on' })
    } else if (type === 'file') {
      if (field.files.length) {
        data.push(...field.files.map(value => ({ name, type, value })))
      } else {
        data.push({ name, type: 'application/octet-stream', value: '' })
      }
    } else {
      data.push({ name, type, value: field.value })
    }
    
    let dirname
    if (dirname = field.getAttribute('dirname')) {
      data.push({ name: dirname, value: field.dir === 'ltr' ? 'ltr' : 'rtl', type: 'direction' })
    }

    this.props.onSubmit(data)

    e.preventDefault()
  }

  componentDidMount() {
    document.addEventListener('click', this.clickListen)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.clickListen)
  }

  render () {
    return <form ref={el => this.form = el} onSubmit={this.onSubmit}/>
  }
}
