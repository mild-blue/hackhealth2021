import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DoctorGuard } from './guards/doctor/doctor.guard';
import { PatientGuard } from './guards/patient/patient.guard';
import { AuthGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/patient-home/patient-home.module').then(m => m.PatientHomePageModule)
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
    path: 'doctor',
    canActivate: [DoctorGuard],
    loadChildren: () => import('./pages/doctor-home/doctor-home.module').then(m => m.DoctorHomePageModule)
  },
  {
    path: 'heart-capture',
    canActivate: [PatientGuard],
    loadChildren: () => import('./pages/heart-capture/heart-capture.module').then(m => m.HeartCapturePageModule)
  },
  {
    path: 'patient-history',
    canActivate: [PatientGuard],
    loadChildren: () => import('./pages/patient-history/patient-history.module').then(m => m.PatientHistoryPageModule)
  },
  {
    path: 'invite-patient',
    canActivate: [DoctorGuard],
    loadChildren: () => import('./pages/invite-patient/invite-patient.module').then( m => m.InvitePatientPageModule)
  },
  {
    path: 'invite-patient-success/:code/:name',
    canActivate: [DoctorGuard],
    loadChildren: () => import('./pages/invite-patient-success/invite-patient-success.module').then( m => m.InvitePatientSuccessPageModule)
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
