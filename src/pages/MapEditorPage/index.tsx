import React, {
  ChangeEvent,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {isString} from 'lodash'
import {Box, Button, Divider, IconButton, Typography} from '@mui/material'
import {
  RotateRightRounded as RotateRightRoundedIcon,
  FlipRounded as FlipRoundedIcon,
  RotateLeftRounded as RotateLeftRoundedIcon,
  RestoreRounded as RestoreRoundedIcon,
  ShuffleRounded as ShuffleRoundedIcon,
  ClearRounded as ClearRoundedIcon
} from '@mui/icons-material'

import Canvas from '../../components/Canvas'
import TextField from '../../components/TextField'
import Tooltip from '../../components/Tooltip'
import LandscapeButtons from '../../components/LandscapeButtons'
import {SIZE_LIMIT, SNACKBAR_POSITION} from './constants'
import {LANDSCAPES} from '../../core/classes/LandscapeTemplates/constants'
import {RectMap} from '../../core/classes/GameMap/RectMap'
import {
  MapEventListener,
  RectMapScheme,
  RectMapSchemeRow
} from '../../core/interfaces/map.interfaces'
import {useMapContext} from '../../contexts/map/useMapContext'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import {isJSON} from '../../utils/checker'
import {
  getDefaultMapScheme,
  getRandomReflectedState,
  getRandomRotation
} from '../../core/utils/canvasTemplate.utils'
import {getMapEdges} from '../../core/utils/mapCalculated'
import {useMap2DViewContext} from '../../contexts/map2DView/useMap2DViewContext'
import * as UI from './styles'
import {ShortCubeCoords} from '../../contexts/canvas/interfaces'
import {parseMap, simplifyMap} from '../../utils/mapStorage'

const MapEditorPage = () => {
  const mapState = useMapContext()
  const map2DView = useMap2DViewContext()
  const {enqueueSnackbar} = useSnackbar()

  const fileInputRef = useRef<null | HTMLInputElement>(null)

  const [width, setWidth] = useState(10)
  const [height, setHeight] = useState(10)
  const [isResizeRequired, setIsResizeRequired] = useState(true)
  const [filename, setFilename] = useState('')
  const [selectedHexInScheme, setSelectedHexInScheme] = useState<
    null | RectMapSchemeRow[keyof RectMapSchemeRow]
  >(null)
  const [selectedLandscape, setSelectedLandscape] = useState<
    null | keyof typeof LANDSCAPES
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

  const handleRotateRight = useCallback(() => {
    if (!selectedHexInScheme) {
      return
    }

    const delta = selectedHexInScheme.isReflected ? 300 : 60

    selectedHexInScheme.rotationDeg =
      (selectedHexInScheme.rotationDeg + delta) % 360

    triggerRender({})
  }, [
    selectedHexInScheme,
    selectedHexInScheme?.isReflected,
    selectedHexInScheme?.rotationDeg
  ])

  const handleRotateLeft = useCallback(() => {
    if (!selectedHexInScheme) {
      return
    }

    const delta = selectedHexInScheme.isReflected ? 60 : 300

    selectedHexInScheme.rotationDeg =
      (selectedHexInScheme.rotationDeg + delta) % 360

    triggerRender({})
  }, [
    selectedHexInScheme,
    selectedHexInScheme?.isReflected,
    selectedHexInScheme?.rotationDeg
  ])

  const handleReflect = useCallback(() => {
    if (!selectedHexInScheme) {
      return
    }

    selectedHexInScheme.isReflected = !selectedHexInScheme.isReflected

    triggerRender({})
  }, [selectedHexInScheme, selectedHexInScheme?.isReflected])

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

  const handleSelectLandscapeType = (type: keyof typeof LANDSCAPES) => {
    const newLandscape = selectedLandscape === type ? null : type

    if (selectedHexInScheme && newLandscape) {
      selectedHexInScheme.landscapeType = newLandscape
    }

    setSelectedLandscape(newLandscape)
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
          variant: 'error',
          ...SNACKBAR_POSITION
        })
        return
      }

      setFilename(name)

      const mapScheme = parseMap(JSON.parse(result))

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
        ...SNACKBAR_POSITION
      })
      return
    }

    const simplifiedMap = simplifyMap(mapState.mapRef.current.mapScheme)

    let el = document.createElement('a')

    el.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        JSON.stringify(simplifiedMap)
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
    mapState.setIsInitialized(true)
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
    if (!map2DView.current) {
      return
    }

    map2DView.current.selectedHex = null
  }, [width, height])

  useEffect(() => {
    const listener: MapEventListener = {
      onChangeSelectedHex: (selectedHex: null | ShortCubeCoords) => {
        if (!selectedHex) {
          setSelectedHexInScheme(null)
          setSelectedLandscape(null)
          return
        }

        const {r, q} = selectedHex
        const hexInScheme = mapState.mapRef.current?.mapScheme?.[r]?.[q]

        if (!hexInScheme) {
          throw new Error(`q:${q}, r:${r} hex not found in scheme`)
          setSelectedHexInScheme(null)
        }

        setSelectedHexInScheme(hexInScheme)

        if (selectedLandscape) {
          hexInScheme.landscapeType = selectedLandscape
        } else {
          setSelectedLandscape(hexInScheme.landscapeType)
        }
      }
    }

    map2DView.current?.subscribe?.(listener)

    return () => {
      map2DView.current?.unsubscribe?.(listener)
    }
  }, [selectedLandscape])

  const handleSetWidth = (event: ChangeEvent<HTMLInputElement>) => {
    setWidth(Math.min(Number(event.target.value), SIZE_LIMIT))
    setIsResizeRequired(true)
  }

  const handleSetHeight = (event: ChangeEvent<HTMLInputElement>) => {
    setHeight(Math.min(Number(event.target.value), SIZE_LIMIT))
    setIsResizeRequired(true)
  }

  useEffect(() => {
    const handleKeyup = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'w': {
          handleReflect()
          break
        }
        case 'e': {
          handleRotateLeft()
          break
        }
        case 'r': {
          handleRotateRight()
          break
        }
        default: {
        }
      }
    }

    window.addEventListener('keyup', handleKeyup)

    return () => {
      window.removeEventListener('keyup', handleKeyup)
    }
  }, [
    handleSetRandomTransform,
    handleReflect,
    handleRotateLeft,
    handleRotateRight
  ])

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

          <Tooltip title="Случайная трансформация">
            <IconButton
              onClick={handleSetRandomTransform}
              disabled={!selectedHexInScheme}
            >
              <ShuffleRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Отразить по вертикали (W)">
            <IconButton onClick={handleReflect} disabled={!selectedHexInScheme}>
              <FlipRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Против часовой стрелки (E)">
            <IconButton
              onClick={handleRotateLeft}
              disabled={!selectedHexInScheme}
            >
              <RotateLeftRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="По часовой стрелке (R)">
            <IconButton
              onClick={handleRotateRight}
              disabled={!selectedHexInScheme}
            >
              <RotateRightRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Box mb={2} sx={{position: 'relative'}}>
          <Typography sx={{fontWeight: selectedLandscape ? 600 : 400}}>
            {LANDSCAPES[selectedLandscape as keyof typeof LANDSCAPES]?.name ||
              'ландшафт не выбран'}
          </Typography>

          {selectedLandscape && (
            <IconButton
              size="small"
              onClick={() => setSelectedLandscape(null)}
              sx={{position: 'absolute', bottom: 0, right: 0}}
            >
              <ClearRoundedIcon />
            </IconButton>
          )}
        </Box>

        <UI.LandscapeButtonsWrapper>
          <LandscapeButtons
            active={selectedLandscape}
            onSelect={handleSelectLandscapeType}
          />
        </UI.LandscapeButtonsWrapper>

        <Divider sx={{mt: 'auto', mb: 2}} />

        <Typography mb={2} sx={{userSelect: 'none'}}>
          {filename || 'файл не загружен'}
        </Typography>
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
