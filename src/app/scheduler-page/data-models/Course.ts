export class Course {

  constructor(
    public id: string,
    public name: string,
    public units: number,
    public semesterPlanned: number | null,
    public semesterAvailable: number | null,
  ) {
  }

}
