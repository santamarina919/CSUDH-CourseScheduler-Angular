import {Component, computed, inject, input, signal} from '@angular/core';
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

@Component({
  selector: 'app-planning-container',
  imports: [
    CdkDropListGroup,
    CdkDrag,
    CdkDropList,
    MatButton,
  ],
  templateUrl: './planning-container.html',
  styleUrl: './planning-container.css'
})
export class PlanningContainer{


  state = input.required<SchedulerPageState>()

  planDetails = input.required<FullPlanDetails>()

  /**
   * This is the first semester users can actually add classes to
   */
  FIRST_SEMESTER = 1

  DEFAULT_BIGGEST_SEMESTER = 2 * 4

  currentSemester = signal<number>(this.FIRST_SEMESTER)

  biggestSemester = signal(this.DEFAULT_BIGGEST_SEMESTER)

  currentDragOverSemester = signal(0)

  minimumValidSemesterDrop = signal(0)

  removeDialog = inject(MatDialog)

  semesters(){
    const groupedCourses = this.coursesGroupedBySemester()
    const semesters :Semester[] = []
    for(let i = 1; i <= this.biggestSemester(); i++){
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

    if(largestPlannedSemester > this.biggestSemester()){
      this.biggestSemester.set(largestPlannedSemester)
    }
    return groupedCourses
  }


  incrementSemester() {
    this.biggestSemester.update((curr) => curr + 1)
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
    console.log(`dragging over semester ${semester}`)
  }

  isDraggingOverSemester(semester :number){
    return this.currentDragOverSemester() == semester
  }

  addCourse($event: CdkDragDrop<string>) {
    if($event.container == $event.previousContainer){
      return
    }
    const courseId = $event.item.data as string
    this.state().addCourseToSchedule(courseId,this.currentSemester())
    this.setMinimumValidSemesterDrop(0)
  }

  setMinimumValidSemesterDrop(semester: number) {
    this.minimumValidSemesterDrop.set(semester)
  }

  resetMinimumValidSemesterDrop() {
    this.minimumValidSemesterDrop.set(0)
  }

  openRemovePreview(withCourseId :string){
    const toBeRemoved = this.state().previewCourseRemoval(withCourseId)
      .map(courseId => this.state().courseWith(courseId))
    this.removeDialog.open(RemoveDialog, {
        data : {
          toBeRemoved : toBeRemoved, onRemoveClick : () => {this.state().removeCourse(withCourseId)}
        }
      })
  }

  protected readonly COURSE_ID = COURSE_ID;
  protected readonly COURSE_NAME = COURSE_NAME;
}
