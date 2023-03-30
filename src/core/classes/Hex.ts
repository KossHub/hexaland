import {
  AxialCoordinates,
  CubeCoordinates,
  ShortCubeCoordinates
} from '../../contexts/canvas/interfaces'

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

  public getAxialCoordinates(radius: number): AxialCoordinates {
    return {
      x: radius * (Math.sqrt(3) * this._q + (Math.sqrt(3) / 2) * this._r),
      y: radius * ((3 / 2) * this._r)
    }
  }

  public getCubeCoordinates(): CubeCoordinates {
    return {
      q: this._q,
      r: this._r,
      s: this.s
    }
  }

  public getShortCubeCoordinates(): ShortCubeCoordinates {
    return {
      q: this._q,
      r: this._r
    }
  }
}
