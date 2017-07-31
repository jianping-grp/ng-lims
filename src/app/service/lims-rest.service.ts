import {Injectable} from '@angular/core';
import {Department} from '../models/department';
import {User} from '../models/user';
import {Instrument} from '../models/instrument';
import {Reservation} from '../models/reservation';
import {Observable} from "rxjs/Observable";
import {Http, Response, Headers, ResponseOptions} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LimsRestService {
  private restUrl = 'http://localhost:8080/api'
  private headers = new Headers({'Content-Type': 'application/json'})
  constructor(
    private http: Http
  ) {
  }

  private fetchData(url: string){
    return this.http.get(`${this.restUrl}/${url}`);
  }

  modifyReservation(reservationId: number,body:any){
    return this.http.put(`${this.restUrl}/reservation/${reservationId}`,body)
      .map((res:Response)=>res.json())
      .catch(this.handleError);
  }
  createReservation(body:any){
    return this.http.post(`${this.restUrl}/reservation`,body)
      .map((res:Response)=>res.json())
      .catch(this.handleError);
  }


  getDepartmentList(): Observable<Department[]> {
    return this.fetchData('departments')
      .map((res:Response)=>res.json().departments)
      .catch(this.handleError);
  }

  getInstrument(id: number): Observable<Instrument> {
    return this.fetchData(`instruments/${id}`)
      .map((res:Response)=>res.json().instrument)
      .catch(this.handleError)
  }

  getInstrumentList(): Observable<Instrument[]> {
    return this.fetchData(`instruments`)
      .map((res:Response)=>res.json().instruments)
      .catch(this.handleError);
  }

  getUser(userID: number): Observable<User> {
    return this.fetchData(`users/${userID}`)
      .map((res:Response)=>res.json().user)
      .catch(this.handleError)
  }

  getInstrumentListByDepartment(departmentID: number): Observable<Instrument[]> {
    if (departmentID === 0) {
      return this.getInstrumentList();
    }
    else {
      return this.fetchData(`instruments/?filter{department}=${departmentID}`)
        .map((res:Response)=>res.json().instruments)
        .catch(this.handleError)
    }
  }

  getReservation(instrumentId: number): Observable<Reservation[]> {
    return this.fetchData(`reservations/?filter{instrument}=${instrumentId}`)
      .map((res:Response)=>res.json().reservations)
      .catch(this.handleError)
  }

  // private extractDataList(res: Response) {
  //   let body = res.json();
  //   console.log('body:',body)
  //   return body || {};
  // }

  // private extractData(res: Response) {
  //   let body = res.json();
  //   return body || {};
  // }

  private handleError(error: Response | any) {
    // we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

}
