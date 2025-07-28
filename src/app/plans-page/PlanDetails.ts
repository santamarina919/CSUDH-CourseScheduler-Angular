

export class PlanDetails {
  constructor(
    private _id: string,
    private _name: string,
    private _term: string,
    private _year: number,
    private _majorId: string,
    private _owner: string
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get term(): string {
    return this._term;
  }

  get year(): number {
    return this._year;
  }

  get majorId(): string {
    return this._majorId;
  }
  get owner(): string {
    return this._owner;
  }

}
