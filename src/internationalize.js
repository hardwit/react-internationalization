import { pluralize, rules } from './pluralize'

class Internationalize {
  translations = {}
  languageChangeListeners = []
  languageSettingListeners = []
  pluralizationRules = rules
  language = navigator.language

  translate = (key, values, pluralizeValues) => {
    if (!key) {
      return ''
    }

    const keys = key ? key.split('.') : ['']

    const res = keys.reduce(
      (res, key) => (res = res[key] || ''),
      internationalize.getTranslations()
    )

    if (typeof res !== 'string') {
      console.error(
        `react-internationalization: Translation "${key}" must be a string`
      )

      return key
    } else {
      return this.parseValue(
        pluralize(
          this.pluralizationRules,
          this.language,
          res,
          pluralizeValues,
          this.language
        ),
        values
      )
    }
  }

  parseValue = (str, definedValues = {}) => {
    const values = str.match(/{{.*?}}/g)

    if (!values) {
      return str
    }

    let newStr = str

    values.forEach(value => {
      const valueName = value.substring(2, value.length - 2)

      if (typeof definedValues[valueName] !== 'undefined') {
        newStr = newStr.replace(
          new RegExp(value, 'g'),
          definedValues[valueName]
        )
      }
    })

    return newStr
  }

  getTranslations = () => this.translations

  setTranslations = (language, translations) => {
    this.translations = translations
    this.language = language

    this.languageChangeListeners.forEach(listener => listener())
  }

  addPluralizationRules = (language, rules) => {
    this.pluralizationRules[language] = rules
  }

  addLanguageChangeListener = callback => {
    this.languageChangeListeners.push(callback)

    return () =>
      this.languageSettingListeners.splice(
        this.languageSettingListeners.indexOf(callback),
        1
      )
  }

  addLanguageSettingListener = callback => {
    this.languageSettingListeners.push(callback)

    return () =>
      this.languageSettingListeners.splice(
        this.languageSettingListeners.indexOf(callback),
        1
      )
  }

  setLanguage = language => {
    this.language = language
    this.languageSettingListeners.forEach(listener => listener(language))
  }
}

const internationalize = new Internationalize()
const translate = internationalize.translate
const setLanguage = internationalize.setLanguage
const addPluralizationRules = internationalize.addPluralizationRules

export { internationalize, translate, setLanguage, addPluralizationRules }
