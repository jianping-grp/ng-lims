import {Injectable} from '@angular/core';
import {Department} from '../models/department';
import {User} from '../models/user';
import {Instrument} from '../models/instrument';
import {Reservation} from '../models/reservation';
import {Observable} from "rxjs/Observable";
import {Http, Response, Headers, ResponseOptions} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {InstrumentRecord} from "../models/instrument-record";

@Injectable()
export class LimsRestService {
  private restUrl = 'http://localhost:8000/api'
  constructor(
    private http: HttpClient
  ) {
  }

  private fetchData(url: string){
    return this.http.get(`${this.restUrl}/${url}`);
  }

  modifyReservation(reservationId: number,body:any){
    let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
    return this.http.patch(`${this.restUrl}/reservations/${reservationId}/`,body,{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})
      .map((res:Response)=>res)
      .catch(this.handleError);
  }
  createReservation(body:any){
    let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
    return this.http.post(`${this.restUrl}/reservations/`,body,{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})
      .map((res:Response)=>res)
      .catch(this.handleError);
  }
  deleteReservation(reservationId:number){
    let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
    return this.http.delete(`${this.restUrl}/reservations/${reservationId}`,{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})
      .map((res:Response)=>res)
      .catch(this.handleError)
  }



// todo:修改http.get.map
  getDepartmentList(): Observable<Department[]> {
    return this.fetchData('departments')
      .map((res:Response)=>res['departments'])
      .catch(this.handleError);
  }

  getInstrument(id: number) {
    return this.fetchData(`instruments/${id}/?include[]=admin.*`)
      .map((res:Response)=>res)
      .catch(this.handleError)
  }

  // todo: 修改http.get.map
  getInstrumentList(): Observable<any> {
    return this.fetchData(`instruments/?include[]=admin.*`)
      .map((res:Response)=>res)
      .catch(this.handleError);
  }

  getAdmin(adminID: number){
    let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
    return this.http.get(`${this.restUrl}/users/?filter{id}=${adminID}`,{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})
      .map((res:Response)=>res['users'])
      .catch(this.handleError)
  }
  getUser(username:string): Observable<User[]>{
    let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
    return this.http.get(`${this.restUrl}/users/?filter{username}=${username}`,{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})
      .map((res:Response)=>res['users'])
      .catch(this.handleError)
  }

  getInstrumentListByDepartment(departmentID: number): Observable<any> {
    if (departmentID === 0) {
      return this.getInstrumentList();
    }
    else {
      return this.fetchData(`instruments/?filter{department}=${departmentID}&include[]=admin.*`)
        .map((res:Response)=>res)
        .catch(this.handleError)
    }
  }


  getReservations(instrumentId: number):Observable<any>{
    return this.fetchData(`reservations/?filter{instrument}=${instrumentId}&include[]=user.*`)
      .map((res:Response)=>res)
      .catch(this.handleError)
  }
  getReservationsByUser(username: string):Observable<any>{
    return this.fetchData(`reservations/?include[]=user.*&filter{user.username}=${username}`)
      .map((res:Response)=>res)
      .catch(this.handleError)
  }
  getInstrumentRecords(instrumentId:number):Observable<InstrumentRecord[]>{
    return this.fetchData(`instrument-record/?filter{instrument}=${instrumentId}`)
      .map((res:Response)=>res['instrument_records'])
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
