import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {SchedulerPageState} from './SchedulerPageState';
import {ActivatedRoute} from '@angular/router';
import {RouteParameters} from '../app.routes';
import {forkJoin, Observable} from 'rxjs';
import {DegreeService} from '../service/degree.service';
import {PlanService} from '../service/plan.service';
import {CourseDegreeGraphBuilder} from './coursedegreegraph/CourseDegreeGraphBuilder';
import {CourseDegreeGraph} from './coursedegreegraph/CourseDegreeGraph';
import {MatButton, MatIconButton} from '@angular/material/button';
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
  MatListOption,
  MatSelectionList
} from '@angular/material/list';
import {SummaryNode} from './summary-node/summary-node';
import {Course} from './data-models/Course';
import {Requirement} from './data-models/Requirement';
import {Prerequisite} from './data-models/Prerequisite';
import {PlannedCourse} from './data-models/PlannedCourse';
import {FullPlanDetails} from './data-models/FullPlanDetails';
import {calcTerm} from '../utils/CalcTermFromSemester';
import {calcYear} from '../utils/CalcYearFromSemester';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {CurrencyPipe, NgClass} from '@angular/common';
import {CdkScrollable} from '@angular/cdk/overlay';
import {
  MatExpansionPanel,
  MatExpansionPanelTitle,
  MatExpansionPanelHeader,
  MatAccordion, MatExpansionPanelDescription
} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {RemoveDialog} from './remove-dialog/remove-dialog';
import {CourseRemoveBuilder} from './effects/CourseRemove';
import {MatIcon} from '@angular/material/icon';
import {SerializedRequirementPanel} from './serialized-requirement-panel/serialized-requirement-panel';
import {SerializedRequirement} from './degree-progress/SerializedRequirement';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PlanningContainer} from './planning-container/planning-container';


const START_SEMESTER = 1

@Component({
  selector: 'app-schedule-page',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    PlanningContainer,
  ],
  templateUrl: './scheduler-page.html',
  styleUrl: './scheduler-page.css'
})
export class SchedulerPage {

  activatedRoute = inject(ActivatedRoute)

  degreeService = inject(DegreeService)

  planService = inject(PlanService)

  removeDialog = inject(MatDialog)

  snackbar = inject(MatSnackBar)

  state: SchedulerPageState | null = null;

  planDetails = signal<FullPlanDetails>(new FullPlanDetails("DummyId","My Computer Science Degree","Fall",2019,"CSC"))

  isLoading = signal<boolean>(true)

  semesterNumber = signal<number>(START_SEMESTER)

  semesterDrop = signal<number>(START_SEMESTER)

  invalidSemesterDrops = signal<number>(0)

  semesterTerm = computed(() => {
    return calcTerm(this.planDetails().term,this.semesterNumber())
  })
  semesterYear = computed(() => {
    return calcYear(this.planDetails().year,this.semesterNumber())
  })


  constructor() {
    const planId = this.activatedRoute.snapshot.paramMap.get(RouteParameters.planId) ?? "Missing plan id"

    const degreeId = this.activatedRoute.snapshot.paramMap.get(RouteParameters.degreeId) ?? "Missing degree id"

    const coursesObservable$ = this.degreeService.fetchCourses(degreeId)

    const requirementObservable$ = this.degreeService.fetchRequirements(degreeId)

    const prerequisiteObservable$ = this.degreeService.fetchPrerequisites(degreeId)

    const plannedObservable$ = this.planService.plannedCourses(planId)

    const rootsObservable$ = this.degreeService.fetchRootsOfDegree(degreeId)

    const planDetailsObservable$ = this.planService.planDetails(planId)

    const jobs  = [coursesObservable$, requirementObservable$, prerequisiteObservable$, plannedObservable$,rootsObservable$,planDetailsObservable$]

    const JOB_INDEXES = {
      COURSES : 0,
      REQUIREMENTS :1,
      PREREQUISITES : 2,
      PLANNED : 3,
      ROOTS : 4,
      PLAN_DETAILS : 5,
    }

    forkJoin(jobs).subscribe(finishedJobs => {
      const courses = finishedJobs[JOB_INDEXES.COURSES] as Course[]
      const requirements = finishedJobs[JOB_INDEXES.REQUIREMENTS] as Requirement[]
      const prerequisites = finishedJobs[JOB_INDEXES.PREREQUISITES] as Prerequisite[]
      const planned = finishedJobs[JOB_INDEXES.PLANNED] as PlannedCourse[]
      const roots = finishedJobs[JOB_INDEXES.ROOTS] as string[]
      const planDetails = finishedJobs[JOB_INDEXES.PLAN_DETAILS] as FullPlanDetails
      planDetails.term = (planDetails.term as unknown as string )== "FALL" ? "Fall" : "Spring"

      const courseDegreeGraph = new CourseDegreeGraphBuilder(courses,requirements,prerequisites,planned,roots).outputGraph

      this.state = new SchedulerPageState(courseDegreeGraph,planDetails,this.planService,courses)
      this.isLoading.set(false)
    })
  }
  //
  // handleDragStartEvent(draggedCourse :Course) {
  //   this.invalidSemesterDrops.set(draggedCourse.semesterAvailable!)
  // }
  //
  //
  // addCourseToSemester(event :CdkDragDrop<number>) {
  //   this.invalidSemesterDrops.set(0)
  //   if(event.previousContainer === event.container){
  //     return
  //   }
  //   const courseData = event.item.data as Course
  //   const availCourseDrag = courseData.semesterAvailable != null && courseData.semesterPlanned == null
  //   if(availCourseDrag){
  //     this.state!.addCourseToSchedule(courseData,this.semesterDrop())
  //   }
  // }


  handleSemesterHeaderClick(semester: number) {
    this.semesterNumber.set(semester)
  }

  handleDragEnter(semester :number) {
    this.semesterDrop.set(semester)
  }
  // canDropPredicate = (drag :CdkDrag, list :CdkDropList) => {
  //   const course = drag.data as Course
  //   const semester = list.data as number
  //   return (course.semesterAvailable!) == 0 || (semester > course.semesterAvailable!)
  // }
  //
  //
  // handlePlannedCourseClick(courseId: string) {
  //   const removeEffect = new CourseRemoveBuilder()
  //   const toBeRemoved = this.state?.removeCourseFromSchedule(courseId,removeEffect)
  //   const removeFunc = () => {
  //     toBeRemoved?.forEach(course => {
  //       this.setCourseUnplanned(course.id)
  //       this.state?.effects.push(removeEffect.build())
  //     })
  //   }
  //   this.removeDialog.open(RemoveDialog,{data : {toBeRemoved  : toBeRemoved, onRemoveClick : removeFunc}})
  // }

  // setCourseUnplanned(courseId: string) {
  //   this.state!.unplanCourse(courseId, true)
  // }


}
