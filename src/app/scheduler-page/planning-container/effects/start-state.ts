import {Effect} from './effect';
import {AffectedCourseState} from './affected-course-state';


export class StartState extends Effect {

  constructor(states :AffectedCourseState[]) {
    super();
    this.courseStates = states;
  }

  subject(): string {
    return 'STATE';
  }

  verb(): string {
    return 'START';
  }

  verbClass(): string {
    return 'base';
  }

}
