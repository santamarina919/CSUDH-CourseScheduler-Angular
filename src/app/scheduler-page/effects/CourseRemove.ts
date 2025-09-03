import {EffectItem} from './EffectItem';
import {ActionType, ScheduleEffect} from './ScheduleEffect';

export class CourseRemove extends ScheduleEffect {
  constructor(
    private courseId: string,
    private _effectItems: EffectItem[]
    ) {
    super();
  }

  actionTaken(): string {
    return "REMOVED";
  }

  focus(): string {
    return this.courseId;
  }

  effectItems() :EffectItem[]{
    return this._effectItems;
  }

  actionType(): ActionType {
    return 'REMOVAL';
  }
}


export type RemovedCourse = [string, number];

export class RemovedCoursesEffect implements EffectItem{
  constructor(
    private courses :RemovedCourse[]
  ) {
  }

  currentState(): string {
    return '<- have been removed from your plan';
  }

  focus(): string {
    return this.courses.map(str => `${str[0]} (S${str[1]})`).join(', ');
  }

}

export class UncompletePrereq implements EffectItem {
  constructor(
    private prereqId: string,
  ) {
  }

  currentState(): string {
    return "is no longer complete";
  }

  focus(): string {
    return this.prereqId;
  }
}

export class CourseRemoveBuilder {
  courseId : string | null = null;
  _effectItems : EffectItem[] = [];

  for(courseId :string){
    this.courseId = courseId;
    return this;
  }

  removes(courses :RemovedCourse[]){
    this._effectItems.push(new RemovedCoursesEffect(courses));
    return this;
  }

  uncompletesPrereq(prereqId :string){
    this._effectItems.push(new UncompletePrereq(prereqId))
  }


  build() : CourseRemove {
    if(this.courseId == null){
      throw new Error('Course ID must be set');
    }
    return new CourseRemove(this.courseId, this._effectItems);
  }
}
