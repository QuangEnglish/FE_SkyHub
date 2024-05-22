import { Activity } from './activities';
import { Notes } from './notes';
import { Messages } from './messages';

export const taskStatusList: string[] = [
  'Mới',
  'Đang xử lý',
  'Review',
  'Reopen',
];

export const taskPriorityList: string[] = [
  'Low',
  'Normal',
  'High',
];

export type TaskPriority = (typeof taskPriorityList)[number];

export type TaskStatus = (typeof taskStatusList)[number];

export type TaskForm = {
  activities: Activity[],
  description: string,
  calendarId?: number,
  endDate?: Date,
  id: any,
  text: string,
  company: string,
  priority: TaskPriority,
  startDate: string | Date | number,
  dueDate: string | Date | number,
  owner: string,
  status: TaskStatus,
  notes: Notes,
  messages: Messages,
  parentId: any,
  progress: number,
};


export const newTask: TaskForm = {
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
