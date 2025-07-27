import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpStatusCode} from '@angular/common/http';
import {SignUpData} from './SignUpData';
import {SignUpPage} from './sign-up-page';
import {SignUpPageState} from './SignUpPageState';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient)

  signUp(data :SignUpData) {
    return this.http.post('api/individual/signup', JSON.stringify(data),{headers : new HttpHeaders().set("Content-Type","application/json"), withCredentials : true, observe : 'response'})
  }
}
