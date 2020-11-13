import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.authenticationService.logoutBackEnd();
            }
            else if (err.status === 400) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: `${err.error.error}`
                })
                this.authenticationService.logoutBackEnd();
            }

            else if (err.status === 403) {
                Swal.fire({
                    type: 'warning',
                    title: 'Oops...',
                    text: `${err.error.error}`,
                    showCancelButton: true,
                    confirmButtonColor: '#432ead',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Ok'
                }).then((result) => {

                    this.authenticationService.logoutBackEnd();

                })
            }

            else if (err.status === 500) {
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: `${err.error.error}`
                })
            }
            else if (err.status == 404) {

                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: `${err.error.message}`
                })
            }
            else if (err.status === 422) {
                for (let key in err.error.errors) {
                    let value = err.error.errors[key];
                    console.log(value);

                    if (value) {
                        Swal.fire({
                            type: 'error',
                            title: 'Oops...',
                            confirmButtonColor: "#432ead",
                            text: `${value}`
                        })
                    }
                }
            }


            const error = err.error.message || err.status || err.statusText;
            return throwError(error);
        }))
    }
}