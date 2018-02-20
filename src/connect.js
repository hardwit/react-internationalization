import React from 'react'
import { internationalize } from './internationalize'

const connect = Component => {
  return class extends React.Component {
    componentDidMount() {
      this.unsubscribe = internationalize.addLanguageChangeListener(() =>
        this.forceUpdate()
      )
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      return <Component {...this.props} />
    }
  }
}

export { connect }
