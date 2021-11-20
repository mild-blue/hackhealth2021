import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/patient-home/patient-home.module').then(m => m.PatientHomePageModule)
  },
  {
    path: 'heart-capture',
    loadChildren: () => import('./pages/heart-capture/heart-capture.module').then(m => m.HeartCapturePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./pages/verify/verify.module').then(m => m.VerifyPageModule)
  },
  {
    path: 'measure-button',
    loadChildren: () => import('./pages/measure-button/measure-button.module').then(m => m.MeasureButtonPageModule)
  },
  {
    path: 'doctor',
    loadChildren: () => import('./pages/doctor-home/doctor-home.module').then(m => m.DoctorHomePageModule)
  },
  {
    path: 'patient-history',
    loadChildren: () => import('./pages/patient-history/patient-history.module').then( m => m.PatientHistoryPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
