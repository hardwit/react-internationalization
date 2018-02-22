import { Component } from 'react'
import { PropTypes } from 'prop-types'
import { internationalize } from './../internationalize'

class InternationalizationProvider extends Component {
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
      internationalize.setTranslations(language, {})

      console.error(
        'react-internationalization: translations setting error ',
        error
      )
    }
  }

  render() {
    return this.props.children
  }
}

export { InternationalizationProvider }
