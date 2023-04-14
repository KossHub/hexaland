import React, {
  ChangeEvent,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {isString, random} from 'lodash'
import {Box, Button, Divider, IconButton, Typography} from '@mui/material'
import {
  RotateRightRounded as RotateRightRoundedIcon,
  FlipRounded as FlipRoundedIcon,
  RotateLeftRounded as RotateLeftRoundedIcon,
  RestoreRounded as RestoreRoundedIcon,
  ShuffleRounded as ShuffleRoundedIcon
} from '@mui/icons-material'

import Canvas from '../../components/Canvas'
import TextField from '../../components/TextField'
import Tooltip from '../../components/Tooltip'
import LandscapeButtons from '../../components/LandscapeButtons'
import {RectMap} from '../../core/classes/GameMap/RectMap'
import {
  RectMapScheme,
  RectMapSchemeRow
} from '../../core/interfaces/map.interfaces'
import {useMapContext} from '../../contexts/map/useMapContext'
import {useCanvasContext} from '../../contexts/canvas/useCanvasContext'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import {isJSON} from '../../utils/checker'
import {
  getDefaultMapScheme,
  getRandomReflectedState,
  getRandomRotation
} from '../../core/utils/canvasTemplate.utils'
import {getMapEdges} from '../../core/utils/mapCalculated'
import {SIZE_LIMIT} from './constants'
import {LANDSCAPE_TYPES} from '../../core/classes/LandscapeTemplates/constants'
import * as UI from './styles'
import {LandscapeButtonsWrapper} from './styles'

const MapEditorPage = () => {
  const canvas = useCanvasContext()
  const mapState = useMapContext()
  const {enqueueSnackbar} = useSnackbar()

  const fileInputRef = useRef<null | HTMLInputElement>(null)

  const [width, setWidth] = useState(10)
  const [height, setHeight] = useState(10)
  const [isResizeRequired, setIsResizeRequired] = useState(true)
  const [filename, setFilename] = useState('')
  const [selectedHexInScheme, setSelectedHexInScheme] = useState<
    null | RectMapSchemeRow[keyof RectMapSchemeRow]
  >(null)

  const [, triggerRender] = useState({})

  const fillEmptyTilesWithDefaultValue = () => {}

  const isSelectedHexDisabled = useMemo(() => {
    if (!selectedHexInScheme) {
      return true
    }

    return (
      selectedHexInScheme.rotationDeg === 0 && !selectedHexInScheme.isReflected
    )
  }, [selectedHexInScheme?.rotationDeg, selectedHexInScheme?.isReflected])

  const handleRotateRight = () => {
    if (!selectedHexInScheme) {
      return
    }

    const delta = selectedHexInScheme.isReflected ? 300 : 60

    selectedHexInScheme.rotationDeg =
      (selectedHexInScheme.rotationDeg + delta) % 360

    triggerRender({})
  }

  const handleRotateLeft = () => {
    if (!selectedHexInScheme) {
      return
    }

    const delta = selectedHexInScheme.isReflected ? 60 : 300

    selectedHexInScheme.rotationDeg =
      (selectedHexInScheme.rotationDeg + delta) % 360

    triggerRender({})
  }

  const handleReflect = () => {
    if (!selectedHexInScheme) {
      return
    }

    selectedHexInScheme.isReflected = !selectedHexInScheme.isReflected

    triggerRender({})
  }

  const handleResetTransform = () => {
    if (!selectedHexInScheme) {
      return
    }

    selectedHexInScheme.rotationDeg = 0
    selectedHexInScheme.isReflected = false

    triggerRender({})
  }

  const handleSetRandomTransform = useCallback(() => {
    if (!selectedHexInScheme) {
      return
    }

    selectedHexInScheme.isReflected = getRandomReflectedState()
    selectedHexInScheme.rotationDeg = getRandomRotation()

    triggerRender({})
  }, [selectedHexInScheme])

  const handleSelectLandscapeType = (type: keyof typeof LANDSCAPE_TYPES) => {
    if (!selectedHexInScheme) {
      return
    }

    selectedHexInScheme.landscapeType = type

    triggerRender({})
  }

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

      const mapScheme = JSON.parse(result)

      const {bottom, right} = getMapEdges(mapScheme)

      setWidth(right + 1)
      setHeight(bottom + 1)
      applyMapScheme(mapScheme)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    reader.readAsBinaryString(file)
  }

  const handleSave = () => {
    if (!mapState.mapRef?.current?.mapScheme) {
      enqueueSnackbar('Не удалось сохранить файл', {
        variant: 'error',
        anchorOrigin: {horizontal: 'right', vertical: 'bottom'}
      })
      return
    }

    let el = document.createElement('a')
    el.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        JSON.stringify(mapState.mapRef.current.mapScheme)
      )}`
    )
    el.setAttribute('download', filename)
    el.style.display = 'none'
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
  }

  const applyMapScheme = (mapScheme: RectMapScheme) => {
    mapState.mapRef.current = new RectMap(mapScheme)
    canvas.originOffset.x = 0
    canvas.originOffset.y = 0
  }

  useEffect(() => {
    if (!isResizeRequired) {
      return
    }

    const mapScheme = getDefaultMapScheme({
      top: 0,
      bottom: Number(height) - 1,
      left: 0,
      right: Number(width) - 1
    })

    if (mapState.mapRef.current?.mapScheme) {
      Object.keys(mapScheme).forEach((r) => {
        Object.keys(mapScheme[Number(r)]).forEach((q) => {
          const currentHex =
            mapState.mapRef.current?.mapScheme[Number(r)]?.[Number(q)]

          if (currentHex && mapScheme?.[Number(r)]?.[Number(q)]) {
            mapScheme[Number(r)][Number(q)] = {...currentHex}
          }
        })
      })
    }

    applyMapScheme(mapScheme)
    setIsResizeRequired(false)
  }, [width, height])

  useEffect(() => {
    mapState.setSelectedHex(null)
  }, [width, height])

  useEffect(() => {
    if (!mapState.selectedHex) {
      setSelectedHexInScheme(null)
      return
    }

    const {r, q} = mapState.selectedHex
    const hexInScheme = mapState.mapRef.current?.mapScheme?.[r]?.[q]

    if (!hexInScheme) {
      throw new Error(`q:${q}, r:${r} hex not found in scheme`)
      setSelectedHexInScheme(null)
    }

    setSelectedHexInScheme(hexInScheme)
  }, [mapState.selectedHex])

  const handleSetWidth = (event: ChangeEvent<HTMLInputElement>) => {
    setWidth(Math.min(Number(event.target.value), SIZE_LIMIT))
    setIsResizeRequired(true)
  }

  const handleSetHeight = (event: ChangeEvent<HTMLInputElement>) => {
    setHeight(Math.min(Number(event.target.value), SIZE_LIMIT))
    setIsResizeRequired(true)
  }

  const handleKeyup = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 't') {
        handleSetRandomTransform()
      }
    },
    [handleSetRandomTransform]
  )

  useEffect(() => {
    window.addEventListener('keyup', handleKeyup)

    return () => {
      window.removeEventListener('keyup', handleKeyup)
    }
  }, [handleKeyup])

  return (
    <UI.Wrapper maxWidth="xl">
      <Box
        sx={{
          pt: 4,
          pr: 4,
          pb: 4,
          maxWidth: '320px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly'
        }}
      >
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
          <TextField
            size="small"
            label="Ширина"
            type="number"
            InputLabelProps={{shrink: true}}
            inputProps={{min: 1, max: SIZE_LIMIT}}
            value={width}
            onChange={handleSetWidth}
          />
          {' X '}
          <TextField
            size="small"
            label="Высота"
            type="number"
            InputLabelProps={{shrink: true}}
            inputProps={{min: 1, max: SIZE_LIMIT}}
            value={height}
            onChange={handleSetHeight}
          />
        </Box>

        <Box sx={{display: 'flex', justifyContent: 'space-evenly', mb: 2}}>
          <Tooltip title="Восстановить">
            <IconButton
              onClick={handleResetTransform}
              disabled={isSelectedHexDisabled}
            >
              <RestoreRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Случайная трансформация (T)">
            <IconButton
              onClick={handleSetRandomTransform}
              disabled={!selectedHexInScheme}
            >
              <ShuffleRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Отразить по вертикали">
            <IconButton onClick={handleReflect} disabled={!selectedHexInScheme}>
              <FlipRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Против часовой стрелки">
            <IconButton
              onClick={handleRotateLeft}
              disabled={!selectedHexInScheme}
            >
              <RotateLeftRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="По часовой стрелке">
            <IconButton
              onClick={handleRotateRight}
              disabled={!selectedHexInScheme}
            >
              <RotateRightRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{mb: 2}} />

        <UI.LandscapeButtonsWrapper>
          <LandscapeButtons onSelect={handleSelectLandscapeType} />
        </UI.LandscapeButtonsWrapper>

        <Divider sx={{mt: 'auto', mb: 2}} />

        <Typography mb={2}>{filename || 'файл не загружен'}</Typography>
        <Box sx={{display: 'flex', gap: 1, width: '100%'}}>
          <Button variant="outlined" component="label" sx={{width: '100%'}}>
            Загрузить
            <input
              hidden
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
            />
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
