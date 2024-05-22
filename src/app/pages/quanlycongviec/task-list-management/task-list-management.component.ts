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

@Component({
  selector: 'app-task-list-management',
  templateUrl: './task-list-management.component.html',
  styleUrls: ['./task-list-management.component.less']
})
export class TaskListManagementComponent implements OnInit {
  ngOnInit(): void {
  }


}
