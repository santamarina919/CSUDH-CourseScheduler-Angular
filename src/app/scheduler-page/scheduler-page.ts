import { Component } from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';

@Component({
  selector: 'app-schedule-page',
  imports: [
    MatGridList,
    MatGridTile
  ],
  templateUrl: './scheduler-page.html',
  styleUrl: './scheduler-page.css'
})
export class SchedulerPage {

}
