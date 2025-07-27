import {inject, Injectable} from '@angular/core';
import {UserService} from '../service/user.service';
import {LoginFormModel} from './LoginFormModel';


@Injectable(
  {providedIn : "root"}
)
export class LoginPageState {
  private _validLogin = false;

  private _invalidLogin = false;

  private userService = inject(UserService)

  get validLogin() {
    return this._validLogin;
  }

  get invalidLogin() {
    return this._invalidLogin;
  }


  attemptLogin(data :LoginFormModel,onSuccess : () => void, onFailure : () => void) {
    this.userService.attempLogin(data).subscribe({
      next : (response) => {
        this._validLogin = true;
        this._invalidLogin = false;
        onSuccess();
      },
      error : (error) => {
        this._invalidLogin = true;
        this._validLogin = false;
        onFailure();
      }
    })
  }

}
