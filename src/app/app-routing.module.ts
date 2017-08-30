import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from "./home/home/home.component";
import {PageNotFoundComponent} from "./error/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path:'user-center',
    loadChildren: 'app/user/user.module#UserModule',
    data: {preload:true}
  },
  {
    path: 'instrument',
    loadChildren: 'app/instrument/instrument.module#InstrumentModule',
    data: {preload:true}
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: SelectivePreloadingStrategy})],
  exports: [RouterModule],
  providers:[SelectivePreloadingStrategy]
})
export class AppRoutingModule {
}
