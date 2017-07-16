import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Instrument} from '../../models/instrument';
import {ActivatedRoute, Params} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {LimsRestService} from '../../service/lims-rest.service';
import {ScheduleReservation} from '../../models/schedule-reservation';
import set = Reflect.set;

@Component({
  selector: 'app-instrument-detail',
  templateUrl: './instrument-detail.component.html',
  styleUrls: ['./instrument-detail.component.css']
})
export class InstrumentDetailComponent implements OnInit, AfterViewInit {
  instrument: Instrument;
  headerConfig: any;
  errorMsg: string;
  // todo clean this code
  scheduleEvents: ScheduleReservation[];

  constructor(private restService: LimsRestService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log('instrument detail init .....');

    this.scheduleEvents = [
      {
        'title': 'All Day Event',
        'start': '2016-01-01'
      },
      {
        'title': '张亮预约',
        'start': '2017-07-07T08:00:00',
        'end': '2017-07-07T14:00:00'
      },
      {
        'title': '张竞预约',
        'start': '2017-07-07T15:00:00',
        'end': '2017-07-07T17:30:00'
      },
      {
        'title': 'Repeating Event',
        'start': '2017-07-16T16:00:00Z',
        'end': '2017-07-16T18:00:00Z'
      },
      {
        'title': 'Conference',
        'start': '2017-07-11',
        'end': '2017-07-13'
      }
    ]
    this.headerConfig = {
      left: 'prev listWeek next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };

    this.route.params
    // (+) converts string 'id' to a number
    // .switchMap((params: Params) => this.getInstrument(params['id']))
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
          console.log(instrument)
          this.instrument = instrument;
          this.getReservation(this.instrument.id);
        },
        error => this.errorMsg = error
      );
  }


  getReservation(instrumentId: number) {
    this.restService.getReservation(instrumentId)
      .subscribe(
        events => {
          console.log(events)
          this.scheduleEvents = events.map(el => {
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
