import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from "../../../../service/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeService} from "../../../../service/employee.service";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FileManagerService} from "../../../../service/file-manager.service";
import html2canvas from "html2canvas";
import * as jspdf from "jspdf";
import {Subject, Subscription} from "rxjs";
import {Contact} from "../../../../core/contact";
import * as moment from "moment/moment";
import {DepartmentService} from "../../../../service/department.service";
import {PositionService} from "../../../../service/position.service";

@Component({
  selector: 'app-detail-infor-employee',
  templateUrl: './detail-infor-employee.component.html',
  styleUrls: ['./detail-infor-employee.component.less']
})
export class DetailInforEmployeeComponent implements OnInit {

  contactId!: number;

  contactName = 'Quay lại danh sách';

  isLoading = false;
  isPanelOpened = true;

  //employee panel
  @Input() isOpened = false;
  @Input() isMarTop = false;
  @Input() isDisablePinClose = false;
  @Input() userId: any;
  @Output() isOpenedChange = new EventEmitter<boolean>();
  @Output() pinnedChange = new EventEmitter<boolean>();
  private pinEventSubject = new Subject<boolean>();
  user!: Contact;
  pinned = false;
  isEditing = false;
  isPinEnabled = false;
  userPanelSubscriptions: Subscription[] = [];
  lstDepartment: any[] = [];
  lstPosition: any[] = [];
  payloadDepartment = {name: null, status: null};
  payloadPosition = {positionCode: null, positionName: null, isActive: 1};
  avatarFile!: File;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 0,
    name: null,
    size: 10, // -: desc | +: asc,
  };


  constructor(
    private service: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private fileManagerService: FileManagerService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
  ) {
    this.contactId = Number(this.activatedRoute.snapshot.params['id']);
  }

  ngOnInit(): void {
    this.loadUserById(28);
    this.fetchDepartment();
    this.fetchPosition();
  }

  refresh = () => {
    this.isLoading = true;
  };

  redirectToPreviousPage() {
    this.router.navigate(['/employee']);
  }

//  async onExportPdf() {
  // this.spinner.show().then();
  // this.employeeService.exportPdf().subscribe(async res => {
  //   const isJsonBlob = (data: any) => data instanceof Blob && data.type === 'application/json';
  //   const responseData = isJsonBlob(res.body) ? await (res.body).text() : res.body || {};
  //   if (typeof responseData === "string") {
  //     const resJson = JSON.parse(responseData);
  //     this.toastService.openErrorToast(resJson.msgCode);
  //   } else {
  //     const currentDate = moment(new Date()).format('DDMMYYYY');
  //     this.fileManagerService.downloadFile(res, 'ho_so_nhan_vien_' + currentDate + '.pdf');
  //     this.toastService.openSuccessToast('Xuất pdf thành công');
  //   }
  //   this.spinner.hide().then();
  // }, error => {
  //   this.toastService.openErrorToast(error.error.msgCode);
  //   this.spinner.hide().then();
  // });
//  }

  onExportPdf(){
    this.spinner.show().then();
    var data = document.getElementById('contentToConvert');
    html2canvas(data!).then(canvas => {
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf.default('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('ho_so_nhan_vien.pdf'); // Generated PDF
      this.spinner.hide().then();
    }, error => {
      this.toastService.openErrorToast("Lỗi xuất file PDF");
      this.spinner.hide().then();
    });
  }

  loadUserById = (id: number) => {
    this.isLoading = true;
    this.employeeService.getEmployeeId(id).subscribe(res => {
      if (res && res.code === "OK") {
        this.user = res.data;
        this.user.birthday = moment(res.data.birthday).format('DD/MM/YYYY');
        this.isLoading = false;
        this.isEditing = false;
      } else {
        this.toastService.openErrorToast(res.msgCode);
      }
    });
  };

  fetchDepartment() {
    this.departmentService.searchDepartment(this.payloadDepartment, {page: 0, size: -1}).subscribe((response: any) => {
      if (response && response.code === "OK") {
        this.lstDepartment = response.data.content;
        this.lstDepartment.sort((a, b) => a.departmentName.localeCompare(b.departmentName));
      }
    });
  }

  fetchPosition() {
    this.positionService.searchPosition(this.payloadPosition, {page: 0, size: -1}).subscribe((response: any) => {
      if (response && response.code === "OK") {
        this.lstPosition = response.data.data;
        this.lstPosition.sort((a, b) => a.positionName.localeCompare(b.positionName));
      }
    });
  }

}
