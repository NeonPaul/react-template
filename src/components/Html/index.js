import PropTypes from 'prop-types'
import React from 'react'

class Html extends React.Component {
  render () {
    const { title, description, styles, scripts, children, state, user } = this.props
    return (
      <html className='no-js' lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='x-ua-compatible' content='ie=edge' />
          <title>{title}</title>
          <meta name='description' content={description} />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='apple-touch-icon' href='apple-touch-icon.png' />
          {styles.map(style =>
            <style
              key={style.id}
              id={style.id}
              dangerouslySetInnerHTML={{ __html: style.cssText }}
          />
        )}
        </head>
        <body>
          <div
            id='root'
            dangerouslySetInnerHTML={{ __html: children }}
      />
          <script dangerouslySetInnerHTML={{ __html: `
            window.initialState = ${JSON.stringify(state || '')}
          ` }} />
          { user && <script dangerouslySetInnerHTML={{ __html: `
            window.user = ${JSON.stringify(user)}
          ` }} /> }
          { scripts.map(script => <script key={script} src={script} />) }
        </body>
      </html>
    )
  }
}

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  styles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    cssText: PropTypes.string.isRequired
  }).isRequired),
  scripts: PropTypes.arrayOf(PropTypes.string.isRequired),
  children: PropTypes.string.isRequired
}

Html.defaultProps = {
  styles: [],
  scripts: []
}

export default Html
