import {Component, Input, OnInit} from '@angular/core';
import {Instrument} from "../../models/instrument";
import {ShareService} from "../../service/share.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LimsRestService} from "../../service/lims-rest.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-instrument-card',
  templateUrl: './instrument-card.component.html',
  styleUrls: ['./instrument-card.component.css']
})
export class InstrumentCardComponent implements OnInit {
  @Input() instrument: Instrument;

  admin:User;
  constructor(
            private shareService: ShareService,
            private router: Router,
            private restService:LimsRestService
  ) {
  }

  ngOnInit() {
    this.restService.getInstrument(this.instrument.id).subscribe((data:any)=>this.admin = data['users'][0])
  }

  viewDetail() {
    console.log(`view detail ${this.instrument.id}`)
    this.shareService.publishDetailInstrumentID(this.instrument.id);
    this.router.navigate([
      '/instrument/instrument-detail',
      this.instrument.id
      // this.instrument.id
      // {
      //   outlets: {
      //     instrumentOutlet: 'instrument-detail'
      //   }
      //   //departmentId: this.currentDepartmentID
      // }
    ])

  }

}
