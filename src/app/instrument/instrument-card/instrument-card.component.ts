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
  @Input() admins:User[];
  admin:User;
  constructor(
            private shareService: ShareService,
            private router: Router,
            private restService:LimsRestService
  ) {
  }

  ngOnInit() {
    if (this.admins){
      for (let i=0;i<this.admins.length;i++){
        if (this.admins[i].id == this.instrument.admin){
          this.admin = this.admins[i];
          break;
        }
      }
    }
  }

  viewDetail() {
    console.log(`view detail ${this.instrument.id}`)
    this.shareService.publishDetailInstrumentID(this.instrument.id);
    this.router.navigate([
      '/instrument/instrument-detail',
      this.instrument.id
    ])
  }
}
