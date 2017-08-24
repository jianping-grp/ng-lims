import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserInfoComponent} from "./user-info/user-info.component";
import {UserRecordComponent} from "./user-record/user-record.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {SignInComponent} from "./sign-in/sign-in.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";

const routes: Routes = [
    {
      path:'user-info',
      component:UserInfoComponent,
    },
    {
      path:'user-record',
      component:UserRecordComponent
    },
    {
      path: 'sign-in',
      component: SignInComponent
    },
    {
      path: 'sign-up',
      component: SignUpComponent
    },
    {
      path:'change-password',
      component:ChangePasswordComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {
}
