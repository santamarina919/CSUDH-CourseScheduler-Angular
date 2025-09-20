import {Effect} from './effect';

export class CourseAdd extends Effect {
  private addedCourse: string;
  public constructor(courseId :string) {
    super()
    this.addedCourse = courseId
  }

  public verb(): string {
    return "ADDED";
  }

  public subject(): string {
    return this.addedCourse.toUpperCase();
  }

  override verbClass(): string {
    return "positiveColor"
  }

}
