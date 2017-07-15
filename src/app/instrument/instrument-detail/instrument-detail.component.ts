import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ShareService} from "../../service/share.service";
import {Instrument} from "../../models/instrument";
import {GqlService} from "../../service/gql.service";
import {ActivatedRoute, Params} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {Reservation} from "../../models/reservation";
import set = Reflect.set;
import {LimsRestService} from "../../service/lims-rest.service";
import {ScheduleReservation} from "../../models/schedule-reservation";

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit, AfterViewInit {
  instrument: Instrument;
  scheduleConfig: any;
  errorMsg: string;
  //todo clean this code
  reservationSet: ScheduleReservation[];

  constructor(private restService: LimsRestService,
              private route: ActivatedRoute,) {
  }

  ngOnInit() {
    console.log('instrument detail init .....');

    this.scheduleConfig = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };

    this.route.params
    // (+) converts string 'id' to a number
    //.switchMap((params: Params) => this.getInstrument(params['id']))
      .subscribe((params: Params) => this.getInstrument(+params['id']));
    // this.shareService.detailInstrumentID$.subscribe(
    //   id => {
    //     console.log(`instrument id: ${id} in instrument detail page.`)
    //     this.getInstrument(id)
    //   }
    // )

  }

  ngAfterViewInit() {

  }

  getInstrument(id: number) {
    this.restService.getInstrument(id)
      .subscribe(
        instrument => {
          this.instrument = instrument;
          this.getReservation(this.instrument.id);
        },
            error => this.errorMsg = error
      )
  }
  getReservation(instrumentId: number){
    this.restService.getReservation(instrumentId)
      .subscribe(
        reservationSet => {
          this.reservationSet = reservationSet.map(el => {
            let event = new ScheduleReservation;
            event['title'] = el.user.last_name + el.user.first_name;
            event['start'] = el.start_time;
            event['end'] = el.end_time;
            return event;
          })
        }
      )
  }

}
