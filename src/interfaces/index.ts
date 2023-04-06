import {OptionsWithExtraProps, SnackbarOrigin, VariantType} from 'notistack'

export interface TextForm {
  [key: string]: string
}

export interface NotificationPosition {
  TOP: SnackbarOrigin
  BOTTOM: SnackbarOrigin
}

export interface EnqueueSnackbarOptions
  extends OptionsWithExtraProps<VariantType> {
  onlyBottom?: boolean
}

export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>
