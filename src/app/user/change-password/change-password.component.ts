import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  ChangePasswordForm:FormGroup;
  constructor(
    private fb:FormBuilder
  ) { }

  ngOnInit() {
    this.ChangePasswordForm=this.fb.group({
      current:[null,Validators.required],
      password:[null,Validators.required],
      confirm:[null,[Validators.required ,this.confirmationValidator]]
    })
  }

  getFormControl(name) {
    return this.ChangePasswordForm.controls[ name ];
  }

  confirmationValidator= (control: AbstractControl): { [s: string]: boolean }=>{
    // console.log(this.ChangePasswordForm.controls['password'])
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.ChangePasswordForm.controls['password'].value) {
      return { 'check': true, error: true };
    }
  };

  updateConfirmValidator() {
    console.log(this.ChangePasswordForm.controls[ 'confirm' ].status)
    /** wait for refresh value */
    setTimeout(_ => {
      this.ChangePasswordForm.controls[ 'confirm' ].updateValueAndValidity();
    });
  }

  changePassword(){
    console.log('status:',this.ChangePasswordForm.status)
    console.log('valid?:',this.ChangePasswordForm.valid)
    console.log('value:',this.ChangePasswordForm.value)
  }

}
