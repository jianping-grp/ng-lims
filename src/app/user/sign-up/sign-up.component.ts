import { Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {LimsRestService} from "../../service/lims-rest.service";

function passwordMatcher(c:AbstractControl){
  if (!c.get('password') || !c.get('confirm'))return null;
  if (c.get('password') && c.get('confirm')){
    return c.get('confirm').value === c.get('password').value ? null : {'nomatch':true}
  }
  return null
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent{
  signUpForm:FormGroup;

  constructor(
    private fb: FormBuilder,
    private restService:LimsRestService,
    private router:Router
  ) {
    this.signUpForm = this.fb.group({
      username: ['', [
        Validators.required,
      ]],
      password: ['', [
        Validators.required,
      ]],
      confirm: ['', [
        Validators.required,
        this.confirmationValidator
      ]],
      lastname: ['',Validators.required],
      firstname: ['',Validators.required],
      email: ['', [
        Validators.email
      ]],
      phone: ['',[
        Validators.required,
      ]],
      phoneNumberPrefix:['+86'],
      agree:[false,[this.agreeValidator]]

    });
    // this.signUpForm.valueChanges.subscribe(data=>this.onValueChanged(data));
    // this.onValueChanged();
  }
  agreeValidator=(control:FormControl)=>{
    if (control.value == false){
      return {agree:true,error:true}
    }
}

  getFormControl(name){
    return this.signUpForm.controls[ name ];
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signUpForm.controls[ 'password' ].value) {
      return { check: true, error: true };
    }
  };
  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(_ => {
      this.signUpForm.controls[ 'confirm' ].updateValueAndValidity();
    });
  }

  // onValueChanged(data?:any){
  //   if (!this.signUpForm) return;
  //   const form = this.signUpForm;
  //
  //   for (let field in this.formErrors){
  //     // clear previous error message (if any)
  //     this.formErrors[field] = '';
  //     let control = form.get(field);
  //
  //     if (control && control.dirty && !control.valid){
  //       const messages = this.validationMessages[field];
  //       for (let key in control.errors){
  //         this.formErrors[field] += messages[key] + '';
  //       }
  //     }
  //   }
  // }
  //
  // formErrors={
  //   'username':'',
  //   'passwordgrp.password':'',
  //   'passwordgrp.confirm':'',
  //   'passwordgrp':'',
  //   'lastname':'',
  //   'firstname':'',
  //   'email':'',
  //   'phone':''
  // }
  // validationMessages = {
  //   'username':{
  //     'required':'必填项;',
  //     'minlength':'用户名至少是6位字符;',
  //     'maxlength':'用户名最多是12位字符;'
  //   },
  //   'passwordgrp.password':{
  //     'required':'必填项;',
  //     'minlength':'密码至少为6位;',
  //     'maxlength':'密码最多为12位;'
  //   },
  //   'passwordgrp.confirm':{
  //     'required':'必填项;',
  //   },
  //   'passwordgrp':{
  //     'nomatch':'请再次确认您两次输入密码一致;'
  //   },
  //   'lastname':{
  //     'required':'必填项;'
  //   },
  //   'firstname':{
  //     'required':'必填项;'
  //   },
  //   'email':{
  //     'required':'必填项;',
  //     'email':'必须是包含@的邮件格式'
  //   },
  //   'phone':{
  //     'required':'必填项;',
  //     'minlength':'必须是11位手机号码;',
  //     'maxlength':'必须是11位手机号码;'
  //   },
  // };


  onSubmit(){
    const form = this.signUpForm.value
    const body = {
      username:form.username,
      password:form.password,
      last_name:form.lastname,
      first_name:form.firstname,
      email:form.email,
      phone:form.phone
    }
    console.log('sign-up:',body)
    this.restService.registry(body).subscribe(
      data=>{
        // console.log(data);
      },
      err => {
        if (err.error.username){
          alert(err.error.username)
        }
        if (err.error.email){
          alert(err.error.email)
        }
      },
      ()=>{
        alert('注册成功');
        this.router.navigate(['./sign-in'])
      }
    )

  }



}
