import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {InstrumentComponent} from "./instrument/instrument.component";
import {InstrumentListComponent} from "./instrument-list/instrument-list.component";
import {InstrumentDetailComponent} from "./instrument-detail/instrument-detail.component";

const routes: Routes = [
  {
    path: "",
    component: InstrumentComponent,
    children: [
      {
        path: "",
        component: InstrumentListComponent,
      },
      {
        path: "instrument-list/:department",
        component: InstrumentListComponent
        //outlet: "instrumentOutlet"
      },
      {
        path: "instrument-detail/:id",
        component: InstrumentDetailComponent
        // outlet: "instrumentOutlet"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstrumentRoutingModule {
}
