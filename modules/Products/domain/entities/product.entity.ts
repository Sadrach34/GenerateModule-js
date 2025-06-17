export class Products {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public stock: number,
    public expiration: Date,
    public description?: string,
    public image?: string,
  ) {}
}
