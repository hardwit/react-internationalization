# React Internationalization

Simple internationalization of React apps.

![Gif](https://github.com/hardwit/react-internationalization/raw/master/example.gif)

## Installation

```
npm install --save react-internationalization
```

## Features

* You can import languages dynamically.
* You can pluralize words in strings.
* You can use `translate()` outside the React component.

## Components and methods

#### `<InternationalizationProvider />`

This component is used to setup the internationalization context for a tree.

##### Prop Types

```js
{
  defaultLanguage: PropTypes.string.isRequired,
  languages: PropTypes.object.isRequired,
  dynamicImports: PropTypes.bool
}
```

#### `<Text />`

This is main component used for translations.

##### Prop Types

```js
{
  id: PropTypes.string.isRequired,
  values: PropTypes.object,
  pluralize: PropTypes.object
}
```

#### `setLanguage(lang: String)`

This method used for changing language and translations. You can call this method anywhere in the application.

#### `internationalize(Component: Component)`

If you want to use `translate(id: String)` function separately from `<Text />` component and you are going to change the language, then wrap your component with this HOC.

#### `translate(id: String, values: Object, pluralize: Object)`

Call this method in places where you can not use the `<Text />` component.

#### `addPluralizationRules(language: String, rules: Object)`

This method used for adding your pluralization rules.

## Pluralization

Pluralization rules for 'en' are used by default. If you have more than `one` and `other` in your language, then you can add your own pluralization rules. Check out the official [Unicode CLDR documentation](http://www.unicode.org/cldr/charts/28/supplemental/language_plural_rules.html) for your language.

```js
// example with 'ru' pluralization rules

import { addPluralizationRules } from 'react-internationalization'

const rules = {
  one: count => count % 10 === 1 && count % 100 !== 11,
  few: count =>
    [2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100),
  many: count =>
    count % 10 === 0 ||
    [5, 6, 7, 8, 9].includes(count % 10) ||
    [11, 12, 13, 14].includes(count % 100)
}

addPluralizationRules('ru', rules)
```

## Simple Example

translations/en.js

```js
const enLang = {
  common: {
    welcome: 'Hello {{name}}, you have {{count}} new {{messages}}!'
  }
}

export default enLang
```

translations/index.js

```js
import enLang from 'en'

export function en() {
  return enLang
}
```

app.js

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { InternationalizationProvider, Text } from 'react-internationalization'
import * as languages from './translations'

class App extends Component {
  state = {
    name: 'Ivan',
    newMessages: 4
  }

  render() {
    const { name, newMessages } = this.state

    return (
      <p>
        <Text
          id="common.welcome"
          values={{ name, count: newMessages }}
          pluralize={{
            messages: {
              one: 'message',
              other: 'messages',
              dependsOn: newMessages
            }
          }}
        />
      </p>
    )
  }
}

ReactDOM.render(
  <InternationalizationProvider defaultLanguage="en" languages={languages}>
    <App />
  </InternationalizationProvider>,
  document.getElementById('root')
```

This example would render: "Hello Ivan, you have 4 new messages!" into the root element on the page.

## Advanced Example

translations/en.js

```js
const en = {
  statuses: {
    play: 'play',
    pause: 'pause'
  },
  app: {
    status: 'Current status: {{status}}',
    changeStatus: 'Change status',
    changeLanguage: 'Change language'
  }
}

export default en
```

translations/ru.js

```js
const ru = {
  statuses: {
    play: 'играет',
    pause: 'пауза'
  },
  app: {
    status: 'Текущий статус: {{status}}',
    changeStatus: 'Сменить статус',
    changeLanguage: 'Сменить язык'
  }
}

export default ru
```

translations/index.js

```js
//set dynamicImports property on InternationalizationProvider for dynamic imports

export function en() {
  return import('./en').then(res => res.default)
}

export function ru() {
  return import('./ru').then(res => res.default)
}
```

app.js

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {
  InternationalizationProvider,
  Text,
  setLanguage,
  translate,
  internationalize
} from 'react-internationalization'
import * as languages from './translations'

class App extends Component {
  state = {
    status: 'play'
  }

  changeStatus = () => {
    this.setState(state => ({
      status: state.status === 'play' ? 'pause' : 'play'
    }))
  }

  setRuLanguage = () => {
    setLanguage('ru')
  }

  render() {
    const { status } = this.state

    return (
      <div>
        <p>
          <Text
            id="app.status"
            values={{ status: translate(`statuses.${status}`) }}
          />
        </p>
        <button style={{ marginRight: 20 }} onClick={this.changeStatus}>
          <Text id="app.changeStatus" />
        </button>
        <button onClick={this.setRuLanguage}>
          <Text id="app.changeLanguage" />
        </button>
      </div>
    )
  }
}

const IntarnationalizedApp = internationalize(App)

ReactDOM.render(
  <InternationalizationProvider
    defaultLanguage="en"
    languages={languages}
    dynamicImports
  >
    <IntarnationalizedApp />
  </InternationalizationProvider>,
  document.getElementById('root')
)
```

## Contribute

Let's make React Internationalization better! If you're interested in helping, all contributions are welcome and appreciated.

## License

MIT License
