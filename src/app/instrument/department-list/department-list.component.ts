import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LimsRestService} from "../../service/lims-rest.service";
import {Department} from "../../models/department";
import {ShareService} from "../../service/share.service";
import {GqlService} from "../../service/gql.service";
import gql from 'graphql-tag';
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit, AfterViewInit {
  title = '仪器所属平台'
  errorMsg: string;
  departmentList: Department[];


  constructor(private restService: LimsRestService) {
  }

  ngOnInit() {
    console.log('department list init ...')
    this.getDepartmentList();
  }
  ngAfterViewInit() {
  }

  getDepartmentList() {
    this.restService.getDepartmentList()
      .subscribe(
        departmentList => this.departmentList = departmentList,
        error => this.errorMsg = <any> error
      )
  }
}
