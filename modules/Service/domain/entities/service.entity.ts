export class Service {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public duration: number,
    public description?: string,
    public image?: string,
  ) {}
}
