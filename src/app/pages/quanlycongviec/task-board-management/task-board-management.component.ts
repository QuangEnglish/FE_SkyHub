import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {TaskForm, TaskStatus, taskStatusList} from "../../../core/task";
import {DxSortableComponent, DxSortableTypes} from "devextreme-angular/ui/sortable";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../service/toast.service";
import {ProjectService} from "../../../service/project.service";
import {TaskService} from "../../../service/task.service";


type Board = {
  name: TaskStatus
  taskForm: TaskForm[]
};

@Component({
  selector: 'app-task-board-management',
  templateUrl: './task-board-management.component.html',
  styleUrls: ['./task-board-management.component.less']
})
export class TaskBoardManagementComponent implements OnInit, OnChanges {

  @ViewChild(DxSortableComponent, {static: false}) sortable!: DxSortableComponent;

  dataSource!: TaskForm[];
  kanbanDataSource:any[] = [];
  statuses = [
    'Mới',
    'Đang xử lý',
    'Review',
    'Reopen',
    'Hoàn thành',
  ];
  isLoading = false;
  isUpdate = false;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 1,
    name: null,
    currentPage: 0,
    pageSize: 10,
    sort: 'created_date,desc', // -: desc | +: asc,
  };
  idProject: any;
  idUserDetail: any;

  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private toastService: ToastService,
              private taskService: TaskService,
              private activatedRoute: ActivatedRoute,
  ) {
    this.idProject = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const payloadToken: any = token ? this.parseJwt(token) : null;
    const userObject = JSON.parse(payloadToken.user);
    this.idUserDetail = userObject.userDetailId;
    this.loadData();
  }

  parseJwt(token: string): string {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  loadData() {
    this.spinner.show().then();
    this.taskService.search(this.idUserDetail, this.idProject).subscribe(res => {
      if (res && res.code === "OK") {
        this.kanbanDataSource = res.data;
        this.spinner.hide().then();
      } else {
        this.toastService.openErrorToast(res.msgCode);
        this.spinner.hide().then();
      }
      this.spinner.hide().then();
    })
  }

  refresh() {
    this.sortable.instance.update();
  }

  fillOutBoard = (taskForm: TaskForm[]): Board[] => {
    const result: Board[] = [];
    for (const status of this.statuses) {
      const value = taskForm.filter((item) => item.taskStatusName === status);
      result.push(<Board>{name: status, taskForm: value});
    }
    return result;
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      this.kanbanDataSource = this.fillOutBoard(changes['dataSource'].currentValue);
    }
  }

  getCardsByStatus = (status: TaskStatus): TaskForm[] => {
    const taskForm: TaskForm[] = this.dataSource
      .filter((task) => task.taskStatusName === status);

    return taskForm;
  };

  onListReorder = (e: DxSortableTypes.ReorderEvent) => {
    const {fromIndex, toIndex} = e;
    const list = this.kanbanDataSource.splice(fromIndex, 1)[0];
    this.kanbanDataSource.splice(toIndex, 0, list);
  };

  onTaskDragStart(e: DxSortableTypes.DragStartEvent) {
    const {fromData, fromIndex} = e;
    e.itemData = fromData.taskForm[fromIndex];
  }

  onTaskDrop(e: DxSortableTypes.ReorderEvent | DxSortableTypes.AddEvent) {
    const {
      fromData, toData, fromIndex, toIndex, itemData,
    } = e;

    itemData.taskStatus = toData.name;

    fromData.taskForm.splice(fromIndex, 1);
    toData.taskForm.splice(toIndex, 0, itemData);
  }

  // addTask() {
  //   this.addTaskEvent.emit();
  // }

  openCreateModal(): void {
    this.isUpdate = false
    this.router.navigate(['/task/add/', this.idProject], {
      state: {
        page: this.request,
        isUpdate: this.isUpdate
      }
    })
  }



}
