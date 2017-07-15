import {Component, Input, OnInit} from '@angular/core';
import {Instrument} from "../../models/instrument";
import {ShareService} from "../../service/share.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-instrument-card',
  templateUrl: './instrument-card.component.html',
  styleUrls: ['./instrument-card.component.css']
})
export class InstrumentCardComponent implements OnInit {
  @Input() instrument: Instrument;

  constructor(private shareService: ShareService,
              private router: Router) {
  }

  ngOnInit() {
  }

  viewDetail() {
    console.log(`view detail ${this.instrument.id}`)
    this.shareService.publishDetailInstrumentID(this.instrument.id);
    this.router.navigate([
      '/instrument/instrument-detail',
      this.instrument.id
      //this.instrument.id
      // {
      //   outlets: {
      //     instrumentOutlet: 'instrument-detail'
      //   }
      //   //departmentId: this.currentDepartmentID
      // }
    ])

  }

}
