import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TableListComponent } from './table-list/table-list.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  { path: 'login',   component: LoginComponent },
  { path: 'home',   component: HomepageComponent, canActivate: [AuthGuard] },
  { path: 'table-list',   component: TableListComponent, canActivate: [AuthGuard] },
  { path: 'statistics',   component: StatisticsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
