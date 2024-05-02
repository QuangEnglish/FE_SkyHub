import {Component, DoCheck, OnInit} from '@angular/core';
import {AccountService} from "../../../service/account.service";
import {TransferChange, TransferItem} from "ng-zorro-antd/transfer";

@Component({
  selector: 'app-system-config',
  templateUrl: './system-config.component.html',
  styleUrls: ['./system-config.component.less']
})
export class SystemConfigComponent implements OnInit {
  resultActive = true;
  roleSelect: string = 'ADMIN'
  menuItems: TransferItem[] = []
  tableLoading: boolean = false
  $asTransferItems = (data: unknown): TransferItem[] => data as TransferItem[];

  constructor(private accountService: AccountService) {
  }

  async ngOnInit(): Promise<void> {
    this.getAllMenuItem()
    setTimeout(() => {
      this.getRoleByRoleName(this.roleSelect)
    }, 1000)
  }

  getRoleByRoleName(roleName: string) {
    this.accountService.getRoleByRoleName(roleName).subscribe({
      next: res => {
        const ret: TransferItem[] = []
        const listKeys = res.menuItems.map((l: any) => l.id);
        const hasOwnKey = (e: TransferItem): boolean => e.hasOwnProperty('id');
        this.menuItems = this.menuItems.map(e => {
          if (listKeys.includes(e['id']) && hasOwnKey(e)) {
            e.direction = 'right'
          }
          return e;
        });
      },
      complete: () => {
        this.tableLoading = false
      }
    })
  }

  getAllMenuItem() {
    this.tableLoading = true
    this.accountService.getAllMenuItem().subscribe({
      next: res => {
        const ret: TransferItem[] = [];
        res.forEach((item: any, i: number) => {
          ret.push({
            key: i,
            id: item.id,
            title: item.menuItemCode,
            menuItemName: item.menuItemName,
            permissions: item.permissions.sort((a: any, b: any) => a.id - b.id),
            direction: 'left',
            checked: false
          })
        })
        this.menuItems = [...this.menuItems, ...ret]
      }
    })
  }

  handleSelectChange($event: any) {
    this.menuItems = []
    this.getAllMenuItem()
    setTimeout(() => {
      this.getRoleByRoleName($event)
    }, 1000)
  }

  handleTranferSelectChange($event: any) {
    // console.log($event)
  }

  handleTranferChange(ret: TransferChange): void {
    console.log('nzChange', ret);
    const listKeys = ret.list.map(l => l['id']);
    const hasOwnKey = (e: TransferItem): boolean => e.hasOwnProperty('id');
    this.menuItems = this.menuItems.map(e => {
      if (listKeys.includes(e['id']) && hasOwnKey(e)) {
        if (ret.to === 'left') {
          delete e.hide;
        } else if (ret.to === 'right') {
          e.hide = false;
        }
      }
      return e;
    });
  }

  clickLog(e: any) {
    console.log(e)
  }
}
