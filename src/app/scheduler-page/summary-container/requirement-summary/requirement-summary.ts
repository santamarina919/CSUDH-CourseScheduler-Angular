import {Component, Input, input} from '@angular/core';
import {Requirement} from '../../data-models/Requirement';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {Course} from '../../data-models/Course';
import {CourseSummary} from './course-summary/course-summary';
import {Prerequisite} from '../../data-models/Prerequisite';

@Component({
  selector: 'app-requirement-summary',
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    CourseSummary
  ],
  templateUrl: './requirement-summary.html',
  styleUrl: './requirement-summary.css'
})
export class RequirementSummary {

  requirement = input.required<Requirement>()

  courseMap = input.required<Map<string,Course>>()

  prerequisitesMap = input.required<Map<string,Prerequisite>>()

  requirementsMap = input.required<Map<string,Requirement>>()

  requirementTitle () {
    if(this.requirement().name != null){
      return this.requirement().name + " (" + this.typeDescription() + ")"
    }
    else {
      return "Unnamed Requirement " + this.requirement().requirementId.substring(0,5) + " (" + this.typeDescription() + ")"
    }
  }

  typeDescription() {
    if(this.requirement().type == 'AND'){
      return "All of the following must be satisfied"
    }
    else {
      return "At least one of the following must be satisfied"
    }
  }

}
