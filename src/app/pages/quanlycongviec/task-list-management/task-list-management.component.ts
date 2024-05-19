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

  @ViewChild('planningDataGrid', { static: false }) dataGrid!: TaskListGridComponent;

  // @ViewChild('planningGantt', { static: false }) gantt: TaskListGanttComponent;

  @ViewChild('planningKanban', { static: false }) kanban!: TaskBoardManagementComponent;

  @ViewChild(TaskFormManagementComponent, { static: false }) taskForm!: TaskFormManagementComponent;

  newTask = {
    id: null,
    text: '',
    description: '',
    company: '',
    priority: 'Low',
    startDate: new Date(),
    dueDate: new Date(),
    owner: '',
    status: 'Open',
    activities: [],
    notes: [],
    messages: [],
    parentId: null,
    progress: 0,
  };

  taskPanelItems = [
    {
      text: 'List',
    },
    {
      text: 'Kanban Board',
    },
  ];

  displayTaskComponent = this.taskPanelItems[0].text;

  isAddTaskPopupOpened = false;

  displayGrid = this.displayTaskComponent === this.taskPanelItems[0].text;

  displayKanban = this.displayTaskComponent === this.taskPanelItems[1].text;

  taskCollections$!: Observable<{ allTasks: TaskForm[]; filteredTasks: TaskForm[] }>;

  lstTask: any;
  lstTaskFilter: any;

  constructor(private service: DataService, protected screen: ScreenService) {
  }

  ngOnInit(): void {
    this.taskCollections$ = forkJoin([
      this.service.getFilteredTasks(),
      this.service.getTasks()
    ]).pipe(
      map(
        ([filteredTasks, allTasks]) => { return { allTasks, filteredTasks }  })
    );
  }

  tabValueChange(e: DxTabsTypes.ItemClickEvent) {
    const { itemData } = e;

    this.displayTaskComponent = itemData.text;
    this.displayGrid = this.displayTaskComponent === this.taskPanelItems[0].text;
    this.displayKanban = this.displayTaskComponent === this.taskPanelItems[1].text;
  };

  addTask = () => {
    this.isAddTaskPopupOpened = true;
  };

  onClickSaveNewTask = () => {
    notify({
        message: `New task "${this.taskForm.getNewTaskData().text}" saved`,
        position: { at: 'bottom center', my: 'bottom center' }
      },
      'success');
  };

  refresh = () => {
    if (this.displayGrid) {
      this.dataGrid.refresh();
    }
    if  (this.displayKanban) {
      this.kanban.refresh();
    }
  };

  chooseColumnDataGrid = () => this.dataGrid.showColumnChooser();

  searchDataGrid = (e: DxTextBoxTypes.InputEvent) => this.dataGrid.search(e.component.option('text') || '');

  exportToPdf = () => {
    // if (this.displayGrid) {
    //   this.dataGrid.onExportingToPdf();
    // } else {
    //   this.gantt.onExporting();
    // }
  };

  // exportDataGridToXSLX = () => this.dataGrid.onExportingToXLSX();

}
