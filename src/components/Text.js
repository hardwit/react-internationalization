import { Component } from 'react'
import PropTypes from 'prop-types'
import { internationalize } from './../internationalize'

class Text extends Component {
  static contextTypes = {
    translate: PropTypes.func
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    values: PropTypes.object
  }

  static defaultProps = {
    values: {},
    id: ''
  }

  constructor() {
    super()

    this.unsubscribe = () => {}
  }

  componentDidMount() {
    this.unsubscribe = internationalize.addLanguageChangeListener(() =>
      this.forceUpdate()
    )
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { id, children, pluralize } = this.props

    return id
      ? this.context.translate(this.props.id, this.props.values, pluralize)
      : children
  }
}

export { Text }
