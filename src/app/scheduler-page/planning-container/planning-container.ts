import {Component, computed, input, signal} from '@angular/core';
import {SchedulerPageState} from '../SchedulerPageState';
import {CdkDrag, CdkDropList, CdkDropListGroup} from '@angular/cdk/drag-drop';
import {Semester} from '../data-models/Semester';
import {Course} from '../data-models/Course';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-planning-container',
  imports: [
    CdkDropListGroup,
    CdkDrag,
    CdkDropList,
    MatButton
  ],
  templateUrl: './planning-container.html',
  styleUrl: './planning-container.css'
})
export class PlanningContainer{


  state = input.required<SchedulerPageState>()

  /**
   * This is the first semester users can actually add classes to
   */
  FIRST_SEMESTER = 1

  DEFAULT_BIGGEST_SEMESTER = 2 * 4

  currentSemester = signal<number>(this.FIRST_SEMESTER)

  biggestSemester = signal(this.DEFAULT_BIGGEST_SEMESTER)

  semesters(){
    const groupedCourses = this.coursesGroupedBySemester()
    const semesters :Semester[] = []
    for(let i = 1; i <= this.biggestSemester(); i++){
      semesters.push(new Semester(i,groupedCourses.get(i) ?? []))
    }
    return semesters
  }

  coursesGroupedBySemester() :Map<number,string[]> {
    const groupedCourses = new Map<number,string[]>()

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
      courseList.push(`${courseDetails.id} ${courseDetails.name}`)
    })

    if(largestPlannedSemester > this.biggestSemester()){
      this.biggestSemester.set(largestPlannedSemester)
    }
    return groupedCourses
  }


  incrementSemester() {
    this.biggestSemester.update((curr) => curr + 1)
  }


}
