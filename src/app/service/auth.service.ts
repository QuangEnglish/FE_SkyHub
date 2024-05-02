import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {apiAuth} from "./api";
import {Router} from "@angular/router";


const AUTH_API:string = "http://localhost:8080";
const token:string = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoie1widXNlck5hbWVcIjpcImFkbWluQGFkbWluLmNvbVwiLFwiZW1haWxcIjpcImFkbWluQGFkbWluLmNvbVwiLFwiY29tcGFueUlkXCI6MixcImNvbXBhbnlOYW1lXCI6XCJzZnNhZmRzZmRzZlwiLFwicm9sZXNcIjpbe1wiaWRcIjoxLFwicm9sZU5hbWVcIjpcIkFETUlOXCJ9XX0iLCJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE3MDY1MDY3OTYsImV4cCI6MTcwNjUwODIzNn0.H-dv1TVDt0cXcaSnI0R2sC4hQXKcS18dcFf2MzKmX6U"
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginAccount(payload: any): Observable<any> {
    return this.http.post(AUTH_API + apiAuth.apiLogin, payload);
  }

  registerAccount(payload: any): Observable<any> {
    return this.http.post(AUTH_API + apiAuth.apiRegister, payload);
  }
}
