import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth-module',
    loadChildren: () =>
      import('./auth-module/auth-module.module').then(
        (m) => m.AuthModuleModule
      ),
  },
  {
    path: 'main-module',
    loadChildren: () =>
      import('./main-module/main-module.module').then(
        (m) => m.MainModuleModule
      ),
  },
  { path: '**', redirectTo: 'auth-module', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
