import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: boolean = false;
  spinner: boolean = false;
  confirmarPasswordBoolean: boolean = false;
  myForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  userauth: any;
  userauthAfter: any;
  loginNormal: boolean = true;
  responseUser: any;


  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) {
    //   console.log(this.authService.currentUserValue);
      
    // if (this.authService.currentUserValue) {
    //   this.router.navigate(['/home']);
    // }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required, Validators.minLength(5)])
      ],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    if (this.loginForm.valid) {
      this.spinner = true;
      this.authService.loginBackEnd(this.loginForm.controls.username.value, this.loginForm.controls.password.value).subscribe(data => {
        this.spinner = false;
        this.router.navigate(['/home'])
      },
        (error: HttpErrorResponse) => {
          this.spinner = false;

        })
    }
  }

}
