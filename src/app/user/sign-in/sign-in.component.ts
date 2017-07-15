import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../../service/authentication.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService
  ) { }

  username = new FormControl('');
  password = new FormControl('');

  signInForm: FormGroup = this.formBuilder.group({
    username: this.username,
    password: this.password
  })
  ngOnInit() {
  }

  signIn(){

    this.authenticationService.login(this.username.value, this.password.value)
      .subscribe(
        // todo add return url, or user page
        data => console.log(`${this.username.value} signed in.`)
        // todo add error handler
      )
  }

}
