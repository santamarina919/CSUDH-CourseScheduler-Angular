import {Component, computed, input} from '@angular/core';
import {SchedulerPageState} from '../SchedulerPageState';
import {Course} from '../data-models/Course';
import {Requirement} from '../data-models/Requirement';
import {Prerequisite} from '../data-models/Prerequisite';
import {RequirementSummary} from './requirement-summary/requirement-summary';

@Component({
  selector: 'app-summary-container',
  imports: [
    RequirementSummary
  ],
  templateUrl: './summary-container.html',
  styleUrl: './summary-container.css'
})
export class SummaryContainer {

  state = input.required<SchedulerPageState>()

  roots = input.required<string[]>()

  courses = input.required<Course[]>()

  requirements = input.required<Requirement[]>()

  prerequisites = input.required<Prerequisite[]>()

  coursesMap = computed(() => {
    const coursesMap = new Map<string, Course>()
    this.courses().forEach(course => {
      coursesMap.set(course.id, course)
    })
    return coursesMap
  })

  requirementsMap = computed(() => {
    const requirementsMap = new Map<string, Requirement>()
    this.requirements().forEach(requirement => {
      requirementsMap.set(requirement.requirementId, requirement)
    })
    return requirementsMap
  })

  prerequisitesMap = computed(() => {
    const prerequisitesMap = new Map<string, Prerequisite>()
    this.prerequisites().forEach(prerequisite => {
      prerequisitesMap.set(prerequisite.prereqId, prerequisite)
    })
    return prerequisitesMap
  })
}


