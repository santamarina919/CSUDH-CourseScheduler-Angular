import {Component, inject} from '@angular/core';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SignUpData} from './SignUpData';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../service/user.service';
import {SignUpPageState} from './SignUpPageState';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {LOGIN_PAGE} from '../app.routes';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './sign-up-page.html',
  styleUrl: './sign-up-page.css'
})
export class SignUpPage {
  model = new SignUpData('', '', '');

  snackBar = inject(MatSnackBar)

  router = inject(Router)

  signUpPageState= new SignUpPageState();


  onSubmit() {
    this.signUpPageState.signUpUser(
      this.model,
      () => {
        this.snackBar.open("You've been registered!","OK",{ duration : 2000} )
        this.router.navigate([LOGIN_PAGE.path])
      }
    );
  }

}
