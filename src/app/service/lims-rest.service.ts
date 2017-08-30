import {Injectable} from '@angular/core';
import {Department} from '../models/department';
import {User} from '../models/user';

import {Observable} from "rxjs/Observable";
import {Response} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from "rxjs/Subject";

@Injectable()
export class LimsRestService {
  private restUrl = 'http://localhost:8000/api';
  private authUrl:string = `${this.restUrl}/auth`;
  currentUser:Subject<any>;

  constructor(
    private http: HttpClient
  ) {
    this.currentUser = new Subject();
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

  getInstrumentListByDepartment(departmentID: number, page:number,pageSize:number): Observable<any> {
    if (departmentID === 0) {
      return this.fetchData(`instruments/?include[]=admin.*&page=${page}&per_page=${pageSize}&sort[]=id`)
        .map((res:Response)=>res)
        .catch(this.handleError);
    }
    else {
      return this.fetchData(`instruments/?filter{department}=${departmentID}&include[]=admin.*&page=${page}&per_page=${pageSize}&sort[]=id`)
        .map((res:Response)=>res)
        .catch(this.handleError)
    }
  }

  // getAdmin(adminID: number){
  //   let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
  //   return this.http.get(`${this.restUrl}/users/?filter{id}=${adminID}`,{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})
  //     .map((res:Response)=>res['users'])
  //     .catch(this.handleError)
  // }
  getUser(username:string): Observable<User[]>{
    let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
    return this.http.get(`${this.restUrl}/users/?filter{username}=${username}`,{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})
      .map((res:Response)=>res['users'])
      .catch(this.handleError)
  }


  getInstrumentRecords(instrumentId:number,start:string):Observable<any>{
    return this.fetchData(`instrument-records/?filter{instrument}=${instrumentId}&filter{start_time.gte}=${start}&per_page=999&include[]=user.*`)
      .map((res:Response)=>res)
      .catch(this.handleError)
  }

  getReservations(instrumentId: number,start:string):Observable<any>{
    return this.fetchData(`reservations/?filter{instrument}=${instrumentId}&filter{start_time.gte}=${start}&per_page=999&include[]=user.*`)
      .map((res:Response)=>res)
      .catch(this.handleError)
  }
  // getReservationsByUser(username: string,page:number):Observable<any>{
  //   return this.fetchData(`reservations/?include[]=user.*&filter{user.username}=${username}&page=${page}`)
  //     .map((res:Response)=>res)
  //     .catch(this.handleError)
  // }


  getReservationsByPage(username: string,page:number,start:string):Observable<any>{
    return this.fetchData(`reservations/?filter{user.username}=${username}&filter{start_time.gte}=${start}&page=${page}&sort[]=-start_time`)
      .map((res:Response)=>res)
      .catch(this.handleError)
  }
  getInstrumentRecordsByPage(username:string,page:number,start:string):Observable<any>{
    return this.fetchData(`instrument-records/?filter{user.username}=${username}&filter{start_time.gte}=${start}&page=${page}&sort[]=-start_time`)
      .map((res:Response)=>res)
      .catch(this.handleError)
  }

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

  login(username: string, password: string):Observable<any> {
    return this.http.post(`${this.authUrl}/login/`, {username: username, password: password})
      .map((res: Response) => {
        if (res && res['auth_token']) {
          let user = {
            user_token:res['auth_token'],
            user_name:username
          };
          console.log('Login token:',user)
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser.next(user);
          return user;
        }
        else {
          return null;
        }
      })
  }


  logout() :void{
    let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
    this.http.post(`${this.authUrl}/logout/`,{},{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})

    localStorage.removeItem('currentUser');
    let removedToken = localStorage.getItem('currentUser');
    this.currentUser.next(removedToken);
  }

  registry(body:any){
    return this.http.post(`${this.authUrl}/register/`,body)
      .map((res:Response)=>res)
  }
  changePassword(body:any){
    let storedUser = JSON.parse(localStorage.getItem('currentUser')) ;
    return this.http.post(`${this.authUrl}/password/`,body,{headers:new HttpHeaders().set('Authorization',`Token ${storedUser['user_token']}`)})
      .map((res:Response)=>res)
      .catch(this.handleError)
  }

}
