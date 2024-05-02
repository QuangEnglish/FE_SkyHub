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
  isCollapsed = false

  @ViewChild(TemplateRef, { static: false }) template?: TemplateRef<{}>;


  constructor(private router: Router,
              private notification: NzNotificationService,
              private loginService :LoginService) { }

  ngOnInit(): void {

  }

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

}
