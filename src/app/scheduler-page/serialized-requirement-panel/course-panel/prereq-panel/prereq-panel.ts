import {Component, input, Input} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {SerializedPrerequisite} from '../../../degree-progress/SerializedPrerequisite';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-prereq-panel',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    NgClass
  ],
  templateUrl: './prereq-panel.html',
  styleUrl: './prereq-panel.css'
})
export class PrereqPanel {

  prereq = input.required<SerializedPrerequisite>();

  statusClass = ""

  statusStr() {
    if(this.prereq().semesterCompleted == null){
      this.statusClass = "unavailable"
      return "Not Completed"
    }
    else {
      this.statusClass = "completed"
      return `Completed on semester #${this.prereq().semesterCompleted}`
    }
  }
}
