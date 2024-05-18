import {Component, Input, OnInit} from '@angular/core';
import {TaskForm} from "../../../core/task";
import {Router} from "@angular/router";
import notify from 'devextreme/ui/notify';
@Component({
  selector: 'app-task-kanban-card',
  templateUrl: './task-kanban-card.component.html',
  styleUrls: ['./task-kanban-card.component.less']
})
export class TaskKanbanCardComponent {

  @Input() task!: TaskForm;

  constructor(private router: Router) {
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
