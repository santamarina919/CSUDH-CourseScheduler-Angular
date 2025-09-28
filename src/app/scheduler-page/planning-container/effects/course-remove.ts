import {Effect} from './effect';
import {AffectedCourseState} from './affected-course-state';

export class CourseRemove extends Effect {
  private removedCourse: string;
  private previousSemester :number
  constructor(courseId: string, previousState: AffectedCourseState[], currentState: AffectedCourseState[], previousSemester :number) {
    super()
    this.removedCourse = courseId;
    this.courseStates = this.stateDifference(previousState, currentState);
    this.previousSemester = previousSemester;
  }

  verb(): string {
    return "REMOVED";
  }

  subject(): string {
    return this.removedCourse
  }

  override verbClass(): string {
    return "negativeColor"
  }

  public previousPlannedSemester() {
    return this.previousSemester;
  }



}
