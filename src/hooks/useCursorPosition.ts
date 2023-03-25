import {useCallback} from 'react'
import {CanvasObj} from '../interfaces'

export const useCursorPosition = (canvas: CanvasObj) => {
  const onMousemove = useCallback((event: MouseEvent) => {
    const rect = canvas.ref.getBoundingClientRect()
    canvas.cursorPos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }, [])

  const addMousemoveListener = () => {
    canvas.ref.addEventListener('mousemove', onMousemove)
  }

  const removeMousemoveListener = () => {
    canvas.ref.removeEventListener('mousemove', onMousemove)
  }

  return {
    addMousemoveListener,
    removeMousemoveListener
  }
}
