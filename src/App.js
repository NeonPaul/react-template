import React, { Component } from 'react';
import PropTypes            from 'prop-types'
import logo from './logo.svg';
import s from './App.css';

import withStyles from 'isomorphic-style-loader/lib/withStyles';

const ContextType = {
  insertCss: PropTypes.func.isRequired
}

class App extends Component {
  static propTypes = {
    context: PropTypes.shape(ContextType).isRequired,
    children: PropTypes.element.isRequired
  }

  static childContextTypes = ContextType

  getChildContext() {
    return this.props.context
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

export default App;
