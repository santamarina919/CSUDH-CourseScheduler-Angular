import { Routes } from '@angular/router';
import {SignUpPage} from './sign-up-page/sign-up-page';

const SIGNUP_PAGE = {
  PATH : "signup",
  COMPONENT : SignUpPage
}

const LOGIN_PAGE = {
  path : "login",
  COMPONENT : null
}


export const routes: Routes = [
    {path : SIGNUP_PAGE.PATH, component : SIGNUP_PAGE.COMPONENT}
];

