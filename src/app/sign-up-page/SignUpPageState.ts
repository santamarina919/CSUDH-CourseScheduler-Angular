import {inject} from '@angular/core';
import {UserService} from '../service/user.service';
import {SignUpData} from './SignUpData';
import {HttpStatusCode} from '@angular/common/http';


export class SignUpPageState{

  private _signedUp = false;

  private _errorWithRequest = false;

  private userService = inject(UserService);

  signUpUser(userData : SignUpData, onSuccess :() => void) {
    this.userService.signUp(userData).subscribe({

      next : (response) => {
        if(response.status == HttpStatusCode.Created) {
          this._signedUp = true;
          this._errorWithRequest = false;
          onSuccess();
        }
      },

      error : (error) => {
        if(error.status == HttpStatusCode.Conflict) {
          this._errorWithRequest = true;
          this._signedUp = false;
        }
      }
    })
  }

  public get signedUp() :boolean {
    return this._signedUp;
  }

  public get errorWithRequest() :boolean {
    return this._errorWithRequest;
  }

}
