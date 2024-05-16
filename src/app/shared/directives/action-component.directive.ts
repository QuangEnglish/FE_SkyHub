import {AfterViewInit, Directive, DoCheck, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {LoginService} from "../../service/login.service";

@Directive({
  selector: '[appActionComponent]'
})
export class ActionComponentDirective implements OnInit, AfterViewInit, DoCheck{

  @Input() jhiActionComponent!: string;

  userComponent: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private loginService:LoginService,
  ) { }

  ngAfterViewInit(): void {
  }

  ngDoCheck(): void {
  }

  ngOnInit(): void {
    this.checkAuthorize();
  }

  checkAuthorize(){
    const optionalRole = this.loginService.getListRolesMenuItem();
    this.userComponent = optionalRole[0];
    for (let index = 0; index < this.userComponent.length; index++){
      if (this.jhiActionComponent === this.userComponent[index].label){
        return this.el.nativeElement.hidden = this.userComponent[index].value;
      }
    }
    this.el.nativeElement.hidden = true;
  }

}
