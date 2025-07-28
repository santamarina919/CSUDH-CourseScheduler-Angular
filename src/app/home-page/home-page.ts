import {Component, inject} from '@angular/core';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {Router, RouterLink} from '@angular/router';
import {HOME_PAGE, PLANS_PAGE} from '../app.routes';

@Component({
  selector: 'app-home-page',
  imports: [
    MatGridList,
    MatGridTile,
    RouterLink
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

  router = inject(Router)




  protected readonly HOME_PAGE = HOME_PAGE;
  protected readonly PLANS_PAGE = PLANS_PAGE;
}
