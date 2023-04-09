import {isObject} from 'lodash'

export const isJSON = (str: string) => {
  try {
    if (isObject(JSON.parse(str))) {
      return true
    }
  } catch (error) {}
  return false
}
