import './rxjs-extensions';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeModule} from './home/home.module';
import {AboutModule} from './about/about.module';
import {ErrorModule} from './error/error.module';
import {ShareService} from './service/share.service';
import {ScheduleModule} from 'primeng/primeng';
import {UserModule} from './user/user.module';
import {ShareModule} from './share/share.module';
import {LimsRestService} from './service/lims-rest.service';
import {AuthenticationService} from './service/authentication.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HomeModule,
    AboutModule,
    ErrorModule,
    ScheduleModule,
    UserModule,
    ShareModule,
    AppRoutingModule,
  ],
  providers: [
    LimsRestService,
    ShareService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
