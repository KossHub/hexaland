import {TextForm} from '../interfaces'

export const hasFormEmptyField = (form: TextForm) =>
  Object.values(form).some((value) => value.trim() === '')
