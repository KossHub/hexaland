export const drawHexShape = (ctx: CanvasRenderingContext2D, radius: number) => {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30
    const angleRad = (Math.PI / 180) * angleDeg
    ctx.lineTo(
      radius * Math.cos(angleRad) + radius,
      radius * Math.sin(angleRad) + radius
    )
  }
  ctx.closePath()
}
