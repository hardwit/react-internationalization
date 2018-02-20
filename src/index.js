import { translate, setLanguage } from './internationalize'
import { InternationalizationProvider } from './components/Provider'
import { Text } from './components/Text'
import { connect } from './connect'

export {
  setLanguage,
  translate,
  InternationalizationProvider,
  Text,
  connect as internationalize
}
