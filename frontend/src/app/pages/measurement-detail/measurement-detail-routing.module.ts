import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MeasurementDetailPage } from './measurement-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MeasurementDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeasurementDetailPageRoutingModule {}
