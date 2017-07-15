import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {PasswordValidation} from "../password-validation";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  username = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(8)
  ]);
  confirmPassword = new FormControl('', [Validators.required]);
  firstname = new FormControl('');
  lastname = new FormControl('');
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
  phone = new FormControl('');

  constructor(private  formBuilder: FormBuilder) { }

  signUpForm: FormGroup = this.formBuilder.group({
    username: this.username,
    password: this.password,
    confirmPassword: this.confirmPassword,
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    phone: this.phone

  }, {
    validator: this.checkIfMatching('password', 'confirmPassword')
  })

  ngOnInit() {
  }

  signUp(){
    console.log(`${this.username.value} signed up.`)
  }

  checkIfMatching(firstField: string, secondField: string) {
    return (group: FormGroup) => {
      let firstInput = group.controls[firstField],
        secondInput = group.controls[secondField];
      if (firstInput.value !== secondInput.value) {
        return secondInput.setErrors({notEquivalent: true})
      }
      else {
        return secondInput.setErrors(null);
      }
    }
  }
}
