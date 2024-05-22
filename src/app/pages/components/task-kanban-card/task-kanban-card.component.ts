import {Component, Input, OnInit} from '@angular/core';
import {TaskForm, TaskPriority, TaskStatus} from "../../../core/task";
import {Router} from "@angular/router";
import notify from 'devextreme/ui/notify';
import {Activity} from "../../../core/activities";
import {Notes} from "../../../core/notes";
import {Messages} from "../../../core/messages";
@Component({
  selector: 'app-task-kanban-card',
  templateUrl: './task-kanban-card.component.html',
  styleUrls: ['./task-kanban-card.component.less']
})
export class TaskKanbanCardComponent implements  OnInit{

  // @Input() task!: TaskForm;
  @Input() task!: any;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.task = {
      activities: "Activity[]",
      description: "string",
      calendarId: 1,
      endDate: "1",
      id: 1,
      text: "a",
      company: "a",
      priority: "qqw",
      startDate: 1,
      dueDate: 1,
      owner: "string",
      status: "TaskStatus",
      notes: "Notes",
      messages : {
        manager: "string",
        subject: "string",
        date: "string | Date",
        text: "string"
      },
      parentId: 1,
      progress: 1,
    }
  }

  getAvatarText = (name: string) => name.split(' ').map((name) => name[0]).join('');

  notify = (e: any) => {
    e.event.stopPropagation();
    notify(`Edit '${this.task.text}' card event`);
  };

  navigateToDetails = () => {
    this.router.navigate(['/planning-task-details']);
  };



}
