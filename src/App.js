import React, { Component } from 'react'
import PropTypes from 'prop-types'

const ContextType = {
  insertCss: PropTypes.func.isRequired
}

class App extends Component {
  getChildContext () {
    return this.props.context
  }

  render () {
    return React.Children.only(this.props.children)
  }
}

App.propTypes = {
  context: PropTypes.shape(ContextType).isRequired,
  children: PropTypes.element.isRequired
}

App.childContextTypes = ContextType

export default App
