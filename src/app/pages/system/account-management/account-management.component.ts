import { Component, OnInit } from '@angular/core';
import {AccountService} from "../../../service/account.service";
import {AccountSearchResponse, AccountSearchRequest} from "./types/account";

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.less']
})
export class AccountManagementComponent implements OnInit {
  searchActive: boolean = true
  resultActive: boolean = true
  tableLoading: boolean = false
  pagination: {total: number, current: number, pageSize: number} = {
    total: 0,
    current: 0,
    pageSize: 10
  }
  tableData: Array<AccountSearchResponse> = []
  searchData: object = {}
  columns = [
    // {
    //   title: 'Tên nhân viên',
    //   width: '200px',
    //   compare: (a: any, b: any) => a.fullName - b.fullName,
    // },
    {
      title: 'Email',
      width: '200px',
      compare: (a: any, b: any) => a.email - b.email,
    },
    {
      title: 'Trạng thái',
      width: '140px',
      compare: (a: any, b: any) => a.status - b.status,
    },
    {
      title: 'Trạng thái kích hoạt',
      width: '170px',
      compare: (a: any, b: any) => a.active - b.active,
    },
    {
      title: 'Quyền',
      width: '140px',
      compare: (a: any, b: any) => a.roles - b.roles,
    },
    {
      title: 'Ngày tạo',
      width: '140px',
      compare: (a: any, b: any) => a.createdAt - b.createdAt ,
    },
    {
      title: 'Ngày cập nhật',
      width: '140px',
      compare: (a: any, b: any) => a.updatedAt - b.updatedAt,
    },

  ];


  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.getData()
  }
  getData () {
    this.accountService.getAllAccount(this.searchData, this.pagination.current, this.pagination.pageSize).subscribe({
      next: (res) => {
        console.log(res)
        this.tableData = res.dataList
        this.pagination.current = res.pageIndex
        this.pagination.pageSize = res.pageSize
        this.pagination.total = res.totalElements
      }
    })
  }
  handlePageIndexChange ($event: number) {
    this.pagination.current = $event - 1
    this.getData()
  }

  handlePageSizeChange ($event: number) {
    this.pagination.pageSize = $event
    this.getData()
  }
}
