import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ShareService {
  //used for file instruments by department id
  private selectedDepartmentID = new Subject<string>();
  selectedDepartmentID$ = this.selectedDepartmentID.asObservable();
  //used for view detail info of a instrument
  private detailInstrumentID = new Subject<number>();
  detailInstrumentID$ = this.detailInstrumentID.asObservable();

  constructor() { }
  publishDepartmentID (id: string) {
    console.log(`published departmentID ${id}`);
    this.selectedDepartmentID.next(id);
  }

  publishDetailInstrumentID(id: number) {
    this.detailInstrumentID.next(id);
  }
}
