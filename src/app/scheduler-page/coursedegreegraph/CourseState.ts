export class CourseState {
  constructor(
    private _id :string,
    private _semesterAvailable:number | null,
    private _semesterPlanned:number  | null,
  ) {
  }
  get id(): string {
    return this._id;
  }

  get semesterAvailable(): number | null {
    return this._semesterAvailable;
  }

  get semesterPlanned(): number | null {
    return this._semesterPlanned;
  }
}
