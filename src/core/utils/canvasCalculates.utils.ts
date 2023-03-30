import {AxialCoordinates} from '../../contexts/canvas/interfaces'

export const getTouchesDistance = (touch1: Touch, touch2: Touch) =>
  Math.sqrt(
    Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
  )

export const getTouchesMidpoint = (
  touch1: Touch,
  touch2: Touch
): AxialCoordinates => ({
  x: (touch1.clientX + touch2.clientX) / 2,
  y: (touch1.clientY + touch2.clientY) / 2
})

export const getHexTileWidth = (radius: number) => radius * Math.sqrt(3)
export const getHexTileHeight = (radius: number) => radius * 2
