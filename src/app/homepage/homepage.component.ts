import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  authValue: any;

  constructor(private _auth: AuthService) {
    this.authValue = this._auth.currentUserValue;
  }

  ngOnInit() { }

  logout() {
    this._auth.logoutBackEnd()
  }
}
