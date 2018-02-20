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
* You can use `translate(id: String)` function separately from `<Text />` component.

## Components and methods

#### `<InternationalizationProvider />`

This component is used to setup the internationalization context for a tree.

#### Prop Types

```js
{
  defaultLanguage: string.isRequired,
  languages: object.isRequired,
  dynamicImports: bool
}
```

#### `<Text />`

This is main component used for translations.

#### Prop Types

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
