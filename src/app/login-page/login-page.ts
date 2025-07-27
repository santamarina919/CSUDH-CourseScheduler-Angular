import {Component, inject} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {LoginFormModel} from './LoginFormModel';
import {FormsModule} from '@angular/forms';
import {UserService} from '../service/user.service';
import {LoginPageState} from './LoginPageState';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  model  = new LoginFormModel("","")

  loginPageState = inject(LoginPageState)

  snackBar = inject(MatSnackBar)

  onSubmit(){
    this.loginPageState.attemptLogin(this.model,
      () => {
      if (this.loginPageState.validLogin) {
        this.snackBar.open("You've been logged in!", "OK", {duration: 2000})
        }
      },
      () =>{
        this.snackBar.open("Invalid login","OK",{ duration : 2000} )
      })
  }
}
