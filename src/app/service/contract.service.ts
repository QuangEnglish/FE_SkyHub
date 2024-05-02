import {Injectable} from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

const AUTH_API: string = "http://localhost:8080/api/v1/contract";
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  token: BehaviorSubject<any> = new BehaviorSubject<any>('');
  header = ['Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiIiwic3ViIjoiaHF1YW5nYW5oMkBnbWFpbC5jb20iLCJpYXQiOjE3MDkzNzYzMjMsImV4cCI6MTcwOTQ2MjcyM30.olrDEr5ep7mXNPAYbBpchybsOIgqeIswTrX_W3evSsQ']

  constructor(private httpClient: HttpClient) {
    if (!localStorage.getItem('token')) {
      this.token.subscribe(val => {
        this.header = ['Authorization', 'Bearer ' + val];
      })
    } else {
      this.header = ['Authorization', 'Bearer ' + localStorage.getItem('token')]
    }
  }

  search(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/search",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  searchForEmployee(payload: any, pageable: any): Observable<any> {
    return this.httpClient.post(
      AUTH_API + "/searchForEmployee",
      payload,
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        params: pageable,
      }
    )
  }

  create(file: File, contractDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contractCode', contractDTO.contractCode);
    formData.append('contractType', contractDTO.contractType);
    return this.httpClient.post(
      AUTH_API + "/create",
      formData,
      {
        headers: new HttpHeaders().set(this.header[0], this.header[1]),
        observe: 'response'
      }
    );
  }

  createForEmployee(userDetailContractDTO: any): Observable<any> {
    return this.httpClient.post(AUTH_API + "/createForEmployee",
      userDetailContractDTO,
      {
        observe: 'response'
      })
  }

  getContractId(id: number | undefined): Observable<any> {
    return this.httpClient.get(
      AUTH_API + "/detail" + '/' + id,
    );
  }

  edit(file: File, contractDTO: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contractId', contractDTO.contractId);
    formData.append('contractCode', contractDTO.contractCode);
    formData.append('contractType', contractDTO.contractType);
    return this.httpClient.put(
      AUTH_API,
      formData,
      {
        headers: new HttpHeaders().set(this.header[0], this.header[1]),
        observe: 'response'
      }
    );
  }

  editForEmployee(payload: any): Observable<any> {
    return this.httpClient.put(
      AUTH_API+ "/updateForEmployee",
      payload
    );
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(
      AUTH_API + "/delete" + '/' + id,
    );
  }

  deleteForEmployee(id: string): Observable<any> {
    return this.httpClient.delete(
      AUTH_API + "/deleteForEmployee" + '/' + id,
    );
  }

  downLoadFile(fileName: any): Observable<any> {
    const params = new HttpParams().set('fileName', fileName);
    return this.httpClient.post(AUTH_API + "/download", null, {
      responseType: 'blob',
      observe: 'response',
      params: params
    });
  }
}
