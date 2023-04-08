export const getCanvasTemplate = (
  radius: number
): {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
} => {
  const canvas = document.createElement('canvas')
  const size = radius * 2
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  return {
    canvas,
    ctx
  }
}
