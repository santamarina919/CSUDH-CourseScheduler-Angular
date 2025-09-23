import {Component, input} from '@angular/core';
import {SchedulerPageState} from '../SchedulerPageState';

@Component({
  selector: 'app-summary-container',
  imports: [],
  templateUrl: './summary-container.html',
  styleUrl: './summary-container.css'
})
export class SummaryContainer {

  state = input.required<SchedulerPageState>()


}
