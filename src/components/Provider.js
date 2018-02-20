import { Component } from 'react'
import { PropTypes } from 'prop-types'
import { internationalize } from './../internationalize'

class InternationalizeProvider extends Component {
  static propTypes = {
    defaultLanguage: PropTypes.string.isRequired,
    languages: PropTypes.object.isRequired,
    dynamicImports: PropTypes.bool
  }

  static defaultProps = {
    dynamicImports: false
  }

  static childContextTypes = {
    translate: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      translations: {},
      language: props.defaultLanguage
    }
  }

  getChildContext() {
    return {
      translate: internationalize.translate
    }
  }

  componentDidMount() {
    this.setTranslations(this.props.defaultLanguage)

    internationalize.addLanguageSettingListener(language =>
      this.setTranslations(language)
    )
  }

  setTranslations = language => {
    try {
      if (this.props.dynamicImports) {
        this.props.languages[language]().then(translations => {
          internationalize.setTranslations(language, translations)
        })

        return
      } else {
        const translations = this.props.languages[language]()

        internationalize.setTranslations(language, translations)
      }
    } catch (error) {
      console.error('Translations setting error: ', error)
    }
  }

  render() {
    return this.props.children
  }
}

export { InternationalizeProvider }
