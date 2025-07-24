import { Component } from '@angular/core';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {SignUpData} from './SignUpData';

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

  onSubmit() {
    console.warn(this.model)
  }

}
