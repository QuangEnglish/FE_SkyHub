import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import * as path from "path";
import {AuthLayoutComponent} from "./pages/layout/auth-layout/auth-layout.component";
import {RegisterComponent} from "./pages/layout/auth-layout/register/register.component";
import {MainLayoutComponent} from "./pages/layout/main-layout/main-layout.component";
import {UserManagermentComponent} from "./pages/HRM/user-managerment/user-managerment.component";
import {AccountManagementComponent} from "./pages/system/account-management/account-management.component";
import {SystemConfigComponent} from "./pages/system/system-config/system-config.component";
import { DepartmentManagermentComponent } from './pages/HRM/department/department-managerment/department-managerment.component';
import {LoginComponent} from "./pages/layout/auth-layout/login/login.component";
import {PositionManagermentComponent} from "./pages/HRM/position/position-managerment/position-managerment.component";
import {
  ListEmployeeManagermentComponent
} from "./pages/HRM/employee/list-employee-managerment/list-employee-managerment.component";
import {
  DetailEmployeeManagermentComponent
} from "./pages/HRM/employee/detail-employee-managerment/detail-employee-managerment.component";
import {
  ListContractManagermentComponent
} from "./pages/HRM/contract/list-contract-managerment/list-contract-managerment.component";
import {
  ListAttendanceManagermentComponent
} from "./pages/quanlychamcong/chamcong/list-attendance-managerment/list-attendance-managerment.component";
import {DashboardComponent} from "./pages/dashboard/dashboard/dashboard.component";
import {
  ListAttendanceLeaveComponent
} from "./pages/quanlychamcong/dangkylichnghiphep/list-attendance-leave/list-attendance-leave.component";

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'department',
        component: DepartmentManagermentComponent
      },
      {
        path: 'position',
        component: PositionManagermentComponent
      },
      {
        path: 'employee',
        component: ListEmployeeManagermentComponent
      },
      {
        path: 'detail-employee',
        component: DetailEmployeeManagermentComponent
      },
      {
        path: 'detail-employee/:id',
        component: DetailEmployeeManagermentComponent
      },
      {
        path: 'contract',
        component: ListContractManagermentComponent
      },
      {
        path: 'attendance',
        component: ListAttendanceManagermentComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'account',
        component: AccountManagementComponent
      },
      {
        path: 'system',
        component: SystemConfigComponent
      },
      {
        path: 'user',
        component: UserManagermentComponent,
      },
      {
        path: 'attendanceleave',
        component: ListAttendanceLeaveComponent
      },
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
