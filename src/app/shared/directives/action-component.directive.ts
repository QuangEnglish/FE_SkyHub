import {AfterViewInit, Directive, DoCheck, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {LoginService} from "../../service/login.service";

@Directive({
  selector: '[appCheckAuthorize]'
})
export class ActionComponentDirective implements OnInit, AfterViewInit{

  // @Input() jhiActionComponent!: string;

  userComponent: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private loginService:LoginService,
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.checkAuthorize();
  }

  checkAuthorize(){
    // const optionalRole = this.loginService.getListRolesMenuItem();
    // this.userComponent = optionalRole[0];
    // if(this.userComponent.roleName === "ADMIN"){
    //   return this.el.nativeElement.hidden = true;
    // }
    //
    // // const lstMenuItem = this.userComponent.menuItems;
    // // for (let index = 0; index < lstMenuItem.length; index++){
    // //   if (this.jhiActionComponent === this.userComponent[index].label){
    // //     return this.el.nativeElement.hidden = this.userComponent[index].value;
    // //   }
    // // }
    // return this.el.nativeElement.hidden = false;
    const optionalRole = this.loginService.getListRolesMenuItem();
    if (optionalRole && optionalRole.length > 0) {
      this.userComponent = optionalRole[0];
      if (this.userComponent.roleName !== "ADMIN") {
        this.el.nativeElement.hidden = true;
      } else {
        this.el.nativeElement.hidden = false;
      }
    } else {
      console.error('No roles found');
      this.el.nativeElement.hidden = false; // Hoặc hành động mặc định khác
    }

  }

}
