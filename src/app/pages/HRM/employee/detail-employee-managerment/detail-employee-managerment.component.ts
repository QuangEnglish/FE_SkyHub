import {Component, OnInit} from '@angular/core';
import {DataService} from "../../../../service/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeService} from "../../../../service/employee.service";
import {ToastService} from "../../../../service/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {FileManagerService} from "../../../../service/file-manager.service";
import html2canvas from "html2canvas";
import * as jspdf from "jspdf";
@Component({
  selector: 'app-detail-employee-managerment',
  templateUrl: './detail-employee-managerment.component.html',
  styleUrls: ['./detail-employee-managerment.component.less']
})
export class DetailEmployeeManagermentComponent implements OnInit {

  contactId!: number;

  contactName = 'Quay lại danh sách';

  isLoading = false;
  isPanelOpened = true;

  constructor(
    private service: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private fileManagerService: FileManagerService
  ) {
    this.contactId = Number(this.activatedRoute.snapshot.params['id']);
  }

  ngOnInit(): void {
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
}
