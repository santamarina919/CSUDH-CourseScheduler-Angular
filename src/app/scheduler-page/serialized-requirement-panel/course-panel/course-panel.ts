import {Component, input, Input} from '@angular/core';
import {SerializedCourse} from '../../degree-progress/SerializedGraph';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {PrereqPanel} from './prereq-panel/prereq-panel';

@Component({
  selector: 'app-course-panel',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    PrereqPanel
  ],
  templateUrl: './course-panel.html',
  styleUrl: './course-panel.css'
})
export class CoursePanel {

  course = input.required<SerializedCourse>();
}
