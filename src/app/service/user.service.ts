import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpStatusCode} from '@angular/common/http';
import {SignUpData} from '../sign-up-page/SignUpData';
import {SignUpPage} from '../sign-up-page/sign-up-page';
import {SignUpPageState} from '../sign-up-page/SignUpPageState';
import {LoginFormModel} from '../login-page/LoginFormModel';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient)

  signUp(data :SignUpData) {
    return this.http.post('api/individual/signup', JSON.stringify(data),{headers : new HttpHeaders().set("Content-Type","application/json"), withCredentials : true, observe : 'response'})
  }

  attempLogin(data :LoginFormModel) {
    return this.http.post('api/individual/login', JSON.stringify(data),{headers : new HttpHeaders().set("Content-Type","application/json"), withCredentials : true, observe : 'response'})
  }
}
