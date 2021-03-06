import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientHomePage } from './patient-home.page';
import { PatientGuard } from '../../guards/patient/patient.guard';

const routes: Routes = [
  {
    path: '',
    component: PatientHomePage,
    canActivate: [PatientGuard],
    children: [
      {
        path: 'measure',
        loadChildren: () => import('../measure-button/measure-button.module').then(m => m.MeasureButtonPageModule)
      },
      {
        path: 'history',
        loadChildren: () => import('../patient-history/patient-history.module').then(m => m.PatientHistoryPageModule)
      },
      {
        path: '',
        redirectTo: '/patient/measure',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/patient/measure',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientHomePageRoutingModule {
}
