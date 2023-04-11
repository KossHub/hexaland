import React, {useEffect, useState} from 'react'
import {isString} from 'lodash'
import {Box, Button, Typography} from '@mui/material'

import Canvas from '../../components/Canvas'
import TextField from '../../components/TextField'
import {RectMap} from '../../core/classes/GameMap/RectMap'
import {useMapContext} from '../../contexts/map/useMapContext'
import {useCanvasContext} from '../../contexts/canvas/useCanvasContext'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import {isJSON} from '../../utils/checker'
import {SIZE_LIMIT} from './constants'
import * as UI from './styles'

const MapEditorPage = () => {
  const canvas = useCanvasContext()
  const mapState = useMapContext()
  const {enqueueSnackbar} = useSnackbar()

  const [width, setWidth] = useState(10)
  const [height, setHeight] = useState(10)
  const [filename, setFilename] = useState('')
  const [fileData, setFileData] = useState<null | string>(null)

  const fillEmptyTilesWithDefaultValue = () => {}

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    if (!event.target.files) {
      return
    }

    const file = event.target.files[0]
    const {name} = file

    const reader = new FileReader()

    reader.onload = (evt) => {
      if (!evt?.target?.result) {
        return
      }

      const {result} = evt.target

      if (!isString(result) || !isJSON(result)) {
        enqueueSnackbar('Неверный формат файла', {
          variant: 'error'
        })
        return
      }

      setFilename(name)
      setFileData(JSON.parse(result))
    }

    reader.readAsBinaryString(file)
  }

  const handleSave = () => {
    let el = document.createElement('a')
    el.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        JSON.stringify(fileData)
      )}`
    )
    el.setAttribute('download', filename)
    el.style.display = 'none'
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
  }

  useEffect(() => {
    mapState.map = new RectMap({
      top: 0,
      bottom: Number(height) - 1,
      left: 0,
      right: Number(width) - 1
    })
    canvas.originOffset.x = 0
    canvas.originOffset.y = 0
  }, [width, height])

  return (
    <UI.Wrapper maxWidth="xl">
      <Box sx={{pt: 4, pr: 4, pb: 4, maxWidth: '320px'}}>
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
          <TextField
            size="small"
            label="Ширина"
            type="number"
            InputLabelProps={{shrink: true}}
            inputProps={{min: 1, max: SIZE_LIMIT}}
            value={width}
            onChange={(event) =>
              setWidth(Math.min(Number(event.target.value), SIZE_LIMIT))
            }
          />
          {' X '}
          <TextField
            size="small"
            label="Высота"
            type="number"
            InputLabelProps={{shrink: true}}
            inputProps={{min: 1, max: SIZE_LIMIT}}
            value={height}
            onChange={(event) =>
              setHeight(Math.min(Number(event.target.value), SIZE_LIMIT))
            }
          />
        </Box>

        <Typography mb={2}>{filename || 'файл не загружен'}</Typography>
        <Box sx={{display: 'flex', gap: 1, width: '100%'}}>
          <Button variant="outlined" component="label" sx={{width: '100%'}}>
            Загрузить
            <input hidden type="file" onChange={handleFileUpload} />
          </Button>
          <Button variant="contained" onClick={handleSave} sx={{width: '100%'}}>
            Сохранить
          </Button>
        </Box>
      </Box>
      <Canvas />
    </UI.Wrapper>
  )
}

export default MapEditorPage
