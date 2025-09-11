import {Component, input, Input} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {PrereqPanel} from './prereq-panel/prereq-panel';
import {SerializedCourse} from '../../degree-progress/SerializedCourse';
import {Course} from '../../data-models/Course';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-course-panel',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    PrereqPanel,
    NgClass
  ],
  templateUrl: './course-panel.html',
  styleUrl: './course-panel.css'
})
export class CoursePanel {



  course = input.required<SerializedCourse>();

  statusClass = "planned"

  statusStr() :string {
    let displayStr = ""
    if(this.course().semesterCompleted != null && this.course().semesterAvail != null) {
      displayStr = `Completed during semester #${this.course().semesterCompleted} & Available starting from semester #${this.course().semesterAvail}`
      this.statusClass = "planned"
    }
    else if(this.course().semesterAvail != null){
      displayStr = `Available starting from semester #${this.course().semesterAvail}`
      this.statusClass = "available"

    }
    else {
      displayStr = "Not planned and Not Available"
      this.statusClass = "unavailable"
    }




    return displayStr
  }


}
