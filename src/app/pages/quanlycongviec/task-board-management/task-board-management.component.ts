import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {TaskForm, TaskStatus, taskStatusList} from "../../../core/task";
import {DxSortableComponent} from "devextreme-angular/ui/sortable";
import {DxSortableTypes} from 'devextreme-angular/ui/sortable';
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "../../../service/toast.service";
import {ProjectService} from "../../../service/project.service";

type Board = {
  name: TaskStatus
  cards: TaskForm[]
};

@Component({
  selector: 'app-task-board-management',
  templateUrl: './task-board-management.component.html',
  styleUrls: ['./task-board-management.component.less']
})
export class TaskBoardManagementComponent implements OnChanges {

  @ViewChild(DxSortableComponent, {static: false}) sortable!: DxSortableComponent;

  @Input() dataSource!: TaskForm[];

  @Output() addTaskEvent: EventEmitter<any> = new EventEmitter();

  kanbanDataSource: Board[] = [];

  statuses = taskStatusList;
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
  projects: any[] = [];
  idUserDetail: any;
  boardMenuItems: Array<{ text: string }> = [
    {text: 'Add card'},
    {text: 'Copy list'},
    {text: 'Move list'},
  ];

  constructor(private router: Router,
              private spinner: NgxSpinnerService,
              private toastService: ToastService,
              private projectService: ProjectService,
              private activatedRoute: ActivatedRoute,
  ) {
    this.idUserDetail = this.activatedRoute.snapshot.params['id'];
  }

  refresh() {
    this.sortable.instance.update();
  }

  fillOutBoard = (cards: TaskForm[]): Board[] => {
    const result: Board[] = [];
    for (const status of this.statuses) {
      const value = cards.filter((item) => item.status === status);

      result.push(<Board>{name: status, cards: value});
    }

    return result;
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSource']) {
      this.kanbanDataSource = this.fillOutBoard(changes['dataSource'].currentValue);
    }
  }

  // getCardsByStatus = (status: TaskStatus): TaskForm[] => {
  //   const cards: TaskForm[] = this.dataSource
  //     .filter((task) => task.status === status);
  //
  //   return cards;
  // };

  onListReorder = (e: DxSortableTypes.ReorderEvent) => {
    const {fromIndex, toIndex} = e;
    const list = this.kanbanDataSource.splice(fromIndex, 1)[0];
    this.kanbanDataSource.splice(toIndex, 0, list);
  };

  onTaskDragStart(e: DxSortableTypes.DragStartEvent) {
    const {fromData, fromIndex} = e;
    e.itemData = fromData.cards[fromIndex];
  }

  onTaskDrop(e: DxSortableTypes.ReorderEvent | DxSortableTypes.AddEvent) {
    const {
      fromData, toData, fromIndex, toIndex, itemData,
    } = e;

    itemData.status = toData.name;

    fromData.cards.splice(fromIndex, 1);
    toData.cards.splice(toIndex, 0, itemData);
  }

  addTask() {
    this.addTaskEvent.emit();
  }

  openCreateModal(): void {
    this.isUpdate = false
    this.router.navigate(['/task/add'], {
      state: {
        page: this.request,
        isUpdate: this.isUpdate
      }
    })
  }

}
