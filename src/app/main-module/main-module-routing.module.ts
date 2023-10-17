import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainModuleComponent } from './main-module.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuardGuard } from '../guard/auth-guard.guard';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: MainModuleComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
    canActivate: [authGuardGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainModuleRoutingModule {}
