import {Component, computed, inject, input, OnInit, signal} from '@angular/core';
import {SchedulerPageState} from '../SchedulerPageState';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  CdkDropListGroup
} from '@angular/cdk/drag-drop';
import {COURSE_ID, COURSE_NAME, Semester} from './Semester';
import {Course} from '../data-models/Course';
import {MatButton} from '@angular/material/button';
import {PlanDetails} from '../../plans-page/PlanDetails';
import {FullPlanDetails} from '../data-models/FullPlanDetails';
import {calcTerm} from '../../utils/CalcTermFromSemester';
import {calcYear} from '../../utils/CalcYearFromSemester';
import {CdkNoDataRow} from '@angular/cdk/table';
import {MatDialog} from '@angular/material/dialog';
import {RemoveDialog} from '../remove-dialog/remove-dialog';
import {sampleTime} from 'rxjs';
import {Effect} from './effects/effect';
import {CourseAdd} from './effects/course-add';
import {CourseRemove} from './effects/course-remove';
import {StartState} from './effects/start-state';
import {AffectedCourseState} from './effects/affected-course-state';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';

@Component({
  selector: 'app-planning-container',
  imports: [
    CdkDropListGroup,
    CdkDrag,
    CdkDropList,
    MatButton,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
  ],
  templateUrl: './planning-container.html',
  styleUrl: './planning-container.css'
})
export class PlanningContainer implements OnInit{
  state = input.required<SchedulerPageState>()


  planDetails = input.required<FullPlanDetails>()

  /**
   * This is the first semester users can actually add classes to
   */
  FIRST_SEMESTER = 1

  DEFAULT_BIGGEST_SEMESTER = 2 * 4

  currentSemester = signal<number>(this.FIRST_SEMESTER)

  biggestSemester = this.DEFAULT_BIGGEST_SEMESTER

  currentDragOverSemester = signal(0)

  minimumValidSemesterDrop = signal(0)

  removeDialog = inject(MatDialog)

  effects :Effect[] = []

  ngOnInit(): void {
    const states :AffectedCourseState[] = this.state().courseStates()
    this.effects.push(new StartState(states))
  }

  semesters(){
    const groupedCourses = this.coursesGroupedBySemester()
    const semesters :Semester[] = []
    for(let i = 1; i <= this.biggestSemester; i++){
      semesters.push(new Semester(i,groupedCourses.get(i) ?? []))
    }
    return semesters
  }

  coursesGroupedBySemester() :Map<number,[string,string][]> {
    const groupedCourses = new Map<number,[string,string][]>()

    let largestPlannedSemester = Number.MIN_SAFE_INTEGER

    const plannedCourses = this.state().planned()
    plannedCourses.forEach(courseState => {
      const semester = courseState.semesterPlanned!
      if(semester > largestPlannedSemester){
        largestPlannedSemester = semester
      }
      if(!groupedCourses.has(semester)){
        groupedCourses.set(semester,[])
      }
      const courseList = groupedCourses.get(semester)!
      const courseDetails = this.state().courseWith(courseState.id)
      courseList.push([courseDetails.id,courseDetails.name])
    })

    if(largestPlannedSemester > this.biggestSemester){
      this.biggestSemester = largestPlannedSemester
    }
    return groupedCourses
  }


  incrementSemester() {
    this.biggestSemester = this.biggestSemester + 1
  }

  semesterTitle(semesterNumber :number){
    return calcTerm(this.planDetails().term,semesterNumber) + " " +
      calcYear(this.planDetails().year,semesterNumber) + " " +
      `Semester #${semesterNumber}`
  }

  setSemester(semester :number){
    this.currentSemester.set(semester)
  }

  setDragOverSemesterSignal(semester: number) {
    this.currentDragOverSemester.set(semester)
  }

  resetDragOverSemesterSignal() {
    this.currentDragOverSemester.set(0)
  }

  isDraggingOverSemester(semester :number){
    return this.currentDragOverSemester() == semester
  }

  addCourse($event: CdkDragDrop<string> | null, clickedCourse :string | null) {
    let courseId :string | null = null


    if($event != null && $event.container == $event.previousContainer){
      return
    }
    if($event != null) {
      courseId = $event.item.data as string
    }
    else {
      courseId = clickedCourse!
    }

    const previousState = this.state().courseStates()
    this.state().addCourseToSchedule(courseId,this.currentDragOverSemester() != 0 ? this.currentDragOverSemester() :  this.currentSemester())
    const currentState = this.state().courseStates()
    this.setMinimumValidSemesterDrop(0)
    this.resetDragOverSemesterSignal()
    this.effects.push(new CourseAdd(courseId,previousState,currentState))
  }

  setMinimumValidSemesterDrop(semester: number) {
    console.log("Setting minimum valid semester drop to " + semester)
    this.minimumValidSemesterDrop.set(semester)
  }

  resetMinimumValidSemesterDrop() {
    this.minimumValidSemesterDrop.set(0)
  }

  openRemovePreview(withCourseId :string){
    const toBeRemoved = this.state().previewCourseRemoval(withCourseId)
      .map(courseId => this.state().courseWith(courseId))
    const removeFunc = () => {
      const prevStates = this.state().courseStates()
      this.state().removeCourse(withCourseId)
      const currentStates = this.state().courseStates()
      this.effects.push(new CourseRemove(withCourseId,prevStates,currentStates))
    }
    this.removeDialog.open(RemoveDialog, {
        data : {
          toBeRemoved : toBeRemoved, onRemoveClick : removeFunc
        }
      })
  }


  isValidDropPredicate(cdkDrag: CdkDrag<string>) {
  }



  protected readonly COURSE_ID = COURSE_ID;
  protected readonly COURSE_NAME = COURSE_NAME;
}
