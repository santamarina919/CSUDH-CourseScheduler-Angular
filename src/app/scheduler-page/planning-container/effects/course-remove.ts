import {Effect} from './effect';

export class CourseRemove extends Effect {
  private removedCourse: string;
  constructor(courseId: string) {
    super()
    this.removedCourse = courseId;
  }

  verb(): string {
    return "REMOVED";
  }

  subject(): string {
    return this.removedCourse.toUpperCase();
  }

  override verbClass(): string {
    return "negativeColor"
  }


}
