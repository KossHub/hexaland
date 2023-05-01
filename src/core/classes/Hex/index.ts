import {
  AxialCoords,
  CubeCoords,
  ShortCubeCoords
} from '../../../contexts/canvas/interfaces'
import {GAME_MAP_BORDER_SIZE} from '../../../constants'

export class Hex {
  constructor(private _q: number, private _r: number) {}

  public get q(): number {
    return this._q
  }

  public get r(): number {
    return this._r
  }

  public get s(): number {
    return -this._q - this._r
  }

  public getAxialCoords(radius: number): AxialCoords {
    return {
      x: radius * (Math.sqrt(3) * this._q + (Math.sqrt(3) / 2) * this._r),
      y: radius * ((3 / 2) * this._r)
    }
  }

  /** consider scale, offset and map border */
  public getAxialShiftedCoords(radius: number, scale: number): AxialCoords {
    const originCoords = this.getAxialCoords(radius)

    return {
      x:
        originCoords.x + // origin
        (Math.sqrt(3) * radius) / 2 + // projecting hex part
        GAME_MAP_BORDER_SIZE / scale, // borders
      y:
        originCoords.y + // origin
        radius + // projecting hex part
        GAME_MAP_BORDER_SIZE / scale // borders
    }
  }

  public getCubeCoords(): CubeCoords {
    return {
      q: this._q,
      r: this._r,
      s: this.s
    }
  }

  public getShortCubeCoords(): ShortCubeCoords {
    return {
      q: this._q,
      r: this._r
    }
  }
}
