import {Component, inject, OnInit} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {SchedulerPageState} from './SchedulerPageState';
import {ActivatedRoute} from '@angular/router';
import {RouteParameters} from '../app.routes';
import {Observable} from 'rxjs';
import {DegreeService} from '../service/degree.service';
import {PlanService} from '../service/plan.service';
import {CourseDegreeGraphBuilder} from './CourseDegreeGraphBuilder';
import {CourseDegreeGraph} from './CourseDegreeGraph';
import {MatButton} from '@angular/material/button';
import {MatList, MatListOption, MatSelectionList} from '@angular/material/list';
import {SummaryNode} from './summary-node/summary-node';

@Component({
  selector: 'app-schedule-page',
  imports: [
    MatListOption,
    MatSelectionList,
    SummaryNode,
  ],
  templateUrl: './scheduler-page.html',
  styleUrl: './scheduler-page.css'
})
export class SchedulerPage {
  activatedRoute = inject(ActivatedRoute)

  state: SchedulerPageState;

  degreeService = inject(DegreeService)

  planService = inject(PlanService)


  constructor() {
    const planId = this.activatedRoute.snapshot.paramMap.get(RouteParameters.planId) ?? "Missing plan id"

    const degreeId = this.activatedRoute.snapshot.paramMap.get(RouteParameters.degreeId) ?? "Missing degree id"

    this.state = new SchedulerPageState(planId, degreeId, this.planService, this.degreeService)

  }





}
