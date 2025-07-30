import {Component, inject, OnInit, viewChild} from '@angular/core';
import {CreatePlanFormModel} from './CreatePlanFormModel';
import {CreatePlanFormState} from './CreatePlanFormState';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormsModule} from '@angular/forms';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatSelect} from '@angular/material/select';
import {MatOption} from '@angular/material/core';
import {PlanDetails} from '../plans-page/PlanDetails';

@Component({
  selector: 'app-create-plan-form',
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatSelect,
    MatOption
  ],
  templateUrl: './create-plan-form.html',
  styleUrl: './create-plan-form.css'
})
export class CreatePlanForm implements OnInit{
  formModel = new CreatePlanFormModel("","",2019,"");

  formModelState = inject(CreatePlanFormState)

  formState = inject(CreatePlanFormState)

  snackbar = inject(MatSnackBar)

  terms = ["FALL","SPRING"]

  parentSubmitFunc: (success :boolean,plan :PlanDetails | null)=> void = () => {}

  ngOnInit(): void {
    this.formState.fetchMajors()
  }

  onSubmit() {
    this.formState.submitForm(this.formModel,
      (plan :PlanDetails) => {
        this.snackbar.open("Plan created!","OK",{ duration : 2000} )
        this.parentSubmitFunc(true,plan)
      },
      () => {
        this.snackbar.open("Plan creation failed","OK",{ duration : 2000} )
        this.parentSubmitFunc(false,null)
    }
    );
  }
}
