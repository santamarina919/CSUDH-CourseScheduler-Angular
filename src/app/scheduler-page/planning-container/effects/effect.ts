import {AffectedCourseState} from './affected-course-state';


export abstract class Effect {

  protected courseStates :AffectedCourseState[] = []

  private prerequisiteStates = []

  private degreeRequirementStates = []

  private effectId  = crypto.randomUUID()

  protected constructor() {}

  public get id() {
    return this.effectId;
  }

  public abstract verbClass() :string;

  public abstract verb() :string;

  public abstract subject() :string;

  public currentCourseStates() {
    return this.courseStates;
  }

  protected stateDifference(previous :AffectedCourseState[], current :AffectedCourseState[]) {
    const previousState = new Map<string, AffectedCourseState>(previous.map(course => [course.id, course]));

    return  current.filter(
      currState =>
      previousState.get(currState.id)!.semesterPlanned !== currState.semesterPlanned ||
      previousState.get(currState.id)!.semesterAvailable !== currState.semesterAvailable
    )
  }

}
