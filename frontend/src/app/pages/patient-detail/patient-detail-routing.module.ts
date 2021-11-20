import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientDetailPage } from './patient-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PatientDetailPage
  },
  {
    path: ':recordId',
    loadChildren: () => import('../measurement-detail/measurement-detail.module').then(m => m.MeasurementDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientDetailPageRoutingModule {
}
