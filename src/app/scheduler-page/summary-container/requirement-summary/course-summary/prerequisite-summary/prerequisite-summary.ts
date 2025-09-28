import {Component, input} from '@angular/core';
import {Prerequisite} from '../../../../data-models/Prerequisite';
import {Course} from '../../../../data-models/Course';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';

@Component({
  selector: 'app-prerequisite-summary',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ],
  templateUrl: './prerequisite-summary.html',
  styleUrl: './prerequisite-summary.css'
})
export class PrerequisiteSummary {
  prerequisite = input.required<Prerequisite>()

  coursesMap = input.required<Map<string,Course>>()

  prerequisiteMap = input.required<Map<string,Prerequisite>>()

  prereqTitle() {
    return `${this.prerequisite().prereqId.substring(0,5)} ${ this.typeDescription()}`
  }

  typeDescription() {
    if(this.prerequisite().type == 'AND'){
      return "All of the following must be completed"
    }
    else {
      return "At least one of the following must be completed"
    }
  }

}
