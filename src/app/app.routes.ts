import { Routes } from '@angular/router';
import {SignUpPage} from './sign-up-page/sign-up-page';
import {LoginPage} from './login-page/login-page';
import {HomePage} from './home-page/home-page';

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


export const routes: Routes = [
    {path : SIGNUP_PAGE.PATH, component : SIGNUP_PAGE.COMPONENT},
    {path : LOGIN_PAGE.path, component : LOGIN_PAGE.COMPONENT},
    {path : HOME_PAGE.path, component : HOME_PAGE.COMPONENT}
];

