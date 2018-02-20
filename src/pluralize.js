function pluralize(str, definedValues = {}, language) {
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
          `Missing "dependsOn: Number" in ${JSON.stringify(
            definedValues[valueName]
          )}`
        )
      }

      const isOne = dependsOn === 1

      newStr = newStr.replace(
        new RegExp(value, 'g'),
        definedValues[valueName][isOne ? 'one' : 'other']
      )
    }
  })

  return newStr
}

export { pluralize }
