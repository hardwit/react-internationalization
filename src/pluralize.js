function pluralize(pluralizationRules, language, str, definedValues = {}) {
  try {
    const values = str.match(/{{.*?}}/g)

    if (!values) {
      return str
    }

    let newStr = str

    values.forEach(value => {
      const valueName = value.substring(2, value.length - 2)

      if (typeof definedValues[valueName] === 'object') {
        const dependsOn = Number(definedValues[valueName].dependsOn)

        if (Number.isNaN(dependsOn)) {
          throw new Error(
            `Missing "dependsOn" in ${JSON.stringify(definedValues[valueName])}`
          )
        }

        let ruleName = 'other'
        let rules = pluralizationRules[language]

        if (!rules || !Object.keys(rules).length) {
          console.warn(
            'react-internationalization: You should add pluralization rules for current language'
          )
        }

        Object.keys(rules).forEach(key => {
          if (rules[key](dependsOn)) {
            ruleName = key
          }
        })

        newStr = newStr.replace(
          new RegExp(value, 'g'),
          definedValues[valueName][ruleName]
        )
      }
    })

    return newStr
  } catch (error) {
    console.error('react-internationalization: ', error)

    return str
  }
}

const rules = {
  en: {
    one: count => count === 1
  }
}

export { pluralize, rules }
