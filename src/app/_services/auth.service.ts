
import { Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { MainUser } from "../_models/mainUser";
import { URL } from "../API_CONFIG";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, retry, catchError } from "rxjs/operators";
import * as jwt_decode from "jwt-decode";

@Injectable()
export class AuthService {
  private currentUserSubject: BehaviorSubject<MainUser>;
  private currentUserRoleSubject: any;
  public currentUser: Observable<MainUser>;
  public authenticated: boolean;

  constructor(
    private http: HttpClient,    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<MainUser>(
      JSON.parse(localStorage.getItem("sw"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): MainUser {
    return this.currentUserSubject.value;
  }
  public get currentUserRole(): any {
    return this.currentUserRoleSubject;
  }

  loginBackEnd(username: string, password: string) {
    let credentials = {
      username: username,
      password: password
    };
    return this.http.post<any>(`${URL.url}/guest/login`, credentials).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem("sw", JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.currentUserRoleSubject = user.nome;
          
        }
        else if(user == null) {
          alert(user)
        }
        return user;
      }) );
  }

  loginBackEndAdmin(username: string, password: string) {
    let credentials = {
      username: username,
      password: password
    };
    return this.http.post<any>(`${URL.url}/guest/catalayzer-login`, credentials).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem("sw", JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.currentUserRoleSubject = user.nome;
          
        }
        else if(user == null) {
          alert(user)
        }
        return user;
      }) );
  }

  loginBackEndNewPassWord(id:string, password: string, tenant_id: string) {

    let body  = {
      password: password,
      user_id:id
    }
 

    return this.http.post<any>(`${URL.url}/guest/${tenant_id}/set/password`, body).pipe(
      map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes

          localStorage.setItem("sw", JSON.stringify(user));
          // localStorage.setItem('role', user.role.id)
          this.currentUserSubject.next(user);
          this.currentUserRoleSubject = user.nome;
          
        }
        else if(user == null) {
          alert(user)
        }
        return user;
      }) );
  }

  loginBackEndResetPassWord(email: string, password: string){
    let novo = {
      email: email,
      password: password
    };

    return this.http.post<any>(`${URL.url}/forget/password`, novo).pipe(
      retry(1),
      // catchError(this.handleError('resetPassword', null))
    );
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  getToken(): string {
    let data = localStorage.getItem("sw");
    return data;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  logoutBackEnd() {
    localStorage.removeItem("sw");
    this.currentUser = null;
    this.router.navigate(["/login"]);
  }

}
