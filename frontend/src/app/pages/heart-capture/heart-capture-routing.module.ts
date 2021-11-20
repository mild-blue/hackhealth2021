import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HeartCapturePage } from './heart-capture.page';

const routes: Routes = [
  {
    path: '',
    component: HeartCapturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeartCapturePageRoutingModule {}
