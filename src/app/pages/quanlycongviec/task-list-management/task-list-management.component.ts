import {Component, OnInit, ViewChild} from '@angular/core';
import {forkJoin, Observable} from "rxjs";
import {DataService} from "../../../service/data.service";
import {ScreenService} from "../../../service/screen.service";
import {map} from "rxjs/operators";
import {DxTabsTypes} from "devextreme-angular/ui/tabs";
import notify from "devextreme/ui/notify";
import {DxTextBoxTypes} from "devextreme-angular/ui/text-box";
import {TaskBoardManagementComponent} from "../task-board-management/task-board-management.component";
import {TaskFormManagementComponent} from "../task-form-management/task-form-management.component";
import {TaskListGridComponent} from "../task-list-grid/task-list-grid.component";
import {TaskForm} from "../../../core/task";
import {DxDataGridComponent} from "devextreme-angular";
import {
  FormEmployeeManagermentComponent
} from "../../HRM/employee/form-employee-managerment/form-employee-managerment.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastService} from "../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {EmployeeService} from "../../../service/employee.service";
import {FileManagerService} from "../../../service/file-manager.service";
import {DxDataGridTypes} from "devextreme-angular/ui/data-grid";
import * as moment from "moment";
import {TaskService} from "../../../service/task.service";

@Component({
  selector: 'app-task-list-management',
  templateUrl: './task-list-management.component.html',
  styleUrls: ['./task-list-management.component.less']
})
export class TaskListManagementComponent implements OnInit {
  @ViewChild(DxDataGridComponent, {static: true}) dataGrid!: DxDataGridComponent;

  @ViewChild(FormEmployeeManagermentComponent, {static: false}) contactNewForm!: FormEmployeeManagermentComponent;

  // dataSource!: DataSource<Contact[], string>;
  isPanelOpened = false;
  searchForm!: FormGroup;
  isAddContactPopupOpened = false;

  userId: number | undefined;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    sort: 'created_date,DESC', // -: desc | +: asc,
  };
  lstData: any[] = [];
  total = 0;
  genderCodeFromList: any;

  constructor(
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    private taskService:TaskService,
    private fileManagerService: FileManagerService
  ) {
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      name: new FormControl(null, [Validators.maxLength(100)]),
      status: new FormControl(null),
    });
    this.fetchData(this.request.currentPage, this.request.pageSize);
  }

  fetchData(currentPage?: number, pageSize?: number) {
    const formValue = this.searchForm.value;
    const queryModel = {
      employeeCode: !formValue.employeeCode ? null : formValue.employeeCode.toString(),
      employeeName: !formValue.employeeName ? null : formValue.employeeName.toString(),
      employeeEmail: !formValue.employeeEmail ? null : formValue.employeeEmail.toString(),
      employeeGender: !formValue.employeeGender ? null : formValue.employeeGender,
      positionId: !formValue.positionId ? null : formValue.positionId,
      departmentId: !formValue.departmentId ? null : formValue.departmentId
    };
    const pageable = {
      page: currentPage,
      size: pageSize,
      sort: this.request.sort,
    };
    this.spinner.show().then();
    this.employeeService.searchEmployee(queryModel, pageable).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstData = res.data.data;
        this.total = res.data.totalElements;
        this.spinner.hide().then();
        if (this.lstData.length === 0) {
          if (this.request.currentPage !== 0) {
            this.request.currentPage = this.request.currentPage - 1;
            this.fetchData(this.request.currentPage, this.request.pageSize);
          }
        }
        this.spinner.hide().then();
      } else {
        this.toastService.openErrorToast(res.body.msgCode);
      }
      this.spinner.hide().then();
    }, error => {
      this.toastService.openErrorToast(error.error.msgCode);
      this.spinner.hide().then();
    }, () => {
      this.spinner.hide().then();
    });
  }

  refresh = () => {
    this.fetchData();
    this.dataGrid.instance.refresh();
  };

  rowClick(e: DxDataGridTypes.RowClickEvent) {
    const {data} = e;
    this.userId = data.id;
    this.isPanelOpened = true;
  }

  onOpenedChange = (value: boolean) => {
    if (!value) {
      this.userId == null;
    }
  };

  onPinnedChange = () => {
    this.dataGrid.instance.updateDimensions();
  };


  async onExporting(e: any) {
    // if (this.searchForm.invalid) return;
    // const queryModel = null;
    // const pageable = {
    //   sort: this.request.sort
    // };
    // await this.fetchData(this.request.currentPage, this.request.pageSize);
    // this.spinner.show().then();
    // if(this.lstData.length===0){
    //   return;
    // }
    // this.employeeService.exportEmployee(queryModel, pageable).subscribe(async response => {
    //   const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
    //   const responseData = isJsonBlob(response.body) ? await (response.body).text() : response.body || {};
    //   if (typeof responseData === "string") {
    //     const responseJson = JSON.parse(responseData);
    //     this.toastService.openErrorToast(responseJson.msgCode);
    //   } else {
    //     const currentDate = moment(new Date()).format('DDMMYYYY');
    //     this.fileManagerService.downloadFile(response, 'danhsachnhanvien_' + currentDate + '.xlsx');
    //   }
    // }, error => {
    //   this.toastService.openErrorToast(error);
    // }, () => {
    //   this.spinner.hide().then();
    // });
    // e.cancel = true;
  }

}
