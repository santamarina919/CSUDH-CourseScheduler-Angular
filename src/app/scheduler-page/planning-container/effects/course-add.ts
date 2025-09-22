import {Effect} from './effect';
import {AffectedCourseState} from './affected-course-state';

export class CourseAdd extends Effect {
  private addedCourse: string;
  public constructor(courseId :string, previousState : AffectedCourseState[], currentState : AffectedCourseState[]) {
    super()
    this.addedCourse = courseId
    this.courseStates = this.stateDifference(previousState, currentState);
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
