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
import {ApolloClient, createNetworkInterface} from 'apollo-client';
import {ApolloModule} from 'apollo-angular';
import {ScheduleModule} from 'primeng/primeng';
import {UserModule} from './user/user.module';
import {ShareModule} from './share/share.module';
import {LimsRestService} from './service/lims-rest.service';
import {AuthenticationService} from './service/authentication.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


// create apollo graphql client
const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8000/graphql'
  }),
});
export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ApolloModule.forRoot(provideClient),
    BrowserAnimationsModule,
    HomeModule,
    AboutModule,
    ErrorModule,
    // InstrumentModule,
    ScheduleModule,
    UserModule,
    ShareModule,
    AppRoutingModule

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
