import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskForm, taskPriorityList, taskStatusList} from "../../../core/task";
import {getSizeQualifier, ScreenService} from "../../../service/screen.service";
import {DxButtonTypes} from "devextreme-angular/ui/button";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {NzUploadFile} from "ng-zorro-antd/upload";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "../../../service/toast.service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ProjectService} from "../../../service/project.service";
import {EmployeeService} from "../../../service/employee.service";
import {en_US, NzI18nService} from "ng-zorro-antd/i18n";
import {differenceInCalendarDays} from "date-fns";
import {TaskService} from "../../../service/task.service";

@Component({
  selector: 'app-task-form-management',
  templateUrl: './task-form-management.component.html',
  styleUrls: ['./task-form-management.component.less']
})
export class TaskFormManagementComponent implements OnInit, AfterViewChecked {

  public Editor = ClassicEditor;
  idProject: any;
  responsePagination: any;
  isUpdate = false;
  isView = false;
  continueAdd: any = false;
  isViewConfirmCancel: any;
  data: any;
  addForm: any;
  lstEmployee: any[] = [];
  lstTaskStatus: any[] = [
    {code: 1, name: "Mới"},
    {code: 2, name: "Đang xử lý"},
    {code: 3, name: "Review"},
    {code: 4, name: "Reopen"},
    {code: 5, name: "Hoàn thành"},
  ];
  lstPriority: any[] = [
    {code: 1, name: "Mức 1"},
    {code: 2, name: "Mức 2"},
    {code: 3, name: "Mức 3"},
  ];
  payloadEmployee = {
    employeeCode: null,
    employeeName: null,
    employeeEmail: null,
    employeeGender: null,
    positionId: null,
    departmentId: null
  };
  startDayErrorMessage = '';
  endDayErrorMessage = '';
  avatarFile!: File;
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  previewTitle: string | undefined = '';
  listOfOption: string[] = [];

  @Output() clickCancel = new EventEmitter();
  @Output() clickSave = new EventEmitter();


  constructor(
    private router: Router,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private i18n: NzI18nService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.idProject = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.i18n.setLocale(en_US);
    this.checkIsViewOrUpdate();
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const genderCode = year + month + day + hours + minutes;
    this.addForm = this.formBuilder.group({
      taskCode: 'T'+genderCode,
      taskName: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      taskDescription: new FormControl(null),
      taskStatus: new FormControl(null, [Validators.required]),
      startDay: new FormControl(null, [Validators.required]),
      endDay: new FormControl(null, [Validators.required]),
      followId: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      employees: [[]],
    });
    if (this.isUpdate || this.isView) {
      this.taskService.getTaskId(this.idProject).subscribe(res => {
        if (res && res.code === "OK") {
          const dataProject = res.data;
          this.data = dataProject;
          this.addForm.patchValue(dataProject);
          this.addForm.get('employees')?.setValue(this.data.employees);
          this.fileList = [
            {
              uid: '-1',
              name: this.data.customerAvatar,
              status: 'done',
              url: 'http://localhost:8080/api/v1/project/'+ this.data.customerAvatar // Đường dẫn đến ảnh đã tải lên
            }
          ];
        } else {
          this.toastService.openErrorToast(res.msgCode);
        }
      });
    }
    setTimeout(() => {
      this.fetchEmployee();
    })
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  checkIsViewOrUpdate() {
    if (this.router.url.includes("/view")) {
      this.isView = true;
    } else if (this.router.url.includes("/detail")) {
      this.isUpdate = true;
    } else {
      this.isView = false;
      this.isUpdate = false;
    }
  }

  submitForm() {
    for (const i in this.addForm.controls) {
      this.addForm.controls[i].markAsDirty();
      this.addForm.controls[i].updateValueAndValidity();
    }
    if (this.addForm.valid) {
      const data = this.addForm.getRawValue();
      data.id = this.idProject;
      data.taskCode = data.taskCode.trim();
      data.taskName = data.taskName.trim();
      data.taskDescription = data.taskDescription.trim();
      data.followId = data.followId ? data.followId : null;
      data.startDay = data.startDay ? data.startDay : null;
      data.endDay = data.endDay ? data.endDay : null;
      data.taskStatus = data.taskStatus ? data.taskStatus : null;
      data.projectId = this.idProject ? this.idProject : null;
      data.priority = data.priority ? data.priority : null;
      data.employees = data.employees ? data.employees : null;
      if (this.isUpdate) {
        data.startDay = new Date(data.startDay);
        data.endDay = new Date(data.endDay);
        this.taskService.edit(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast("Cập nhật thành công");
            this.clickSave.emit();
            this.addForm.reset();
            this.goBack();
          } else {
            this.toastService.openErrorToast(res.msgCode);
            this.addForm.controls.code.setErrors({'error': true});
          }
        }, error => {
          console.log(error);
        });
      } else {
        this.taskService.create(data).subscribe(res => {
          if (res && res.code === "OK") {
            this.toastService.openSuccessToast("Thêm mới thành công");
            this.clickSave.emit();
            this.addForm.reset();
            if (!this.continueAdd) {
              this.goBack();
            } else {
              this.continueAdd = false;
            }
          } else {
            this.toastService.openErrorToast(res.msgCode);
            this.addForm.controls.code.setErrors({'error': true});
          }
        }, error => {
          console.log(error);
        });
      }
    }
  }


  cancelConfirm() {
    this.goBack();
  }

  goBack() {
    this.router.navigate(['/task-board/', this.idProject],
      {
        state: {
          response: this.responsePagination,
          isCreate: false,
        },
      }).then();
  }

  onCancelConfirm() {
    this.isViewConfirmCancel = false;
  }

  fetchEmployee() {
    this.employeeService.searchEmployee(this.payloadEmployee, {page: 0, size: -1}).subscribe(res => {
      if (res && res.code === "OK") {
        this.lstEmployee = res.data.data;
        this.listOfOption =  this.lstEmployee.map(res => `${res.employeeName} - ${res.employeeCode}`);
        this.lstEmployee = this.lstEmployee.map(item => ({
          ...item,
          employeeName: item.employeeName + " - " + item.employeeCode
        }));
        this.lstEmployee.sort((a, b) => a.employeeName.localeCompare(b.employeeName));
      }
    }, (error: any) => {
      console.log(error);
    })
  }

  isDisableDateFromToday = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0;
  };

  onChangeStartDay(event: any) {
    if (event) {
      const startDay = new Date(event);
      this.startDayErrorMessage = '';
      if (this.addForm.getRawValue().endDay) {
        const endDay = new Date(this.addForm.getRawValue().endDay);
        if (startDay >= endDay) {
          this.addForm.get('startDay')?.setErrors({
            'lessThanExpire': true
          });
          this.startDayErrorMessage = this.startDayErrorMessage + 'Ngày bắt đầu phải trước Ngày kết thúc';
          this.addForm.get('startDay')?.markAsDirty();
          return;
        } else {
          this.addForm.get('startDay')?.setErrors(null);
          this.addForm.get('endDay')?.setErrors(null);
          this.startDayErrorMessage = '';
          this.endDayErrorMessage = '';

        }
      }
    } else {
      if (this.addForm.get('startDay')?.touched) {
        this.addForm.get('startDay')?.setErrors({
          'required': true
        });
        this.startDayErrorMessage = 'Ngày bắt đầu không được để trống';
        this.addForm.get('startDay')?.markAsDirty();
      }
    }
  }

  onChangeEndDay(event: any) {
    if (event) {
      const endDay = new Date(event);
      if (event && this.addForm.getRawValue().startDay) {
        const startDay = new Date(this.addForm.getRawValue().startDay);
        if (endDay <= startDay) {
          this.addForm.get('endDay')?.setErrors({
            'lessThanExpire': true
          });
          this.endDayErrorMessage = 'Ngày kết thúc phải sau Ngày bắt đầu';
          return;
        } else {
          this.onChangeStartDay(this.addForm.getRawValue().startDay);
          this.addForm.get('endDay')?.setErrors(null);
          this.endDayErrorMessage = '';
        }
      }
    } else {
      if (this.addForm.get('endDay')?.touched) {
        this.addForm.get('endDay')?.setErrors({
          'required': true
        });
        this.endDayErrorMessage = 'Ngày kết thúc không được để trống';
        this.addForm.get('endDay')?.markAsDirty();
      }
    }
  }

  handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
    this.previewTitle = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  };

  handleCancel = () => this.previewVisible = false;

  getBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  beforeUpload = (file: NzUploadFile, fileList: NzUploadFile[]): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.toastService.openErrorToast('File upload phải là JPG/PNG !');
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.toastService.openErrorToast('File upload phải lớn hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

}
