import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import * as moment from "moment";
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  token: BehaviorSubject<any> = new BehaviorSubject<any>('');
  header: any;
  getHeader(){
    return this.header;
  }
  constructor(private router: Router) {
  }

  setToken(){
    if (!localStorage.getItem('token')) {
      this.token.subscribe(val => {
        this.header = ['Authorization', `Bearer ` +  val];
      })
    } else {
      this.header = ['Authorization', `Bearer ` + localStorage.getItem('token')]
    }
  }

  comeLogin(){
    if(!localStorage.getItem('token') || !this.isLoggedIn){
      this.router.navigate(['/auth/login']).then();
    }
  }

  setSession(authResult: any) {
    localStorage.setItem('token', authResult.token);
    const tmp = this.parseJwt(authResult.token);
    if(tmp){
      localStorage.setItem('expireIn', tmp.exp);
    }
  }

  isLoggedIn() {
    if(this.getExpiration()){
      return moment().isBefore(this.getExpiration());
    }
    return false;
  }

  getExpiration() {
    const expiration = localStorage.getItem('expireIn');
    if(expiration){
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }
    return null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expireIn');
    localStorage.clear();
    this.comeLogin();
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };
}
