import {ActionType, ScheduleEffect} from './ScheduleEffect';
import {EffectItem} from './EffectItem';


export class CourseAdd extends ScheduleEffect{
  constructor(
    private courseId: string,
    private _effectItems: EffectItem[],
  ) {
    super()
  }


  actionTaken(): string {
    return 'ADDED';
  }

  effectItems(): EffectItem[] {
    return this._effectItems;
  }

  focus(): string {
    return this.courseId;
  }

  actionType(): ActionType {
    return 'ADDITION';
  }

}

export class PrerrequisiteCompletion implements EffectItem{
  constructor(
    private prereqId: string,
  ) {}

  currentState(): string {
    return "is now complete";
  }

  focus(): string {
    return this.prereqId;
  }
}

export class CourseAvailable implements EffectItem{
  constructor(
    private courseId: string,
    private semester: number,
  ) {}



  currentState(): string {
    return `is now available for semester #${this.semester + 1}`;
  }

  focus(): string {
    return this.courseId;
  }
}

export class RequirementComplete implements EffectItem{
  constructor(
    private requirementId: string,
  ) {}

  currentState(): string {
    return "is now complete";
  }

  focus(): string {
    return this.requirementId;
  }
}

export class CourseAddBuilder {
  private courseId : string | null = null;

  private _effectItems : EffectItem[] = [];

  constructor() {}

  for(courseId :string){
    this.courseId = courseId;
    return this;
  }

  statisfiesPrerequisite(prereqId :string){
    this._effectItems.push(new PrerrequisiteCompletion(prereqId))
    return this;
  }

  freesCourse(courseId :string, semester:number){
    this._effectItems.push(new CourseAvailable(courseId, semester))
    return this;
  }

  degreeRequirementComplete(requirementId :string){
    this._effectItems.push(new RequirementComplete(requirementId))
  }

  build() : CourseAdd {
    if(this.courseId == null){
      throw new Error('Course ID must be set');
    }
    return new CourseAdd(this.courseId, this._effectItems);
  }

}
