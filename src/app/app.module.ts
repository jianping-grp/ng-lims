import './rxjs-extensions';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeModule} from './home/home.module';
import {AboutModule} from './about/about.module';
import {ErrorModule} from './error/error.module';
import {ShareService} from './service/share.service';
import {ScheduleModule} from 'primeng/primeng';
import {ShareModule} from './share/share.module';
import {LimsRestService} from './service/lims-rest.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {UserComponent} from "./user/app-user/user.component";
import {ModalModule} from "ngx-bootstrap";
import {NgZorroAntdModule} from "ng-zorro-antd";

@NgModule({
  declarations: [
    AppComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    HomeModule,
    AboutModule,
    ErrorModule,
    ScheduleModule,
    ModalModule.forRoot(),
    ShareModule,
    AppRoutingModule,
  ],
  providers: [
    LimsRestService,
    ShareService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
