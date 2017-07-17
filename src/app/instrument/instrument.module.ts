import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InstrumentRoutingModule} from './instrument-routing.module';
import {InstrumentComponent} from './instrument/instrument.component';
import {DepartmentListComponent} from './department-list/department-list.component';
import {InstrumentListComponent} from './instrument-list/instrument-list.component';
import {InstrumentCardComponent} from './instrument-card/instrument-card.component';
import {InstrumentDetailComponent} from './instrument-detail/instrument-detail.component';
import {
  ButtonModule, CalendarModule, CheckboxModule, CodeHighlighterModule, DialogModule, InputTextModule, ScheduleModule,
  TabViewModule
} from 'primeng/primeng';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ScheduleModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    TabViewModule,
    CodeHighlighterModule,
    InstrumentRoutingModule
  ],
  declarations: [
    InstrumentComponent,
    DepartmentListComponent,
    InstrumentListComponent,
    InstrumentCardComponent,
    InstrumentDetailComponent
  ]
})
export class InstrumentModule {
}
