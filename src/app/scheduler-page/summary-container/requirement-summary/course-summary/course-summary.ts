import {Component, forwardRef, input, Input} from '@angular/core';
import {Course} from '../../../data-models/Course';
import {Prerequisite} from '../../../data-models/Prerequisite';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {RequirementSummary} from '../requirement-summary';
import {PrerequisiteSummary} from './prerequisite-summary/prerequisite-summary';

@Component({
  selector: 'app-course-summary',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    PrerequisiteSummary
  ],
  templateUrl: './course-summary.html',
  styleUrl: './course-summary.css'
})
export class CourseSummary {
  course = input.required<Course>()

  courseMap = input.required<Map<string,Course>>()

  prerequisitesMap = input.required<Map<string,Prerequisite>>()

  courseTitle() {
    return `${this.course().id} ${this.course().name} ${this.course().units}`
  }

  myPrerequisite() {
    return Array.from(this.prerequisitesMap().values())
      .find(prerequisite => prerequisite.parentCourse == this.course().id)
  }

}
