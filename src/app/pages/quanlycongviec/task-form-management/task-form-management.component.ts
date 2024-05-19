import {Component, Input, OnInit} from '@angular/core';
import {TaskForm, taskPriorityList, taskStatusList} from "../../../core/task";
import {getSizeQualifier, ScreenService} from "../../../service/screen.service";
import {DxButtonTypes} from "devextreme-angular/ui/button";

@Component({
  selector: 'app-task-form-management',
  templateUrl: './task-form-management.component.html',
  styleUrls: ['./task-form-management.component.less']
})
export class TaskFormManagementComponent implements OnInit {

  @Input() task!: TaskForm;

  @Input() isLoading: boolean = false;

  @Input() isCreateMode: boolean = false;

  savedData!: TaskForm;
  isEditing = false;

  statusList = taskStatusList;

  priorityList = taskPriorityList;

  // getSizeQualifier = getSizeQualifier;

  constructor(protected screen: ScreenService) {}

  ngOnInit() {
    this.isEditing = this.isCreateMode;
  }
  handleEditClick = () => {
    this.savedData = { ...this.task }
    this.isEditing = true;
  };

  handleSaveClick = ({ validationGroup }: DxButtonTypes.ClickEvent) => {
    if(!validationGroup.validate().isValid) return;
    // this.savedData = null;
    this.isEditing = false;
  };

  handleCancelClick = () => {
    // @ts-ignore
    this.task = { ...this.savedData };
    this.isEditing = false;
  };

  getNewTaskData = ()=> ({ ...this.task });

  getSizeQualifier = getSizeQualifier;
}
