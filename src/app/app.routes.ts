import { Routes } from '@angular/router';
import {SignUpPage} from './sign-up-page/sign-up-page';
import {LoginPage} from './login-page/login-page';
import {HomePage} from './home-page/home-page';
import {PlansPage} from './plans-page/plans-page';
import {SchedulerPage} from './scheduler-page/scheduler-page';
import {Home} from './home/home';

const SIGNUP_PAGE = {
  PATH : "signup",
  COMPONENT : SignUpPage
}

export const LOGIN_PAGE = {
  path : "login",
  COMPONENT : LoginPage
}


export const HOME_PAGE = {
  path : "home",
  COMPONENT : HomePage
}

export const INDEX_COMP = {
  path : "",
  COMPONENT : Home
}

export const PLANS_PAGE = {
  path : "plans",
  component : PlansPage
}

export const RouteParameters = {
  planId : "planId",
  degreeId : "degreeId"
}

export const SCHEDULER_PAGE = {
  path : PLANS_PAGE.path + `/:${RouteParameters.planId}/:${RouteParameters.degreeId}`,
  component : SchedulerPage
}

export const routes: Routes = [
    {path : '', component : INDEX_COMP.COMPONENT},
    {path : SIGNUP_PAGE.PATH, component : SIGNUP_PAGE.COMPONENT},
    {path : LOGIN_PAGE.path, component : LOGIN_PAGE.COMPONENT},
    {path : HOME_PAGE.path, component : HOME_PAGE.COMPONENT},
    {path : PLANS_PAGE.path, component : PLANS_PAGE.component},
    {path : SCHEDULER_PAGE.path, component : SCHEDULER_PAGE.component}
];

