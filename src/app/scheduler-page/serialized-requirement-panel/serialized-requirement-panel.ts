import {Component, input, Input} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {CoursePanel} from './course-panel/course-panel';
import {SerializedRequirement} from '../degree-progress/SerializedRequirement';

@Component({
  selector: 'app-serialized-requirement-panel',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    CoursePanel,

  ],
  templateUrl: './serialized-requirement-panel.html',
  styleUrl: './serialized-requirement-panel.css'
})
export class SerializedRequirementPanel {

  requirement = input.required<SerializedRequirement>();
}
