import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from '@angular/router';
import {PasswordModule} from "primeng/primeng";
import {UserRoutingModule} from "./user-routing.module";
import { UserInfoComponent } from './user-info/user-info.component';
import { UserRecordComponent } from './user-record/user-record.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import {NgZorroAntdModule} from "ng-zorro-antd";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    NgZorroAntdModule,
    UserRoutingModule
  ],
  declarations: [ SignInComponent, SignUpComponent, UserInfoComponent, UserRecordComponent, ChangePasswordComponent],
  exports: []

})
export class UserModule { }
