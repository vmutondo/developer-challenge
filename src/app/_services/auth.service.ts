
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
      JSON.parse(localStorage.getItem("2iBi"))
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
    return this.http.post<any>(`${URL.url_jwt_auth}/guest/login`, credentials).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem("2iBi", JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.currentUserRoleSubject = user.nome;
          
        }
        else if(user == null) {
          alert(user)
        }
        return user;
      }) );
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  getToken(): string {
    let data = localStorage.getItem("2iBi");
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
    localStorage.removeItem("2iBi");
    this.currentUser = null;
    this.router.navigate(["/login"]);
  }

}
