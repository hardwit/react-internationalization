import { pluralize } from './pluralize'

class Internationalize {
  translations = {}
  languageChangeListeners = []
  languageSettingListeners = []

  translate = (key, values, pluralizeValues) => {
    try {
      if (!key) {
        return ''
      }

      const keys = key ? key.split('.') : ['']

      const res = keys.reduce(
        (res, key) => (res = res[key] || ''),
        internationalize.getTranslations()
      )

      if (typeof res !== 'string') {
        console.error(`Translation "${key}" must be a string`)

        return key
      } else {
        return this.parseValue(
          pluralize(res, pluralizeValues, this.language),
          values
        )
      }
    } catch (error) {}
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

  addLanguageChangeListener = callback => {
    try {
      if (typeof callback !== 'function') {
        throw new Error('Language change callback must be a function')
      }

      this.languageChangeListeners.push(callback)

      return () =>
        this.languageSettingListeners.splice(
          this.languageSettingListeners.indexOf(callback),
          1
        )
    } catch (error) {
      console.error('Internationalize error. ', error)
    }
  }

  addLanguageSettingListener = callback => {
    try {
      if (typeof callback !== 'function') {
        throw new Error('Language change callback must be a function')
      }

      this.languageSettingListeners.push(callback)

      return () =>
        this.languageSettingListeners.splice(
          this.languageSettingListeners.indexOf(callback),
          1
        )
    } catch (error) {
      console.error('Internationalize error. ', error)
    }
  }

  setLanguage = language => {
    this.language = language
    this.languageSettingListeners.forEach(listener => listener(language))
  }
}

const internationalize = new Internationalize()
const translate = internationalize.translate
const setLanguage = internationalize.setLanguage

export { internationalize, translate, setLanguage }
