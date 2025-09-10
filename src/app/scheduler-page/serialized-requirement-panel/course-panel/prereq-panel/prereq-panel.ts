import {Component, input, Input} from '@angular/core';
import {SerializedPrerequisite} from '../../../degree-progress/SerializedGraph';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';

@Component({
  selector: 'app-prereq-panel',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader
  ],
  templateUrl: './prereq-panel.html',
  styleUrl: './prereq-panel.css'
})
export class PrereqPanel {

  prereq = input.required<SerializedPrerequisite>();
}
