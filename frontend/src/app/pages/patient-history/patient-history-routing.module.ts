import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientHistoryPage } from './patient-history.page';

const routes: Routes = [
  {
    path: '',
    component: PatientHistoryPage
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
export class PatientHistoryPageRoutingModule {
}
