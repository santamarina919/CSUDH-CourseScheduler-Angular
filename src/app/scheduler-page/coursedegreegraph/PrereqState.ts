export class PrereqState {
  constructor(
    public id :string,
    public semesterCompleted :number | null
  ) {
  }

  public isCompleted(){
    return this.semesterCompleted != null
  }
}
