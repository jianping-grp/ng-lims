import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LimsRestService} from "../../service/lims-rest.service";


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  ChangePasswordForm:FormGroup;
  constructor(
    private fb:FormBuilder,
    private restService:LimsRestService
  ) { }

  ngOnInit() {
    this.ChangePasswordForm=this.fb.group({
      current:[null,Validators.required],
      password:[null,[Validators.required,this.sameCheckValidator]],
      confirm:[null,[Validators.required ,this.confirmationValidator]]
    })
  }

  getFormControl(name) {
    return this.ChangePasswordForm.controls[ name ];
  }

  confirmationValidator= (control: FormControl): { [s: string]: boolean }=>{
    // console.log(this.ChangePasswordForm.controls['password'])
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.ChangePasswordForm.controls['password'].value) {
      return { 'check': true, error: true };
    }
  };
  sameCheckValidator= (control: AbstractControl): { [s: string]: boolean }=>{
    // console.log(this.ChangePasswordForm.controls['password'])
    if (!control.value) {
      return { required: true };
    } else if (control.value == this.ChangePasswordForm.controls['current'].value) {
      return { 'same': true, error: true };
    }
  };

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(_ => {
      this.ChangePasswordForm.controls[ 'confirm' ].updateValueAndValidity();
    });
  }

  changePassword(){
    let body={
      current_password:this.ChangePasswordForm.value.current,
      new_password:this.ChangePasswordForm.value.password
    }
    this.restService.changePassword(body).subscribe(
      ()=>{},
      (error)=>{console.log(error+'当前密码错误')},
      ()=>{alert('密码修改成功')}
      )
  }

}
