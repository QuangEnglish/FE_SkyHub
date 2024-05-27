import {Component, DoCheck, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {LoginService} from "../../../service/login.service";
import {NzNotificationService} from "ng-zorro-antd/notification";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, DoCheck {
  visible = true;
  isCollapsed = false;
  employeeName: any;
  userId: any;
  request: any = {
    listTextSearch: [],
    code: null,
    page: 0,
    name: null,
    size: 10, // -: desc | +: asc,
  };

  @ViewChild(TemplateRef, { static: false }) template?: TemplateRef<{}>;


  constructor(private router: Router,
              private notification: NzNotificationService,
              private loginService :LoginService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const payloadToken: any = token ? this.parseJwt(token) : null;
    const userObject = JSON.parse(payloadToken.user);
    this.employeeName = userObject.userDetailName;
    this.userId = userObject.userDetailId;
  }

  parseJwt(token: string): string {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  logOut(){
    this.visible = false;
    this.loginService.logout();
    this.router.navigate(['/auth/login']).then();
  }

  ngDoCheck(): void {
    if(document.body.offsetWidth <= 1024){
      this.isCollapsed = true
    } else {
      this.isCollapsed = false
    }
  }

  ninja(template2: TemplateRef<{}>): void {
    const notifyData = {
      name: 'Apple',
      color: 'red',
      message: 'Message title',
    };

    // this.notification.template(this.template!, { nzData: notifyData });

    this.notification.template(template2, { nzData: notifyData });
  }

  navigateToDetails = () => {
    this.visible = false;
    this.router.navigate(['/detail-employee/' + this.userId], {state: {page: this.request}});
  };

  navigateToChangePass = () => {
    this.visible = false;
    this.router.navigate(['/auth/changePassword']);
  };

  isPopupVisible = false;
  popupImageUrl = 'imgSinhNhatNodo.jpg'; // Thay bằng đường dẫn đến hình ảnh của bạn

  showPopup() {
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.isPopupVisible = false;
  }

}
