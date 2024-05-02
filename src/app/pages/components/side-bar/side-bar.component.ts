import {Component, DoCheck, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.less']
})
export class SideBarComponent implements OnInit, DoCheck {
  isCollapsed = false
  subMenuQLNS: boolean = false
  constructor(private router: Router) { }

  ngDoCheck(): void {
    if (this.router.url === '/user') {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    } else if (this.router.url === '/department') {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    } else if (this.router.url === '/position') {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    }
    else if (this.router.url === '/employee') {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    }
    else if (this.router.url.includes('/detail-employee')) {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    }
    else if (this.router.url === '/contract') {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    }
    else if (this.router.url === '/attendance') {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    }
    else if (this.router.url === '/attendanceleave') {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    }
    else if (this.router.url === '/register') {
      // this.isCollapsed = false
      this.subMenuQLNS = true
    }
    else if (this.router.url === '/system' || this.router.url === '/account') {
      // this.isCollapsed = true
    } else {
      this.subMenuQLNS = false
    }
    if(document.body.offsetWidth <= 1024){
      this.isCollapsed = true
    } else {
      this.isCollapsed = false
    }
  }

  ngOnInit(): void {

  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    console.log("//"+this.isCollapsed);
  }
}
