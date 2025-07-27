import { Routes } from '@angular/router';
import {SignUpPage} from './sign-up-page/sign-up-page';
import {LoginPage} from './login-page/login-page';

const SIGNUP_PAGE = {
  PATH : "signup",
  COMPONENT : SignUpPage
}

export const LOGIN_PAGE = {
  path : "login",
  COMPONENT : LoginPage
}


export const routes: Routes = [
    {path : SIGNUP_PAGE.PATH, component : SIGNUP_PAGE.COMPONENT},
    {path : LOGIN_PAGE.path, component : LOGIN_PAGE.COMPONENT}
];

