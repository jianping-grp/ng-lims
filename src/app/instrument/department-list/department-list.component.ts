import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LimsRestService} from "../../service/lims-rest.service";
import {Department} from "../../models/department";
@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit {
  title = '仪器所属平台';
  errorMsg: string;
  departmentList: Department[];


  constructor(private restService: LimsRestService) {
  }

  ngOnInit() {
    console.log('department list init ...')
    this.getDepartmentList();
  }

  getDepartmentList() {
    this.restService.getDepartmentList()
      .subscribe(
        departmentList => this.departmentList = departmentList,
        error => this.errorMsg = <any> error
      )
  }
}
