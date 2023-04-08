export class DrawnTemplates {
  protected _scheme: any = null

  constructor() {}

  protected fillTemplates(radius: number): void {
    throw new Error('Method not implemented.')
  }

  public get scheme() {
    return this._scheme
  }
}
