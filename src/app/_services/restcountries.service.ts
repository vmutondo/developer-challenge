import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL } from '../API_CONFIG';
@Injectable({
  providedIn: 'root'
})
export class RestcountriesService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${URL.url}`)
  }
}
