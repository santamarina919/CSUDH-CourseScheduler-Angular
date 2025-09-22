import {Effect} from './effect';
import {AffectedCourseState} from './affected-course-state';

export class CourseRemove extends Effect {
  private removedCourse: string;
  constructor(courseId: string, previousState: AffectedCourseState[], currentState: AffectedCourseState[]) {
    super()
    this.removedCourse = courseId;
    this.courseStates = this.stateDifference(previousState, currentState);
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
